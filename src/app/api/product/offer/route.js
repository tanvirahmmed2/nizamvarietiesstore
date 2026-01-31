import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";



export async function GET() {
    try {
        const data= await pool.query(`SELECT * FROM products WHERE discount_price > 0`)
        const result= data.rows
        if(!result || result.length===0){
            return NextResponse.json({
                success:false, message:'No offer data available'
            },{status:400})
        }

        return NextResponse.json({
            success:true, message:'Successfully fetched data', payload: result
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}