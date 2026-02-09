


import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const client = await pool.connect();
    try {
        const body = await req.json();
        const {
            supplier_name,
            supplier_phone,
            invoice_no,
            subtotal_amount,
            extra_discount,
            total_amount,
            payment_method,
            transaction_id,
            note,
            items
        } = body;

        if (!supplier_name || !items || items.length === 0) {
            return NextResponse.json({
                success: false, message: 'Missing required purchase data'
            }, { status: 400 });
        }

        await client.query('BEGIN');

        const purchaseQuery = `
            INSERT INTO purchases (
                supplier_name, supplier_phone, invoice_no, subtotal_amount, 
                extra_discount, total_amount, payment_method, transaction_id, note
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING purchase_id`;

        const purchaseValues = [
            supplier_name, supplier_phone, invoice_no, subtotal_amount,
            extra_discount, total_amount, payment_method, transaction_id, note
        ];

        const purchaseResult = await client.query(purchaseQuery, purchaseValues);
        const purchaseId = purchaseResult.rows[0].purchase_id;

        const paymentQuery = `
            INSERT INTO purchase_payments (
                purchase_id, payment_method, amount_paid, transaction_id
            ) VALUES ($1, $2, $3, $4)`;

        await client.query(paymentQuery, [purchaseId, payment_method, total_amount, transaction_id]);

        for (const item of items) {
            const itemQuery = `
                INSERT INTO purchase_items (purchase_id, product_id, quantity, purchase_price) 
                VALUES ($1, $2, $3, $4)`;
            await client.query(itemQuery, [purchaseId, item.product_id, item.quantity, item.purchase_price]);

            const stockUpdateQuery = `
                UPDATE products 
                SET stock = stock + $1,
                    purchase_price = $2
                WHERE product_id = $3`;
            await client.query(stockUpdateQuery, [item.quantity, item.purchase_price, item.product_id]);
        }

        await client.query('COMMIT');

        return NextResponse.json({
            success: true,
            message: 'Purchase recorded and stock updated successfully'
        }, { status: 201 });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Purchase Error:", error);

        return NextResponse.json({
            success: false,
            message: error.message || 'Internal server error'
        }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        const countRes = await pool.query("SELECT COUNT(*) FROM purchases");
        const totalItems = parseInt(countRes.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);

        const data = await pool.query(
            `SELECT * FROM purchases ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        return NextResponse.json({
            success: true,
            message: 'Successfully fetched purchases',
            payload: data.rows,
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


export async function DELETE(req) {
    const client = await pool.connect();
    try {
        const { id } = await req.json(); 

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Purchase ID not received" },
                { status: 400 }
            );
        }

        await client.query('BEGIN'); 
        
        const itemsRes = await client.query(
            `SELECT product_id, quantity FROM purchase_items WHERE purchase_id = $1`,
            [id]
        );

        if (itemsRes.rowCount === 0) {
            const purchaseCheck = await client.query(`SELECT purchase_id FROM purchases WHERE purchase_id = $1`, [id]);
            if (purchaseCheck.rowCount === 0) {
                return NextResponse.json({ success: false, message: "Purchase not found" }, { status: 404 });
            }
        }

        
        for (const item of itemsRes.rows) {
            await client.query(
                `UPDATE products 
                 SET stock = stock - $1 
                 WHERE product_id = $2`,
                [item.quantity, item.product_id]
            );
        }

        const deletePurchase = await client.query(
            `DELETE FROM purchases WHERE purchase_id = $1 RETURNING *`,
            [id]
        );

        if (deletePurchase.rowCount === 0) {
            throw new Error("Failed to delete purchase record");
        }

        await client.query('COMMIT'); 

        return NextResponse.json(
            { success: true, message: "Purchase deleted and stock reverted successfully" },
            { status: 200 }
        );

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Delete Purchase Error:", error);
        
        if (error.code === '23514') { 
            return NextResponse.json({ 
                success: false, 
                message: "Cannot delete: Product stock would become negative" 
            }, { status: 400 });
        }

        return NextResponse.json(
            { success: false, message: error.message || "Internal server error" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}