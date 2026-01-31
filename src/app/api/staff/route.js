

import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'



export async function POST(req) {
    try {
        const {name, email, password, role}= await req.json()

        if(!name || !email || !password || !role){
            return NextResponse.json({
                success:false, message:'Please provide all information'
            },{status:400})
        }

        const exixtsStaff= await pool.query(`SELECT * FROM staffs WHERE email=$1`, [email])

        if(exixtsStaff.rowCount>0){
            return NextResponse.json({
                success:false, message:'Staff already exists with this email'
            },{status:400})
        }

        const hashPass= await bcrypt.hash(password,10)

        const newStaff= await pool.query(`INSERT INTO staffs(name, email, password, role) VALUES($1, $2, $3,$4) RETURNING *`,[name, email, hashPass, role])

        if(newStaff.rowCount===0){
            return NextResponse.json({
                success:false, message:'Failed to add staff'
            },{status:400})
        }

        return NextResponse.json({
            success:false, message:'Successfully added new staff'
        },{statusL:200})

    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}



export async function GET() {
    try {
        const data= await pool.query(`SELECT * FROM staffs ORDER BY created_at`)
        const result= data.rows
        if(!result || result.length===0){
            return NextResponse.json({
                success:false, message:'No staff found'
            },{status:400})
        }

        return NextResponse.json({
            success:true, message:'Successfully fetched data', payload:result
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}


export async function DELETE(req) {
    try {
        const {id}= await req.json()
        if(!id){
            return NextResponse.json({
                success:false, message:'ID not recieved'
            },{status:400})
        }

        const result = await pool.query(`DELETE FROM staffs WHERE staff_id=$1  RETURNING *`,[id])
        if(result.rowCount===0){
            return NextResponse.json({
                success:false, message:'Failed to delete staff'
            })
        }
        return NextResponse.json({
            success:true, message:'Successfully deleted staff'
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}