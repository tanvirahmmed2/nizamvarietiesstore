import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

// Helper to fetch full order details for the frontend/receipt
async function getOrderDetails(client, orderId) {
    const res = await client.query(`
        SELECT 
            o.order_id, o.subtotal_amount, o.total_discount_amount, o.total_amount, o.status, o.created_at,
            c.name, p.payment_method, p.payment_status,
            JSON_AGG(JSON_BUILD_OBJECT('name', pr.name, 'quantity', oi.quantity, 'price', oi.price)) AS items
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN payments p ON o.order_id = p.order_id
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN products pr ON oi.product_id = pr.product_id
        WHERE o.order_id = $1
        GROUP BY o.order_id, c.name, p.payment_method, p.payment_status
    `, [orderId]);
    return res.rows[0];
}

export async function POST(req) {
    const client = await pool.connect();
    try {
        // Added createdAt to the destructured body
        const { 
            customer_id, 
            phone, 
            items, 
            subtotal, 
            discount, 
            total, 
            paymentMethod, 
            transactionId, 
            status, 
            createdAt 
        } = await req.json();
        
        if (!customer_id) throw new Error("Customer ID is required");

        await client.query('BEGIN');

        // 1. Insert Order using the customer_id and the date from frontend
        // We use COALESCE or a ternary to handle cases where createdAt might be undefined
        const orderRes = await client.query(
            `INSERT INTO orders (customer_id, phone, subtotal_amount, total_discount_amount, total_amount, status, created_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING order_id`,
            [
                customer_id, 
                phone, 
                subtotal, 
                discount, 
                total, 
                status || 'completed', 
                createdAt || new Date() // Fallback to current date if not provided
            ]
        );
        const orderId = orderRes.rows[0].order_id;

        // 2. Process Items and Manage Stock
        for (const item of items) {
            await client.query(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)", 
                [orderId, item.product_id, item.quantity, item.price]
            );

            // Deduct stock immediately if the order is completed or confirmed
            if (status === 'completed' || status === 'confirm' || !status) {
                const stockUpdate = await client.query(
                    "UPDATE products SET stock = stock - $1 WHERE product_id = $2 AND stock >= $1", 
                    [item.quantity, item.product_id]
                );
                if (stockUpdate.rowCount === 0) throw new Error(`Insufficient stock for Product ID: ${item.product_id}`);
            }
        }

        // 3. Insert Payment
        const pStatus = (status === 'completed' || status === 'confirm' || !status) ? 'paid' : 'pending';
        await client.query(
            "INSERT INTO payments (order_id, payment_method, amount, payment_status, transaction_id) VALUES ($1, $2, $3, $4, $5)", 
            [orderId, paymentMethod, total, pStatus, transactionId || null]
        );

        await client.query('COMMIT');
        
        const fullOrder = await getOrderDetails(client, orderId);
        return NextResponse.json({ success: true, message: 'Order placed successfully', payload: fullOrder }, { status: 201 });

    } catch (error) {
        if (client) await client.query('ROLLBACK');
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

        // 1. Fetch order info to decide if we need to restore stock
        const currentOrder = await client.query(
            "SELECT status FROM orders WHERE order_id = $1", 
            [orderId]
        );

        if (currentOrder.rowCount === 0) throw new Error("Order not found");
        const orderStatus = currentOrder.rows[0].status;

        // --- ACTION: CONFIRM (Move from pending to completed) ---
        if (action === 'confirm') {
            const items = await client.query("SELECT product_id, quantity FROM order_items WHERE order_id = $1", [orderId]);
            for (const item of items.rows) {
                const update = await client.query(
                    "UPDATE products SET stock = stock - $1 WHERE product_id = $2 AND stock >= $1", 
                    [item.quantity, item.product_id]
                );
                if (update.rowCount === 0) throw new Error("Insufficient stock to confirm order");
            }
            await client.query("UPDATE orders SET status = 'completed' WHERE order_id = $1", [orderId]);
            await client.query("UPDATE payments SET payment_status = 'paid' WHERE order_id = $1", [orderId]);
            
            await client.query('COMMIT');
            const fullOrder = await getOrderDetails(client, orderId);
            return NextResponse.json({ success: true, message: 'Order confirmed', payload: fullOrder });
        }
        
        // --- ACTION: RETURN (Keep record but restore stock) ---
        if (action === 'return') {
            if (orderStatus === 'returned') throw new Error("Order already returned");
            
            // Only restore stock if it was previously deducted
            if (orderStatus === 'completed' || orderStatus === 'confirm') {
                const items = await client.query("SELECT product_id, quantity FROM order_items WHERE order_id = $1", [orderId]);
                for (const item of items.rows) {
                    await client.query("UPDATE products SET stock = stock + $1 WHERE product_id = $2", [item.quantity, item.product_id]);
                }
            }

            await client.query("UPDATE orders SET status = 'returned' WHERE order_id = $1", [orderId]);
            await client.query("UPDATE payments SET payment_status = 'refunded' WHERE order_id = $1", [orderId]);

            await client.query('COMMIT');
            return NextResponse.json({ success: true, message: "Order marked as returned and stock restored" });
        }

        if (action === 'delete') {
            if (orderStatus === 'completed' || orderStatus === 'confirm') {
                const items = await client.query("SELECT product_id, quantity FROM order_items WHERE order_id = $1", [orderId]);
                for (const item of items.rows) {
                    await client.query(
                        "UPDATE products SET stock = stock + $1 WHERE product_id = $2", 
                        [item.quantity, item.product_id]
                    );
                }
            }

            await client.query("DELETE FROM order_items WHERE order_id = $1", [orderId]);
            await client.query("DELETE FROM payments WHERE order_id = $1", [orderId]);
            await client.query("DELETE FROM orders WHERE order_id = $1", [orderId]);

            await client.query('COMMIT');
            return NextResponse.json({ success: true, message: "Order deleted successfully" });
        }

        throw new Error("Invalid action provided");

    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
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