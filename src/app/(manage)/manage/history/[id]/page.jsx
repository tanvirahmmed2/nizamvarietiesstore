import PrintOrder from '@/components/buttons/PrintOrder'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const SingleOrderHistory = async ({ params }) => {
    const tempId = await params
    const id = tempId.id
    const res = await fetch(`${BASE_URL}/api/order/${id}`, { method: 'GET', cache: 'no-store' })
    const data = await res.json()
    if (!data.success) return <p>No data found</p>
    const order = data.payload
    return (
        <div className="w-full p-4 bg-gray-50">
            <div className="w-full mx-auto flex flex-col lg:flex-row gap-6 items-start">

                <div className="flex-3 flex flex-col gap-6 w-full">

                    <div className="w-full border rounded-xl p-5 bg-white shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                            <div>
                                <h1 className="text-lg font-semibold">
                                    Name: {order.name}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Phone: {order.phone}
                                </p>
                                <p className="text-sm">
                                    Order ID: <strong>#{order.orderId}</strong>
                                </p>
                            </div>

                            <span className="px-4 py-1 text-sm text-white bg-green-500 rounded-full w-fit">
                                {order.paymentMethod}
                            </span>
                        </div>
                    </div>

                    <div className="w-full border rounded-xl p-5 bg-white shadow-sm">
                        <div className="flex flex-col gap-2">

                            <div className="flex text-sm font-semibold text-gray-600 border-b pb-2">
                                <p className="flex-4">Item</p>
                                <p className="flex-1 text-center">Qty</p>
                                <p className="flex-1 text-right">Price</p>
                            </div>

                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center text-sm py-2 border-b last:border-none"
                                >
                                    <p className="flex-4">{item.title}</p>
                                    <p className="flex-1 text-center">{item.quantity}</p>
                                    <p className="flex-1 text-right">{item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full border rounded-xl p-5 bg-white shadow-sm flex flex-col gap-3 h-fit">

                    <h2 className="font-semibold text-md mb-2">
                        Order Summary
                    </h2>

                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{order.subTotal}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Discount</span>
                        <span>- {order.discount}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>{order.tax}</span>
                    </div>

                    <hr />

                    <div className="flex justify-between font-semibold text-base">
                        <span>Total</span>
                        <span>{order.totalPrice}</span>
                    </div>


                    <div className="pt-3">
                        <PrintOrder order={order} />
                    </div>
                </div>

            </div>
        </div>

    )
}

export default SingleOrderHistory
