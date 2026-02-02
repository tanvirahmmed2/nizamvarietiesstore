import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET() {
    const client = await pool.connect();
    try {
        const salesStatsQuery = `
            SELECT 
                COALESCE(SUM(CASE WHEN created_at::date = CURRENT_DATE THEN total_amount ELSE 0 END), 0) as today,
                COALESCE(SUM(CASE WHEN created_at::date = CURRENT_DATE - 1 THEN total_amount ELSE 0 END), 0) as yesterday,
                COALESCE(SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN total_amount ELSE 0 END), 0) as last_week,
                COALESCE(SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '1 year' THEN total_amount ELSE 0 END), 0) as last_year
            FROM orders WHERE status = 'completed';
        `;

        const capitalQuery = `
            SELECT 
                COALESCE(SUM(stock * purchase_price), 0) as total_invested,
                (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'completed') as total_earned,
                COALESCE(SUM(stock * sale_price), 0) as remaining_capitals
            FROM products;
        `;

        const chartQuery = `
            SELECT to_char(created_at, 'DD Mon') as date, SUM(total_amount) as amount
            FROM orders 
            WHERE status = 'completed' AND created_at >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY date, created_at::date
            ORDER BY created_at::date ASC;
        `;

        const [sales, capital, chart] = await Promise.all([
            client.query(salesStatsQuery),
            client.query(capitalQuery),
            client.query(chartQuery)
        ]);

        return NextResponse.json({
            success: true,
            payload: {
                sales: sales.rows[0],
                finance: capital.rows[0],
                chartData: chart.rows
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}