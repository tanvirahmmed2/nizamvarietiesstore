import ConnectDB from "@/lib/database/mongo";
import Product from "@/lib/models/product";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await ConnectDB();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const availability = searchParams.get('availability');

        const filter = {};
        if (category) filter.category = category;
        if (availability === "isAvailable") filter.isAvailable = true;

        const products = await Product.find(filter).sort({ _id: -1 }).limit(30);;

        return NextResponse.json({ success: true,message:'Successfully fetched data', payload: products });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch data', error: error.message }, { status: 500 });
    }
}