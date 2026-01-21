import Order from "@/lib/models/order"
import Product from "@/lib/models/product"
import { NextResponse } from "next/server"


export async function POST(req) {
  try {
    
    const {
      name,
      phone,
      subTotal,
      discount,
      totalPrice,
      paymentMethod,
      items
    } = await req.json()

    if (!name || !phone ||  !subTotal || !items ||items.length === 0 || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Missing order details or empty cart' },
        { status: 400 }
      )
    }

    let orderId = 1000
    const lastOrder = await Order.findOne().sort({ _id: -1 })
    if (lastOrder && typeof lastOrder.orderId === 'number') {
      orderId = lastOrder.orderId + 1
    }

    let totalWholeSalePrice = 0

    for (const item of items) {
      const product = await Product.findById(item.productId).select('wholeSalePrice')
      if (product) {
        totalWholeSalePrice += product.wholeSalePrice * item.quantity
      }
    }

    const newOrder = new Order({
      name,
      phone,
      items,
      subTotal,
      discount,
      totalPrice,
      paymentMethod,
      orderId,
      totalWholeSalePrice
    })

    await newOrder.save()


    return NextResponse.json({
      success: true,
      message: 'Successfully placed order',
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    }, { status: 500 })
  }
}
