import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q") || "";

        let query = `
            SELECT *
            FROM products
        `;
        const values = [];

        if (q) {
            query += `
                WHERE name ILIKE $1
                OR barcode ILIKE $1
            `;
            values.push(`%${q}%`);
        }

        query += ` ORDER BY created_at DESC`;

        const { rows } = await pool.query(query, values);

        return NextResponse.json(
            { success: true, payload: rows },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
