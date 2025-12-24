import ConnectDB from "@/lib/database/mongo";
import Product from "@/lib/models/product";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    try {
        await ConnectDB()
        const category = await req.json()

        if (!category) {
            return NextResponse.json({
                success: false,
                message: 'category not found'
            }, { status: 400 })
        }

        const products = await Product.find({ category })

        if (!products) {
            return NextResponse.json({
                success: false,
                message: 'No category found with this category'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: 'category data found successfully',
            payload: products
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch data',
            error: error.message
        }, { status: 500 })
    }

}