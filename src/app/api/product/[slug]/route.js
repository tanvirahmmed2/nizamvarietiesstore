import ConnectDB from "@/lib/database/mongo";
import Product from "@/lib/models/product";
import { NextResponse } from "next/server";


export async function GET(req,{ params }) {
    try {
        await ConnectDB()
        const slug = await params.slug

        if (!slug) {
            return NextResponse.json({
                success: false,
                message: 'Slug not found'
            }, { status: 400 })
        }

        const product = await Product.findOne({ slug })

        if (!product) {
            return NextResponse.json({
                success: false,
                message: 'No product found with this slug'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: 'Product data found successfully',
            payload: product
        }, {status:200})

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch data',
            error: error.message
        }, { status: 500 })
    }

}