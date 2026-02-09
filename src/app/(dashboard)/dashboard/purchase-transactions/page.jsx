'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const PurchaseTransactions = () => {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // You might need to create a simple GET route for payments 
                // or filter from a larger report route
                const res = await axios.get('/api/purchase/payments') 
                if (res.data.success) setTransactions(res.data.payload)
            } catch (error) {
                console.log("Transaction fetch error")
            } finally {
                setLoading(false)
            }
        }
        fetchTransactions()
    }, [])

    if (loading) return <p className='p-5 text-center'>Loading transactions...</p>

    return (
        <div className='flex-1 p-4 bg-white rounded-xl shadow-sm'>
            <h2 className='text-xl font-bold mb-4 text-gray-800'>Payment Transactions</h2>
            <div className='overflow-x-auto'>
                <div className='min-w-full flex flex-col gap-2'>
                    {transactions.map((trx) => (
                        <div key={trx.payment_id} className='flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-green-500'>
                            <div>
                                <p className='text-sm font-bold text-gray-700'>Payment for Purchase #{trx.purchase_id}</p>
                                <p className='text-[10px] text-gray-500'>{new Date(trx.payment_date).toLocaleString()}</p>
                            </div>
                            <div className='text-right'>
                                <p className='text-sm font-black text-gray-800'>৳{parseFloat(trx.amount_paid).toFixed(2)}</p>
                                <span className='text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase'>
                                    {trx.payment_method}
                                </span>
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && <p className='text-center py-10 text-gray-400'>No transactions recorded</p>}
                </div>
            </div>
        </div>
    )
}

export default PurchaseTransactions