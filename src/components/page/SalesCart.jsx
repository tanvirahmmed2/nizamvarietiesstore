'use client'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios' // Fixed: Added missing import
import { toast } from 'react-toastify' // Fixed: Added missing import
import Orderform from '../forms/Orderform'
import { Context } from '../helper/Context'
import BarScanner from '../helper/BarcodeScanner'

const SalesCart = () => {
  // Fixed: Destructured both from a single useContext call
  const { cart, clearCart, addToCart } = useContext(Context)

  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      // Fixed: Prevent API call if searchTerm is empty
      if (!searchTerm) {
        setProducts([])
        return
      }
      try {
        const respoonse = await axios.get(`/api/product/search?q=${searchTerm}`, { withCredentials: true })
        setProducts(respoonse.data.payload)
      } catch (error) {
        console.log(error)
        setProducts([])
      }
    }
    fetchData()
  }, [searchTerm])

  const handleBarcodeScan = async (code) => {
    if (!code) return
    try {
      setSearchTerm(code)

      const response = await axios.get(`/api/product/search?q=${code}`, { withCredentials: true })
      const foundItems = response.data.payload

      if (foundItems && foundItems.length === 1) {
        if (Number(foundItems[0].stock) <= 0) {
          toast.error('Out of stock')
          setSearchTerm('')
          return
        }
        addToCart(foundItems[0])
        setSearchTerm('')
      }
    } catch (error) {
      console.error("Scanner lookup error:", error)
    }
  }

  return (
    <div className='flex-1  p-4 flex flex-col items-center gap-6'>
      <h1 className='text-xl font-semibold'>Order details</h1>
      <div className="w-full flex flex-col items-center  gap-4 relative">
        <BarScanner onScan={handleBarcodeScan} />
        <div className="w-full flex flex-row items-center justify-between gap-4 border-b-2 p-4">
          <input
            type="text"
            name='searchTerm'
            id='searchTerm'
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            placeholder='search product name or barcode'
            className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none '
          />
          
        </div>

        {
          searchTerm.length === 0 || !products || products.length < 1 ? <p>Please search product</p> : <div className="w-full flex flex-col gap-2 items-center justify-center absolute bg-white top-full border">
            {
              products?.map((product) => (
                <div key={product.product_id} className="w-full flex flex-row even:bg-gray-200 items-center justify-center p-1">
                  <p className="flex-5">{product.name}</p>
                  <p className="flex-1"> ৳ {product.sale_price - product.discount_price}</p>
                  <button className="flex-1 cursor-pointer" onClick={() => {
                    if (Number(product.stock) > 0) {
                      addToCart(product)
                      setSearchTerm('')
                    } else {
                      toast.error('Out of stock')
                    }
                  }}>Add</button>
                </div>
              ))
            }
          </div>
        }
      </div>
      <Orderform cartItems={cart?.items} />

      <button onClick={clearCart} className='font-semibold bg-orange-500 text-white px-4 p-1 rounded-full uppercase cursor-pointer'>Clear Cart</button>
    </div>
  )
}

export default SalesCart