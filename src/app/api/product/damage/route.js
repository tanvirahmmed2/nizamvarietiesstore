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
            RETURNING product_id, name, stock, purchase_price, sale_price;
        `;
        
        const results = [];
        for (const item of items) {
            const qty = parseInt(item.quantity);
            const res = await client.query(damageQuery, [qty, item.product_id]);
            if (res.rowCount === 0) {
                throw new Error(`Insufficient stock for item #${item.product_id}`);
            }
            const product = res.rows[0];

            const costPrice = parseFloat(product.purchase_price || product.sale_price || 0);
            const lossAmount = costPrice * qty;
            const reason = item.reason || 'Damaged / Expired';

            // Insert into damaged_items table
            await client.query(
                "INSERT INTO damaged_items (product_id, quantity, reason, loss_amount) VALUES ($1, $2, $3, $4)",
                [item.product_id, qty, reason, lossAmount]
            );

            results.push(product);
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

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q') || '';
        const searchTerm = `%${q}%`;

        const query = `
            SELECT 
                d.damage_id as id,
                d.product_id,
                d.quantity,
                d.reason,
                d.loss_amount as loss_val,
                d.created_at,
                p.name as product_name,
                p.image,
                p.purchase_price
            FROM damaged_items d
            JOIN products p ON d.product_id = p.product_id
            WHERE p.name ILIKE $1 OR d.reason ILIKE $1 OR d.product_id::text ILIKE $1
            ORDER BY d.created_at DESC
        `;

        const res = await pool.query(query, [searchTerm]);
        return NextResponse.json({ success: true, payload: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}