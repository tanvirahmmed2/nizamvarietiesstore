'use client'
import React, { use, useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { printPurchaseInvoice } from '@/lib/database/printPurchaseInvoice'

const PurchaseDetailsPage = ({ params }) => {
    const { id } = use(params)
    const [purchase, setPurchase] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPurchase = async () => {
            try {
                const res = await axios.get(`/api/purchase/${id}`, { withCredentials: true })
                setPurchase(res.data.payload)
            } catch (error) {
                console.error("Error fetching purchase:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchPurchase()
    }, [id])

    if (loading) return <div className="p-10 text-center font-sans">Loading Record...</div>
    if (!purchase) return <div className="p-10 text-center text-red-500 font-bold">Purchase Record Not Found</div>

    return (
        <div className="w-full min-h-screen p-1 sm:p-4">
            <div className="w-full max-w-150 flex flex-col items-center gap-4 mx-auto shadow-2xl p-2">
                
                

                <div className="w-full flex flex-col items-center gap-10" >
                    
                    <div className="w-full flex flex-row items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-semibold">NIZAM VARIETIES STORE</h1>
                            <p className="text-xs">Pakuritala Bazar, Tarakanda</p>
                            <p className='text-xs'>Contact: 01645-172356</p>
                        </div>
                        <div className="flex flex-col text-right gap-1">
                            <h2 className="text-2xl font-semibold">Purchase Record</h2>
                            <p className="text-xs"><strong>ID:</strong> PR-{purchase.purchase_id}</p>
                            <p className="text-xs"><strong>Invoice:</strong> {purchase.invoice_no || 'N/A'}</p>
                            <p className="text-xs"><strong>Date:</strong> {new Date(purchase.created_at || purchase.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className='w-full h-0.5 bg-black'/>

                    <div className="w-full flex flex-row items-start justify-between">
                        <div className='flex flex-col gap-1'>
                            <h3 className=" font-semibold">Supplier Details</h3>
                            <p className="font-bold text-xs">{purchase.supplier_name}</p>
                            <p className=" text-xs">Phone: {purchase.supplier_phone || 'N/A'}</p>
                            <p className=" text-xs whitespace-pre-wrap">{purchase.supplier_address || ''}</p>
                        </div>
                        {/* Payment Box */}
                        <div className='flex flex-col gap-1'>
                            <h3 className="font-semibold">Payment Info</h3>
                            <p className="text-xs">
                                Method: <span className="">{purchase.payment_method || 'Cash'}</span>
                            </p>
                            <p className="text-xs font-medium">Status: Verified Record</p>
                            <p className="text-xs">Note: {purchase.note || 'No additional instructions'}</p>
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center gap-1 text-sm">
                        <div className=" w-full grid grid-cols-7 gap-1 border-b justify-items-start p-1">
                            <div className="col-span-1">SL</div>
                            <div className="col-span-3">Product Description</div>
                            <div className="col-span-1">Price</div>
                            <div className="col-span-1">Qty</div>
                            <div className="col-span-1">Amount</div>
                        </div>

                        {purchase.items?.map((item, index) => (
                                <div key={index} className=" w-full grid grid-cols-7 gap-1 justify-items-start p-1 border-b border-black/10">
                                    <div className="col-span-1">{index + 1}</div>
                                    <div className="col-span-3">{item.name}</div>
                                    <div className="col-span-1 ">৳{parseFloat(item.purchase_price).toFixed(2)}</div>
                                    <div className="col-span-1 ">{item.quantity}</div>
                                    <div className="col-span-1 ">৳{(parseFloat(item.purchase_price) * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                    </div>

                   <div className="w-auto min-w-70 ml-auto font-sans flex flex-col text-sm gap-2">
                            <div className="flex justify-between ">
                                <span>Subtotal</span>
                                <span className="font-semibold">৳{parseFloat(purchase.subtotal_amount || 0).toFixed(2)}</span>
                            </div>
                            
                            {purchase.extra_discount > 0 && (
                                <div className="flex justify-between ">
                                    <span>Discount</span>
                                    <span className="font-semibold">-৳{parseFloat(purchase.extra_discount).toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between font-bold text-blue-600 ">
                                <span>NET AMOUNT</span>
                                <span className="tracking-tighter">৳{parseFloat(purchase.total_amount).toFixed(2)}</span>
                            </div>
                        </div>

                    {/* .footer style */}
                    <div className="mt-[50px] text-center text-[#94a3b8] text-[11px] border-t border-[#e2e8f0] pt-[20px]">
                        <p className="m-0 italic">This is a computer-generated document. No signature is required.</p>
                        <p className="m-0 mt-1 font-semibold uppercase tracking-widest text-[#cbd5e1]">© {new Date().getFullYear()} Disibin LTD</p>
                    </div>
                </div>


                <div className="w-full flex flex-row items-center justify-between gap-3">
                    <Link href="/dashboard/purchase" className="w-full p-1 text-center bg-gray-100 cursor-pointer hover:shadow">
                        ← Back to List
                    </Link>
                    <button 
                        onClick={() => printPurchaseInvoice(purchase)}
                        className="w-full p-1 text-center bg-black text-white cursor-pointer hover:shadow"
                    >
                        Print Invoice
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PurchaseDetailsPage