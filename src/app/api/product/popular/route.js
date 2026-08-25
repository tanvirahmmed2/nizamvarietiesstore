import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const query = `
            SELECT p.*, COALESCE(SUM(oi.quantity), 0) AS total_sold
            FROM products p
            LEFT JOIN order_items oi ON p.product_id = oi.product_id
            WHERE p.is_active = true OR p.is_active IS NULL
            GROUP BY p.product_id
            ORDER BY total_sold DESC, p.created_at DESC
            LIMIT 10
        `;

        const data = await pool.query(query);
        const result = data.rows || [];

        return NextResponse.json({
            success: true,
            message: result.length > 0 ? 'Successfully fetched popular items' : 'No items found',
            payload: result
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}
