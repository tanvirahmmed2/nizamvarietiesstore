import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/database/secret";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // 1. Validate Input
        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            // 2. Find user in database
            const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
            const user = result.rows[0];

            if (!user) {
                return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
            }

            // 3. Check Password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
            }

            // 4. Generate JWT Token
            const token = jwt.sign(
                { user_id: user.user_id, email: user.email },
                JWT_SECRET,
                { expiresIn: '20y' }
            );

            // 5. Create Response and set Cookie
            const response = NextResponse.json({
                message: `Welcome back, ${user.name}`,
                success: true
            }, { status: 200 });

            // Set the cookie (httpOnly for security)
            response.cookies.set("nvs_user_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 86400, // 1 day
                path: "/",
            });

            return response;

        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}