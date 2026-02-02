'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaBox, FaLayerGroup, FaCalendarAlt } from "react-icons/fa";

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

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
            <div className="mb-10 border-l-8 border-black pl-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Inventory</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((item) => (
                        <div 
                            key={item.product_id} 
                            className="group border-2 border-black p-5 rounded-2xl hover:bg-black hover:text-white transition-all duration-300 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-gray-100 group-hover:bg-white/20 rounded-lg">
                                        <FaBox className="text-black group-hover:text-white" />
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${
                                        item.stock > 10 
                                        ? 'bg-green-100 text-green-700 group-hover:bg-green-500 group-hover:text-white' 
                                        : 'bg-red-100 text-red-700 group-hover:bg-red-500 group-hover:text-white'
                                    }`}>
                                        {item.stock} Units
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-black leading-tight mb-1 uppercase break-words">
                                    {item.name}
                                </h3>
                                <p className="text-[10px] font-bold opacity-60 uppercase flex items-center gap-1">
                                    <FaCalendarAlt size={10} /> 
                                    Added: {new Date(item.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="mt-6 flex justify-between items-center border-t border-black group-hover:border-white/30 pt-4">
                                <span className="text-xs font-bold opacity-70">Price</span>
                                <span className="text-xl font-black font-mono">
                                    ৳{item.sale_price}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
                    <p className="font-black uppercase text-gray-400">No items found in this section</p>
                </div>
            )}

            {/* Pagination Controls */}
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
                            className={`w-12 h-12 border-2 border-black text-sm font-black transition-all ${
                                pagination.currentPage === num ? 'bg-black text-white' : 'hover:bg-gray-100'
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