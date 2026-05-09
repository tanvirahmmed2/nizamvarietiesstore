'use client'

import Item from "@/components/card/Item"
import axios from "axios"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Tag, Home, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"

const Offers = () => {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const fetchOffers = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/product/offer', {
          params: { page }
        })
        if (response.data.success) {
          setProducts(response.data.payload)
          setTotalPages(response.data.pagination.totalPages)
        }
      } catch (error) {
        console.log(error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchOffers()
  }, [page])

  return (
    <div className="w-full min-h-screen bg-slate-50/50">

      {/* ── Location / Hero Bar ── */}
      <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 text-center">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home size={13} />
              Home
            </Link>
            <ChevronRight size={13} className="text-slate-600" />
            <span className="text-white font-semibold">Offers</span>
          </nav>

          {/* Badge */}
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-[11px] font-bold tracking-widest uppercase border border-primary/20">
            <Tag size={11} />
            Limited Time Deals
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-none tracking-tighter">
            Exclusive <span className="text-primary">Offers</span>
          </h1>

          {/* Accent line */}
          <div className="w-16 h-1 bg-primary rounded-full" />

          {/* Subtitle */}
          <p className="text-slate-400 text-sm font-medium max-w-md">
            Handpicked deals with the best discounts — grab them before they&apos;re gone!
          </p>

        </div>
      </div>

      {/* ── Products Grid ── */}
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col items-center gap-8">

        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-slate-400 text-sm font-medium">Loading offers...</p>
          </div>
        ) : products.length < 1 ? (
          <div className="w-full py-16 text-center rounded-2xl border border-slate-200 bg-white">
            <p className="text-slate-400 text-base font-medium">No offers available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map(product => (
                <Item product={product} key={product.product_id} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
              {/* Prev */}
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
                className="p-1.5 text-slate-600 hover:text-primary disabled:opacity-30 transition-all active:scale-90"
                aria-label="Previous Page"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {page > 2 && (
                  <>
                    <button onClick={() => setPage(1)} className="w-9 h-9 rounded-lg font-bold text-xs text-slate-400 hover:bg-sky-50 hover:text-primary transition-all">1</button>
                    {page > 3 && <span className="px-1 text-slate-300 text-xs">…</span>}
                  </>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(num => {
                    if (page <= 4) return num <= 5
                    if (page >= totalPages - 3) return num >= totalPages - 4
                    return num >= page - 1 && num <= page + 1
                  })
                  .map(num => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-9 h-9 rounded-lg font-bold text-xs transition-all ${
                        page === num
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-slate-400 hover:bg-sky-50 hover:text-primary'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                {page < totalPages - 1 && (
                  <>
                    {page < totalPages - 2 && <span className="px-1 text-slate-300 text-xs">…</span>}
                    <button onClick={() => setPage(totalPages)} className="w-9 h-9 rounded-lg font-bold text-xs text-slate-400 hover:bg-sky-50 hover:text-primary transition-all">
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              {/* Next */}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(prev => prev + 1)}
                className="p-1.5 text-slate-600 hover:text-primary disabled:opacity-30 transition-all active:scale-90"
                aria-label="Next Page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default Offers
