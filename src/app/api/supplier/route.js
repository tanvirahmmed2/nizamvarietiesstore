import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const query = `
            SELECT 
                s.supplier_id,
                s.name,
                s.phone,
                s.company_name,
                COUNT(p.purchase_id) AS total_purchases,
                COALESCE(SUM(p.total_amount), 0) AS total_amount_spent,
                MAX(p.created_at) AS last_purchase_date
            FROM suppliers s
            LEFT JOIN purchases p ON s.phone = p.supplier_phone
            GROUP BY s.supplier_id, s.name, s.phone, s.company_name
            ORDER BY total_amount_spent DESC
        `;

        const data = await pool.query(query);

        if (data.rows.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No suppliers found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Suppliers fetched with stats",
            payload: data.rows
        }, { status: 200 });

    } catch (error) {
        console.error("Supplier Fetch Error:", error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}