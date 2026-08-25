import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

async function ensureSupportStatusColumn() {
    try {
        await pool.query(`ALTER TABLE supports ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending'`);
    } catch (error) {
        console.error("Migration error for supports status column:", error?.message);
    }
}

export async function POST(req) {
    try {
        await ensureSupportStatusColumn();
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json({
                success: false, message: 'Please provide all information'
            }, { status: 400 });
        }

        const newSupport = await pool.query(
            `INSERT INTO supports(name, email, subject, message, status) VALUES($1, $2, $3, $4, 'pending') RETURNING *`, 
            [name.trim(), email.trim(), subject.trim(), message.trim()]
        );

        if (newSupport.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to send message'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true, 
            message: 'Successfully sent support message',
            payload: newSupport.rows[0]
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        await ensureSupportStatusColumn();
        const data = await pool.query(
            `SELECT support_id, name, email, subject, message, COALESCE(status, 'pending') AS status, created_at FROM supports ORDER BY created_at DESC`
        );
        const result = data.rows;

        return NextResponse.json({
            success: true, 
            message: 'Successfully fetched support messages', 
            payload: result || []
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await ensureSupportStatusColumn();
        const { support_id, id, status } = await req.json();
        const targetId = support_id || id;

        if (!targetId || !status) {
            return NextResponse.json({
                success: false, message: 'Support ID and status are required'
            }, { status: 400 });
        }

        const result = await pool.query(
            `UPDATE supports SET status=$1 WHERE support_id=$2 RETURNING *`,
            [status, targetId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Support ticket not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Status updated successfully',
            payload: result.rows[0]
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id, support_id } = await req.json();
        const targetId = id || support_id;

        if (!targetId) {
            return NextResponse.json({
                success: false, message: 'ID not received'
            }, { status: 400 });
        }

        const result = await pool.query(`DELETE FROM supports WHERE support_id=$1 RETURNING *`, [targetId]);
        
        if (result.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to remove message'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true, message: 'Successfully deleted support message'
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}