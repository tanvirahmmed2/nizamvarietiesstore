'use client'
import POSItem from "@/components/card/PosItem"
import AddCutomerForm from "@/components/forms/AddCustomerForm"
import { Context } from "@/components/helper/Context"
import SalesCart from "@/components/page/SalesCart"
import axios from "axios"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useCallback, useContext, useEffect, useState } from "react"

const PosPage = () => {
  const { isCustomerBox, categories } = useContext(Context)
  const [categoryId, setCategoryId] = useState('')
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 })
  const [loading, setLoading] = useState(true)

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value)
    setCurrentPage(1)
  }

  const fetchProducts = useCallback(async (page, catId) => {
    setLoading(true)
    try {
      const url = catId
        ? `/api/product/category/${catId}?page=${page}&limit=10`
        : `/api/product?page=${page}&limit=9`
      const res = await axios.get(url)
      if (res.data.success) {
        setProducts(res.data.payload || [])
        setPagination(res.data.pagination || { currentPage: page, totalPages: 1, totalItems: 0 })
      } else {
        setProducts([])
        setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 })
      }
    } catch (error) {
      console.error("Error fetching products for POS:", error)
      setProducts([])
      setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(currentPage, categoryId)
  }, [currentPage, categoryId, fetchProducts])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 relative">
      {isCustomerBox === true && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-200'>
          <div className='bg-white p-6 rounded-2xl shadow-xl'>
            <AddCutomerForm />
          </div>
        </div>
      )}

      <div className="w-full">
        <SalesCart />
      </div>

      <div className="w-full md:w-1/2 hidden md:flex flex-col gap-6">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <select
            value={categoryId}
            onChange={handleCategoryChange}
            className='flex-1 w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold text-slate-700'
          >
            <option value="">All Categories</option>
            {categories.length > 0 && categories.map((cat) => (
              <option value={cat.category_id} key={cat.category_id}>
                {cat?.name}
              </option>
            ))}
          </select>

          {pagination.totalItems > 0 && (
            <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-3 py-2 rounded-lg whitespace-nowrap self-stretch sm:self-auto text-center">
              Total: {pagination.totalItems} Items
            </span>
          )}
        </div>

        <div className="flex-1 min-h-125 flex flex-col justify-between">
          {loading ? (
            <div className='w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-100/70 animate-pulse rounded-xl border border-slate-100"></div>
              ))}
            </div>
          ) : products.length < 1 ? (
            <div className="w-full h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
              <p className="font-bold uppercase tracking-widest text-xs">No products found</p>
            </div>
          ) : (
            <div className='w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2'>
              {products.map(product => (
                <POSItem product={product} key={product.product_id} />
              ))}
            </div>
          )}

          {!loading && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2 pt-4 border-t border-slate-100">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                title="Previous Page"
              >
                <ArrowLeft size={16} />
              </button>

              <div className="flex items-center gap-1 overflow-x-auto max-w-full">
                {currentPage > 3 && pagination.totalPages > 5 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="w-8 h-8 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      1
                    </button>
                    <span className="px-1 font-bold text-slate-300 text-xs">...</span>
                  </>
                )}

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(num => {
                    const total = pagination.totalPages;
                    if (total <= 5) return true;
                    if (currentPage <= 3) return num <= 5;
                    if (currentPage >= total - 2) return num >= total - 4;
                    return num >= currentPage - 1 && num <= currentPage + 1;
                  })
                  .map((num) => (
                    <button
                      key={num}
                      onClick={() => handlePageChange(num)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPage === num
                          ? 'bg-primary text-white shadow-sm'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                {currentPage < pagination.totalPages - 2 && pagination.totalPages > 5 && (
                  <>
                    <span className="px-1 font-bold text-slate-300 text-xs">...</span>
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      className="w-8 h-8 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                disabled={currentPage === pagination.totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                title="Next Page"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PosPage
