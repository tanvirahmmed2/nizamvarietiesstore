import { pool } from "@/lib/database/db";
import { sendEmail } from "@/lib/database/brevo";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ success: false, message: 'Support ID is required' }, { status: 400 });
        }

        const data = await pool.query(
            `SELECT support_id, name, email, subject, message, COALESCE(status, 'pending') AS status, created_at FROM supports WHERE support_id = $1`,
            [id]
        );

        if (data.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'Support ticket not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            payload: data.rows[0]
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req, { params }) {
    try {
        const { id } = await params;
        const { replyHtml, customSubject, status } = await req.json();

        if (!id || !replyHtml) {
            return NextResponse.json({
                success: false, message: 'Support ID and reply content are required'
            }, { status: 400 });
        }

        const data = await pool.query(
            `SELECT support_id, name, email, subject, message FROM supports WHERE support_id = $1`,
            [id]
        );

        if (data.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'Support ticket not found' }, { status: 404 });
        }

        const ticket = data.rows[0];
        const emailSubject = customSubject || `Re: ${ticket.subject || 'Support Inquiry'}`;

        const fullHtml = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    
                    <div style="background-color: #0f172a; padding: 28px 32px; color: #ffffff;">
                        <h1 style="margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 0.5px;">Nizam Store Support</h1>
                        <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Response to ticket #${ticket.support_id}</p>
                    </div>

                    <div style="padding: 32px;">
                        <p style="margin: 0 0 16px 0; font-size: 15px;">Hello <strong>${ticket.name || 'Customer'}</strong>,</p>
                        
                        <div style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 24px;">
                            ${replyHtml}
                        </div>

                        <div style="margin-top: 32px; padding: 20px; background-color: #f1f5f9; border-radius: 12px; border-left: 4px solid #0284c7;">
                            <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; uppercase; color: #64748b; tracking-wider: 1px;">Your Original Inquiry</p>
                            <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #0f172a;">${ticket.subject}</p>
                            <p style="margin: 0; font-size: 12px; color: #475569; font-style: italic;">"${ticket.message}"</p>
                        </div>
                    </div>

                    <div style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #94a3b8;">Nizam Store Customer Service Team</p>
                    </div>

                </div>
            </div>
        `;

        const emailResult = await sendEmail({
            toEmail: ticket.email,
            toName: ticket.name,
            subject: emailSubject,
            htmlContent: fullHtml
        });

        if (!emailResult.success) {
            return NextResponse.json({
                success: false,
                message: 'Failed to dispatch email via Brevo mailer',
                error: emailResult.error
            }, { status: 500 });
        }

        const newStatus = status || 'replied';
        const updated = await pool.query(
            `UPDATE supports SET status=$1 WHERE support_id=$2 RETURNING *`,
            [newStatus, id]
        );

        return NextResponse.json({
            success: true,
            message: `Reply sent successfully to ${ticket.email}`,
            payload: updated.rows[0]
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
