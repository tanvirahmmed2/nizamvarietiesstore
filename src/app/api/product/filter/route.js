import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category_id = searchParams.get('category');
        const stock = searchParams.get('stock');
        const price = searchParams.get('price');
        const order = searchParams.get('order');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        let conditions = [];
        let values = [];

        if (category_id && category_id !== '') {
            values.push(category_id);
            conditions.push(`category_id = $${values.length}`);
        }

        if (stock === 'in_stock') {
            conditions.push(`stock > 0`);
        } else if (stock === 'out_of_stock') {
            conditions.push(`stock <= 0`);
        }

        let whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';

        let countQuery = `SELECT COUNT(*) FROM products${whereClause}`;
        const totalRes = await pool.query(countQuery, values);
        const totalItems = parseInt(totalRes.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit) || 1;

        let orderClauseList = [];

        if (price === 'low_to_high') {
            orderClauseList.push(`(sale_price - COALESCE(discount_price, 0)) ASC`);
        } else if (price === 'high_to_low') {
            orderClauseList.push(`(sale_price - COALESCE(discount_price, 0)) DESC`);
        }

        if (order === 'oldest') {
            orderClauseList.push(`created_at ASC`);
        } else if (order === 'name_asc') {
            orderClauseList.push(`name ASC`);
        } else if (order === 'name_desc') {
            orderClauseList.push(`name DESC`);
        } else {
            orderClauseList.push(`created_at DESC`);
        }

        let orderByClause = ` ORDER BY ${orderClauseList.join(', ')}`;

        let query = `SELECT * FROM products${whereClause}${orderByClause} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        const finalValues = [...values, limit, offset];

        const data = await pool.query(query, finalValues);
        const result = data.rows;

        return NextResponse.json({
            success: true,
            message: result.length > 0 ? 'Successfully fetched data' : 'No product found',
            payload: result,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}