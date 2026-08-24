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
                { success: false, message: "Email address is required" },
                { status: 400 }
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 15 * 60000); // 15 Mins

        const res = await pool.query(
            `UPDATE users 
             SET reset_token = $1, reset_token_expires_at = $2 
             WHERE LOWER(email) = LOWER($3) 
             RETURNING name, email`,
            [otp, expiry, email]
        );

        if (res.rowCount === 0) {
            return NextResponse.json(
                { success: false, message: "No user account found with this email address" },
                { status: 404 }
            );
        }

        const userName = res.rows[0].name || "Customer";

        const emailResult = await sendEmail({
            toEmail: email,
            toName: userName,
            subject: `Password Reset Code - ${SHOPNAME}`,
            htmlContent: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 800;">${SHOPNAME}</h2>
                    <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Account Password Reset Request</p>
                </div>
                <div style="padding: 20px; background-color: #f8fafc; border-radius: 12px; margin-bottom: 24px;">
                    <p style="color: #334155; font-size: 14px; margin-top: 0;">Hello <strong>${userName}</strong>,</p>
                    <p style="color: #475569; font-size: 14px;">You recently requested to reset your account password. Use the verification code below to complete your reset request:</p>
                    <div style="text-align: center; margin: 24px 0;">
                        <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #0284c7; background-color: #e0f2fe; padding: 12px 24px; border-radius: 8px; display: inline-block;">${otp}</span>
                    </div>
                    <p style="color: #64748b; font-size: 12px; margin-bottom: 0; text-align: center;">This code will expire in <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
                </div>
                <div style="border-top: 1px solid #f1f5f9; pt: 16px; text-align: center; color: #94a3b8; font-size: 11px;">
                    &copy; ${new Date().getFullYear()} ${SHOPNAME}. All rights reserved.
                </div>
            </div>
            `
        });

        if (!emailResult.success) {
            console.warn("Brevo email send failed:", emailResult.error);
        }

        return NextResponse.json({
            success: true,
            message: "Verification code sent to your email address"
        });
    } catch (error) {
        console.error("User Forget Password Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to process recovery request" },
            { status: 500 }
        );
    }
}
