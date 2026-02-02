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

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
        }

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
            const stockUpdate = await client.query(
                `UPDATE products 
                 SET stock = stock - $1 
                 WHERE product_id = $2 AND stock >= $1 
                 RETURNING name`,
                [item.quantity, item.product_id]
            );

            if (stockUpdate.rowCount === 0) {
                throw new Error(`Insufficient stock or invalid product ID: ${item.product_id}`);
            }

            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) 
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.product_id, item.quantity, item.price]
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
            message: error.message || "Internal Server Error"
        }, { status: 500 });
    } finally {
        client.release();
    }
}


export async function GET() {
    try {
        const query = `
            SELECT 
                c.name,
                c.phone,
                o.total_amount,
                o.total_discount_amount AS discount,
                o.subtotal_amount AS subtotal,
                p.payment_status,
                o.created_at AS date,
                -- Creates an array of objects: [{name: "Apple", qty: 2}, ...]
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'name', pr.name, 
                        'quantity', oi.quantity
                    )
                ) AS product_list,
                SUM(oi.quantity) AS total_items_count
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN payments p ON o.order_id = p.order_id
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products pr ON oi.product_id = pr.product_id
            GROUP BY o.order_id, c.name, c.phone, p.payment_status, o.created_at
            ORDER BY o.created_at DESC
        `;

        const data = await pool.query(query);
        const result = data.rows;

        if (result.length <= 0) {
            return NextResponse.json({
                success: false,
                message: 'No history found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully fetched data',
            payload: result
        }, { status: 200 });

    } catch (error) {
        console.error("Sales History Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}