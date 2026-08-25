
import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { sendEmail } from "@/lib/database/brevo";
import { BASE_URL } from "@/lib/database/secret";

export async function POST(req) {
    try {
        const { name, email, password, role, is_active } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({
                success: false, message: 'Please provide all required fields'
            }, { status: 400 });
        }

        const existsStaff = await pool.query(`SELECT * FROM staffs WHERE email=$1`, [email.toLowerCase().trim()]);

        if (existsStaff.rowCount > 0) {
            return NextResponse.json({
                success: false, message: 'Staff already exists with this email'
            }, { status: 400 });
        }

        const hashPass = await bcrypt.hash(password, 10);
        const activeStatus = is_active !== undefined ? Boolean(is_active) : true;

        const newStaff = await pool.query(
            `INSERT INTO staffs(name, email, password, role, is_active) VALUES($1, $2, $3, $4, $5) RETURNING staff_id, name, email, role, is_active, created_at`,
            [name.trim(), email.toLowerCase().trim(), hashPass, role, activeStatus]
        );

        if (newStaff.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to add staff'
            }, { status: 400 });
        }

        const emailResult = await sendEmail({
            toEmail: email,
            toName: name,
            subject: "Official Staff Credentials",
            htmlContent: `
                <div style="font-family: 'Helvetica', Arial, sans-serif; padding: 40px; background-color: #ffffff; color: #1a1a1a;">
                    <div style="max-width: 600px; margin: auto; border: 1px solid #e5e7eb; padding: 30px; border-radius: 8px;">
                        <h2 style="font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
                            Account Activation
                        </h2>
                        <p style="font-size: 14px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
                        <p style="font-size: 14px; line-height: 1.6;">Your professional staff profile has been created. Use the credentials below to access the management dashboard:</p>
                        
                        <div style="background-color: #f9fafb; padding: 20px; border-radius: 4px; margin: 25px 0; border-left: 4px solid #000;">
                            <p style="margin: 0; font-size: 13px;"><strong>Login Email:</strong> ${email}</p>
                            <p style="margin: 10px 0 0 0; font-size: 13px;"><strong>Temporary Password:</strong> ${password}</p>
                            <p style="margin: 10px 0 0 0; font-size: 13px;"><strong>Assigned Role:</strong> ${role.toUpperCase()}</p>
                        </div>

                        <p style="font-size: 12px; color: #6b7280; font-style: italic;">Note: For security reasons, please update your password upon first login.</p>
                        
                        <div style="margin-top: 30px;">
                            <a href="${BASE_URL}/login" 
                               style="background-color: #000000; color: #ffffff; padding: 12px 25px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; border-radius: 2px;">
                                Access Dashboard
                            </a>
                        </div>
                    </div>
                </div>`
        });

        if (!emailResult.success) {
            console.error("Staff created, but welcome email failed:", emailResult.error);
        }

        return NextResponse.json({
            success: true, 
            message: 'Successfully added new staff and dispatched credentials',
            payload: newStaff.rows[0]
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const data = await pool.query(`SELECT staff_id, name, email, role, is_active, created_at FROM staffs ORDER BY staff_id ASC`);
        const result = data.rows;

        return NextResponse.json({
            success: true, 
            message: 'Successfully fetched staff members', 
            payload: result || []
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const id = body.id || body.staff_id;
        
        if (!id) {
            return NextResponse.json({
                success: false, message: 'ID not received'
            }, { status: 400 });
        }

        const result = await pool.query(`DELETE FROM staffs WHERE staff_id=$1 RETURNING staff_id, name, email`, [id]);
        if (result.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Staff member not found or failed to delete'
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true, message: 'Successfully deleted staff member'
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const { staff_id, name, email, role, is_active, password } = body;
        
        if (!staff_id) {
            return NextResponse.json({ success: false, message: 'Staff ID is required' }, { status: 400 });
        }

        const existing = await pool.query(`SELECT * FROM staffs WHERE staff_id=$1`, [staff_id]);
        if (existing.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'Staff not found' }, { status: 404 });
        }

        const current = existing.rows[0];

        const updatedName = name !== undefined ? name.trim() : current.name;
        const updatedEmail = email !== undefined ? email.toLowerCase().trim() : current.email;
        const updatedRole = role !== undefined ? role : current.role;
        
        let updatedActive = current.is_active;
        if (is_active !== undefined) {
            if (typeof is_active === 'boolean') {
                updatedActive = is_active;
            } else if (typeof is_active === 'string') {
                updatedActive = is_active === 'true';
            }
        }

        if (email && email.toLowerCase().trim() !== current.email.toLowerCase()) {
            const emailCheck = await pool.query(`SELECT staff_id FROM staffs WHERE email=$1 AND staff_id != $2`, [email.toLowerCase().trim(), staff_id]);
            if (emailCheck.rowCount > 0) {
                return NextResponse.json({ success: false, message: 'Another staff member already uses this email' }, { status: 400 });
            }
        }

        let query;
        let values;

        if (password && password.trim() !== '') {
            const hashPass = await bcrypt.hash(password, 10);
            query = `UPDATE staffs SET name=$1, email=$2, role=$3, is_active=$4, password=$5 WHERE staff_id=$6 RETURNING staff_id, name, email, role, is_active, created_at`;
            values = [updatedName, updatedEmail, updatedRole, updatedActive, hashPass, staff_id];
        } else {
            query = `UPDATE staffs SET name=$1, email=$2, role=$3, is_active=$4 WHERE staff_id=$5 RETURNING staff_id, name, email, role, is_active, created_at`;
            values = [updatedName, updatedEmail, updatedRole, updatedActive, staff_id];
        }

        const result = await pool.query(query, values);

        return NextResponse.json({
            success: true, 
            message: 'Staff updated successfully',
            payload: result.rows[0]
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export { PUT as PATCH };