import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({
                success: false, message: 'Category id not received',
            }, { status: 400 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam) : 50;
        const offset = (page - 1) * limit;

        const countRes = await pool.query(`SELECT COUNT(*) FROM products WHERE category_id = $1`, [id]);
        const totalItems = parseInt(countRes.rows[0].count) || 0;
        const totalPages = Math.ceil(totalItems / limit) || 1;

        const data = await pool.query(
            `SELECT * FROM products WHERE category_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
            [id, limit, offset]
        );
        const result = data.rows;

        return NextResponse.json({
            success: true,
            message: result.length > 0 ? 'Successfully fetched data' : 'No products found',
            payload: result,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}