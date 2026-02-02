'use client'

import Item from "@/components/card/Item"
import axios from "axios"
import { useEffect, useState } from "react"

const Offers = () => {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/product/offer', {
          params: {
            page: page
          }
        });
        if (response.data.success) {
          setProducts(response.data.payload);
          setTotalPages(response.data.pagination.totalPages);
        }
      } catch (error) {
        console.log(error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    };

    fetchOffers();
  }, [page])

  return (
    <div className="w-full p-4 min-h-screen">
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <h1 className='font-semibold text-center text-2xl mt-4'>Offer available on specific items</h1>
        
        {loading ? (
          <p>Loading offers...</p>
        ) : products.length < 1 ? (
          <p className="">No product found</p>
        ) : (
          <>
            <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {products.map(product => (
                <Item product={product} key={product.product_id} />
              ))}
            </div>

            <div className="flex items-center gap-2 mt-8 mb-10">
              <button 
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
                className="px-4 py-2 border disabled:opacity-50 hover:bg-gray-100 transition-all"
              >
                Prev
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-10 h-10 border transition-all ${page === num ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                >
                  {num}
                </button>
              ))}

              <button 
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(prev => prev + 1)}
                className="px-4 py-2 border disabled:opacity-50 hover:bg-gray-100 transition-all"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Offers