import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const client = await pool.connect();
    try {
        const { 
            customerName, phone, items, subtotal, discount, total, 
            paymentMethod, transactionId, status 
        } = await req.json();

        await client.query('BEGIN');

        let customerId;
        const custCheck = await client.query("SELECT customer_id FROM customers WHERE phone = $1", [phone]);
        
        if (custCheck.rows.length > 0) {
            customerId = custCheck.rows[0].customer_id;
        } else {
            const newC = await client.query(
                "INSERT INTO customers (name, phone) VALUES ($1, $2) RETURNING customer_id",
                [customerName || 'Walk-in', phone]
            );
            customerId = newC.rows[0].customer_id;
        }

        const orderRes = await client.query(
            `INSERT INTO orders (customer_id, phone, subtotal_amount, total_discount_amount, total_amount, status) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING order_id`,
            [customerId, phone, subtotal, discount, total, status]
        );
        const orderId = orderRes.rows[0].order_id;

        for (const item of items) {
            await client.query(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
                [orderId, item.product_id, item.quantity, item.price]
            );

            if (status === 'completed' || status === 'confirm') {
                const stockUpdate = await client.query(
                    `UPDATE products SET stock = stock - $1 
                     WHERE product_id = $2 AND stock >= $1 RETURNING name`,
                    [item.quantity, item.product_id]
                );
                if (stockUpdate.rowCount === 0) throw new Error(`Stock out: ${item.product_id}`);
            }
        }

        await client.query(
            `INSERT INTO payments (order_id, payment_method, amount, payment_status, transaction_id) 
             VALUES ($1, $2, $3, $4, $5)`,
            [orderId, paymentMethod, total, (status === 'completed' || status === 'confirm') ? 'paid' : 'pending', transactionId || null]
        );

        await client.query('COMMIT');
        return NextResponse.json({ success: true, message: `Order ${status}`, orderId }, { status: 201 });

    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}



export async function GET() {
    const client = await pool.connect();
    try {
        const query = `
            SELECT 
                o.order_id,
                c.name,
                c.phone,
                o.total_amount,
                o.total_discount_amount AS discount,
                o.subtotal_amount AS subtotal,
                o.status,
                p.payment_status,
                p.payment_method,
                o.created_at AS date,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'name', pr.name, 
                        'quantity', oi.quantity,
                        'price', oi.price
                    )
                ) AS product_list,
                SUM(oi.quantity) AS total_items_count
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN payments p ON o.order_id = p.order_id
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products pr ON oi.product_id = pr.product_id
            GROUP BY o.order_id, c.name, c.phone, p.payment_status, p.payment_method, o.created_at
            ORDER BY o.created_at DESC
        `;

        const data = await client.query(query);
        const result = data.rows;

        if (result.length <= 0) {
            return NextResponse.json({ success: false, message: 'No history found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully fetched data',
            payload: result
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}



export async function PUT(req) {
    const client = await pool.connect();
    try {
        const { orderId, action } = await req.json();

        await client.query('BEGIN');

        if (action === 'delete') {
            await client.query("DELETE FROM order_items WHERE order_id = $1", [orderId]);
            await client.query("DELETE FROM payments WHERE order_id = $1", [orderId]);
            await client.query("DELETE FROM orders WHERE order_id = $1", [orderId]);
            
            await client.query('COMMIT');
            return NextResponse.json({ success: true, message: "Order deleted successfully" });
        }

        if (action === 'confirm') {
            const items = await client.query("SELECT product_id, quantity FROM order_items WHERE order_id = $1", [orderId]);

            for (const item of items.rows) {
                const update = await client.query(
                    "UPDATE products SET stock = stock - $1 WHERE product_id = $2 AND stock >= $1 RETURNING name",
                    [item.quantity, item.product_id]
                );
                if (update.rowCount === 0) throw new Error("Insufficient stock to confirm order");
            }

            await client.query("UPDATE orders SET status = 'completed' WHERE order_id = $1", [orderId]);
            await client.query("UPDATE payments SET payment_status = 'paid' WHERE order_id = $1", [orderId]);

            await client.query('COMMIT');
            return NextResponse.json({ success: true, message: "Order confirmed and stock updated" });
        }

        throw new Error("Invalid action");

    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    } finally {
        client.release();
    }
}