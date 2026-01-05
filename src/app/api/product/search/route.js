
import ConnectDB from "@/lib/database/mongo";
import Product from "@/lib/models/product";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({
        success: false,
        message: "Search query is required",
      }, { status: 400 });
    }

    const regex = new RegExp(query, "i"); 

    const products = await Product.find({
      $or: [
        { title: regex },
        { description: regex }
      ]
    }).limit(20);
    if(!products || products.length===0){
        return NextResponse.json({
            success:false,
            message:'No product Found'
        },{status:400})
    }

    return NextResponse.json({
      success: true,
      message:'Successfully fethced data',
      payload: products,
    },{status:200});

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}
