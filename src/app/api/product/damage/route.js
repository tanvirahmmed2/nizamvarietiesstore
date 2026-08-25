import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const client = await pool.connect();
    try {
        const body = await req.json();
        const items = Array.isArray(body.items) && body.items.length > 0 ? body.items : [body];

        if (!items.length || !items[0].product_id) {
            return NextResponse.json({ success: false, message: "No items provided for withdrawal" }, { status: 400 });
        }

        for (const item of items) {
            if (!item.product_id || !item.quantity || parseInt(item.quantity) < 1) {
                return NextResponse.json({ success: false, message: "Invalid product or quantity in selection" }, { status: 400 });
            }
        }

        await client.query('BEGIN');

        const damageQuery = `
            UPDATE products 
            SET stock = stock - $1 
            WHERE product_id = $2 AND stock >= $1
            RETURNING name, stock;
        `;
        
        const results = [];
        for (const item of items) {
            const res = await client.query(damageQuery, [parseInt(item.quantity), item.product_id]);
            if (res.rowCount === 0) {
                throw new Error(`Insufficient stock for item #${item.product_id}`);
            }
            results.push(res.rows[0]);
        }

        await client.query('COMMIT');

        const message = items.length === 1
            ? `Confirmed: ${results[0].name} stock reduced to ${results[0].stock}`
            : `Confirmed: Stock withdrawn successfully for ${results.length} products`;

        return NextResponse.json({ 
            success: true, 
            message: message,
            results: results
        });

    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}