import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const body = await req.json();
        const email = body?.email ? body.email.trim().toLowerCase() : "";
        const otp = body?.otp ? body.otp.trim() : "";
        const newPassword = body?.newPassword || "";

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { success: false, message: "Email, OTP code, and new password are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, message: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        const userCheck = await pool.query(
            `SELECT user_id, name, email FROM users 
             WHERE LOWER(email) = LOWER($1) 
               AND reset_token = $2 
               AND reset_token_expires_at > CURRENT_TIMESTAMP`,
            [email, otp]
        );

        if (userCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired verification code" },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await pool.query(
            `UPDATE users 
             SET password = $1, reset_token = NULL, reset_token_expires_at = NULL 
             WHERE LOWER(email) = LOWER($2)`,
            [hashedPassword, email]
        );

        return NextResponse.json({
            success: true,
            message: "Your password has been updated successfully. You can now log in."
        });
    } catch (error) {
        console.error("User Password Reset Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to reset password" },
            { status: 500 }
        );
    }
}
