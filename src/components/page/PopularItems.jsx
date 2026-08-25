'use client'

import Item from "@/components/card/Item"
import axios from "axios"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

const PopularItems = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/product/popular');
        if (response.data.success) {
          setProducts(response.data.payload || []);
        }
      } catch (error) {
        console.error(error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    };

    fetchPopular();
  }, [])

  return (
    <section className="w-full py-12 px-4 md:px-8 bg-slate-50/50">
      <div className="w-full flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className='text-3xl sm:text-4xl font-black text-slate-900 tracking-tight'>
            Popular <span className="text-primary">Items</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full"></div>
          <p className="text-slate-400 text-sm font-medium">Customer favorites & top trending products</p>
        </div>

        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-slate-400 text-sm font-medium">Loading top items...</p>
          </div>
        ) : products.length < 1 ? (
          <div className="w-full py-12 text-center glass rounded-2xl">
            <p className="text-slate-400 text-base font-medium">No popular products found at the moment.</p>
          </div>
        ) : (
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
        )}
      </div>
    </section>
  )
}

export default PopularItems
