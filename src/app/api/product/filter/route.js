import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        let category_id = searchParams.get('category');

        let query = `SELECT * FROM products`;
        let values = [];

        if (category_id && category_id !== '') {
            query += ` WHERE category_id = $1`;
            values.push(category_id);
        }

        const data = await pool.query(query, values);
        const result = data.rows;

        return NextResponse.json({
            success: true,
            message: result.length > 0 ? 'Successfully fetched data' : 'No product found',
            payload: result
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}
