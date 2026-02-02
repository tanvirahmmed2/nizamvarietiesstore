import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const client = await pool.connect();
    try {
        const { 
            customerName, 
            phone, 
            items, 
            subtotal, 
            discount, 
            total, 
            paymentMethod, 
            transactionId
        } = await req.json();

        await client.query('BEGIN');

        let customerId = null;
        const customerCheck = await client.query(
            "SELECT customer_id FROM customers WHERE phone = $1", 
            [phone]
        );

        if (customerCheck.rows.length > 0) {
            customerId = customerCheck.rows[0].customer_id;
        } else {
            const newCustomer = await client.query(
                "INSERT INTO customers (name, phone) VALUES ($1, $2) RETURNING customer_id",
                [customerName || 'Walk-in Customer', phone]
            );
            customerId = newCustomer.rows[0].customer_id;
        }

        const orderRes = await client.query(
            `INSERT INTO orders (customer_id, phone, subtotal_amount, total_discount_amount, total_amount, status) 
             VALUES ($1, $2, $3, $4, $5, 'completed') RETURNING order_id`,
            [customerId, phone, subtotal, discount, total]
        );
        const orderId = orderRes.rows[0].order_id;

        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) 
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.product_id, item.quantity, item.price]
            );

            await client.query(
                `UPDATE products SET stock = stock - $1 WHERE product_id = $2`,
                [item.quantity, item.product_id]
            );
        }

        await client.query(
            `INSERT INTO payments (order_id, payment_method, amount, payment_status, transaction_id) 
             VALUES ($1, $2, $3, 'paid', $4)`,
            [orderId, paymentMethod, total, transactionId || null]
        );

        await client.query('COMMIT');

        return NextResponse.json({ 
            success: true, 
            message: "Order placed successfully", 
            orderId 
        }, { status: 201 });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Checkout Error:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    } finally {
        client.release();
    }
}