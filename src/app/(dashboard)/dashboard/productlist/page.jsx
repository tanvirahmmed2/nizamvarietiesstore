'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link';

const ProductListPage = () => {
    const [products, setProducts] = useState([])
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 })
    const [loading, setLoading] = useState(true)

    const fetchProducts = async (page = 1) => {
        setLoading(true)
        try {
            const res = await axios.get(`/api/product?page=${page}`)
            if (res.data.success) {
                setProducts(res.data.payload)
                setPagination(res.data.pagination)
            }
        } catch (error) {
            console.error("Error fetching products", error)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchProducts(1) }, [])

    const handleDelete = (id) => {

    }
    return (
        <div className="w-full mx-auto p-6 bg-white min-h-screen">
            <div className="mb-10 border-l-8 border-black pl-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black uppercase">Inventory</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Product Catalog</p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black uppercase bg-black text-white px-3 py-1">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-40 bg-gray-100 border-2 border-dashed border-gray-200 rounded-xl"></div>
                    ))}
                </div>
            ) : (
                <div className="w-full flex flex-col items-center justify-center gap-2">
                    {products.map((item) => (
                        <div key={item.product_id} className="w-full grid grid-cols-2 ">
                            <Link className='' href={`/products/${item.slug}`}>{item.name}</Link>
                            <div className='w-auto grid grid-cols-3'>

                                <p>৳ {item.sale_price}</p>
                                <p>Stock: {item.stock}</p>
                                <button onClick={() => handleDelete(item.product_id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && products.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
                    <p className="font-black uppercase text-gray-400">No items found in this section</p>
                </div>
            )}

            <div className="mt-16 flex items-center justify-center gap-3">
                <button
                    disabled={pagination.currentPage === 1}
                    onClick={() => fetchProducts(pagination.currentPage - 1)}
                    className="px-6 py-3 border-2 border-black text-xs font-black uppercase hover:bg-black hover:text-white disabled:opacity-10 transition-all flex items-center gap-2"
                >
                    &larr; Previous
                </button>

                <div className="flex gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => fetchProducts(num)}
                            className={`w-12 h-12 border-2 border-black text-sm font-black transition-all ${pagination.currentPage === num ? 'bg-black text-white' : 'hover:bg-gray-100'
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <button
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => fetchProducts(pagination.currentPage + 1)}
                    className="px-6 py-3 border-2 border-black text-xs font-black uppercase hover:bg-black hover:text-white disabled:opacity-10 transition-all flex items-center gap-2"
                >
                    Next &rarr;
                </button>
            </div>
        </div>
    )
}

export default ProductListPage