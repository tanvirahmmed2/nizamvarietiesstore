import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const query = `
            SELECT 
                pp.payment_id,
                pp.purchase_id,
                pp.transaction_id,
                pp.payment_method,
                pp.amount_paid,
                pp.payment_date AS date,
                p.supplier_name,
                p.supplier_phone,
                p.invoice_no
            FROM purchase_payments pp
            JOIN purchases p ON pp.purchase_id = p.purchase_id
            ORDER BY pp.payment_date DESC
        `;

        const data = await pool.query(query);
        const result = data.rows;

        if (result.length === 0) {
            return NextResponse.json({
                success: false, 
                message: 'No payment history found'
            }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Successfully fetched purchase payments',
            payload: result 
        }, { status: 200 });

    } catch (error) {
        console.error("Purchase Transaction Fetch Error:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}