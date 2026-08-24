import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/database/brevo";
import { SHOPNAME } from "@/lib/database/secret";

export async function POST(req) {
    try {
        const body = await req.json();
        const email = body?.email ? body.email.trim().toLowerCase() : "";

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Staff email address is required" },
                { status: 400 }
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 15 * 60000); // 15 Mins

        const res = await pool.query(
            `UPDATE staffs 
             SET password_otp = $1, otp_expires_at = $2 
             WHERE LOWER(email) = LOWER($3) 
             RETURNING name, email`,
            [otp, expiry, email]
        );

        if (res.rowCount === 0) {
            return NextResponse.json(
                { success: false, message: "No registered staff account found with this email address" },
                { status: 404 }
            );
        }

        const staffName = res.rows[0].name || "Staff Member";

        const emailResult = await sendEmail({
            toEmail: email,
            toName: staffName,
            subject: `Staff Access OTP Code - ${SHOPNAME}`,
            htmlContent: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #1e293b; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
                <div style="text-align: center; margin-bottom: 24px; border-b: 1px solid #1e293b; padding-bottom: 16px;">
                    <h2 style="color: #38bdf8; margin: 0; font-size: 22px; font-weight: 800;">${SHOPNAME} Staff Portal</h2>
                    <p style="color: #94a3b8; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">System Access Restoration</p>
                </div>
                <div style="padding: 20px; background-color: #1e293b; border-radius: 10px; margin-bottom: 24px;">
                    <p style="color: #e2e8f0; font-size: 14px; margin-top: 0;">Hello <strong>${staffName}</strong>,</p>
                    <p style="color: #cbd5e1; font-size: 14px;">A password reset OTP was requested for your staff management account. Use the code below to set a new password:</p>
                    <div style="text-align: center; margin: 24px 0;">
                        <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #38bdf8; background-color: #0f172a; border: 1px solid #334155; padding: 12px 24px; border-radius: 8px; display: inline-block;">${otp}</span>
                    </div>
                    <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0; text-align: center;">This code will expire in <strong>15 minutes</strong>.</p>
                </div>
                <div style="text-align: center; color: #64748b; font-size: 11px;">
                    Confidential &bull; ${SHOPNAME} Management System
                </div>
            </div>
            `
        });

        if (!emailResult.success) {
            console.warn("Brevo email send failed for staff:", emailResult.error);
        }

        return NextResponse.json({
            success: true,
            message: "OTP code dispatched to your staff email address"
        });
    } catch (error) {
        console.error("Staff Forget Password Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to process staff recovery request" },
            { status: 500 }
        );
    }
}