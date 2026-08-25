import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    const client = await pool.connect();
    try {
        const { id } = await params;
        const purchaseId = parseInt(id);

        if (!purchaseId) {
            return NextResponse.json({ success: false, message: "Valid Purchase ID is required" }, { status: 400 });
        }

        await client.query('BEGIN');

        // 1. Fetch Purchase to check current status
        const purchaseRes = await client.query("SELECT * FROM purchases WHERE purchase_id = $1", [purchaseId]);
        if (purchaseRes.rows.length === 0) {
            throw new Error("Purchase not found");
        }

        const purchase = purchaseRes.rows[0];
        if (purchase.status === 'returned') {
            throw new Error("Purchase has already been returned");
        }

        // 2. Fetch purchase items to decrease product stock
        const itemsRes = await client.query("SELECT product_id, quantity FROM purchase_items WHERE purchase_id = $1", [purchaseId]);
        
        for (const item of itemsRes.rows) {
            await client.query(
                "UPDATE products SET stock = stock - $1 WHERE product_id = $2",
                [item.quantity, item.product_id]
            );
        }

        // 3. Update Purchase status to 'returned'
        await client.query(
            "UPDATE purchases SET status = 'returned' WHERE purchase_id = $1",
            [purchaseId]
        );

        await client.query('COMMIT');

        return NextResponse.json({
            success: true,
            message: `Purchase #${purchaseId} marked as returned and stock adjusted.`
        });

    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}
