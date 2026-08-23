'use client'

import Item from "@/components/card/Item"
import { Context } from "@/components/helper/Context"
import axios from "axios"
import { useEffect, useState, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ArrowUpDown, Boxes, SortAsc, ChevronLeft, ChevronRight, Loader2, LayoutGrid } from "lucide-react"

const ProductsPage = () => {
  const { categories } = useContext(Context)
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [order, setOrder] = useState('latest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/product/filter', {
          params: {
            category: category,
            stock: stock,
            price: price,
            order: order,
            page: page
          }
        });
        setProducts(response.data.payload);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.log(error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    };

    fetchProducts();
  }, [category, stock, price, order, page])

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  }

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    setPage(1);
  }

  const handleStockChange = (e) => {
    setStock(e.target.value);
    setPage(1);
  }

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
    setPage(1);
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Top Header & Filter Options Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Our Collection</h1>
              <p className="text-slate-400 text-xs font-medium">Browse through our premium items</p>
            </div>
          </div>

          {/* Separate Select Controls in One Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
            {/* Category Select */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
              <select 
                name="category" 
                id="category" 
                onChange={handleCategoryChange} 
                value={category} 
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-primary transition-all font-bold text-slate-600 appearance-none cursor-pointer text-xs sm:text-sm"
              >
                <option value="">All Categories</option>
                {categories?.map(cat => (
                  <option value={cat.category_id} key={cat.category_id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Price Select */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
              <select 
                name="price" 
                id="price" 
                onChange={handlePriceChange} 
                value={price} 
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-primary transition-all font-bold text-slate-600 appearance-none cursor-pointer text-xs sm:text-sm"
              >
                <option value="">Price: Default</option>
                <option value="low_to_high">Price: Low to High</option>
                <option value="high_to_low">Price: High to Low</option>
              </select>
            </div>

            {/* Stock Select */}
            <div className="relative">
              <Boxes className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
              <select 
                name="stock" 
                id="stock" 
                onChange={handleStockChange} 
                value={stock} 
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-primary transition-all font-bold text-slate-600 appearance-none cursor-pointer text-xs sm:text-sm"
              >
                <option value="">Stock: All</option>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            {/* Order Filter Select */}
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
              <select 
                name="order" 
                id="order" 
                onChange={handleOrderChange} 
                value={order} 
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-primary transition-all font-bold text-slate-600 appearance-none cursor-pointer text-xs sm:text-sm"
              >
                <option value="latest">Order: Latest</option>
                <option value="oldest">Order: Oldest</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Discovering Products...</p>
          </div>
        ) : products.length < 1 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200"
          >
            <p className="text-slate-400 text-lg font-bold">No products found matching your filters.</p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-8">
            <motion.div 
              layout
              className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
            >
              <AnimatePresence mode='popLayout'>
                {products.map((product) => (
                  <Item product={product} key={product.product_id} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => prev - 1)}
                  className="p-1.5 text-slate-600 hover:text-primary disabled:opacity-30 transition-all active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-0.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(num => {
                      if (page <= 3) return num <= 5;
                      if (page >= totalPages - 2) return num >= totalPages - 4;
                      return num >= page - 2 && num <= page + 2;
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
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => prev + 1)}
                  className="p-1.5 text-slate-600 hover:text-primary disabled:opacity-30 transition-all active:scale-90"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage

