import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get('q'); 

    if (!searchTerm) {
        return NextResponse.json({ success: false, message: "Search term required" }, { status: 400 });
    }

    try {
        const query = `
            SELECT 
                c.name,
                c.phone,
                o.order_id,
                o.total_amount,
                o.total_discount_amount AS discount,
                o.subtotal_amount AS subtotal,
                p.payment_status,
                o.created_at AS date,
                JSON_AGG(JSON_BUILD_OBJECT('name', pr.name, 'quantity', oi.quantity)) AS product_list
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN payments p ON o.order_id = p.order_id
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products pr ON oi.product_id = pr.product_id
            WHERE c.phone ILIKE $1 OR CAST(o.order_id AS TEXT) = $2
            GROUP BY o.order_id, c.name, c.phone, p.payment_status, o.created_at
            ORDER BY o.created_at DESC
        `;

        const data = await pool.query(query, [`%${searchTerm}%`, searchTerm]);

        return NextResponse.json({ 
            success: true, 
            payload: data.rows 
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}