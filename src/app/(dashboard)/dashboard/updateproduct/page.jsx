'use client'
import UpdateProductForm from '@/components/forms/UpdateProductForm'
import axios from 'axios'
import React, {  useEffect, useState } from 'react'

const NewProductPage = () => {
  const [product, setProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/api/product/search?q=${searchTerm}`, {
          signal: controller.signal,
          withCredentials: true
        })
        setProducts(response.data.payload || [])
      } catch (error) {
        if (axios.isCancel(error)) return;
        setProducts([])
      }
    }

    const delayDebounceFn = setTimeout(() => {
      fetchProducts()
    }, 300)

    return () => {
      clearTimeout(delayDebounceFn)
      controller.abort()
    }
  }, [searchTerm])

  return (
    <div className='w-full p-4 relative flex flex-col items-center gap-6'>
      <h1 className='text-xl font-semibold text-center'>Update Product</h1>
      <div className='w-full flex flex-col items-center justify-center text-center'>
        <label htmlFor="searchTerm">Name Or Barcode</label>
        <input 
          type="text" 
          name='searchTerm' 
          id='searchTerm' 
          onChange={(e) => setSearchTerm(e.target.value)} 
          value={searchTerm} 
          className='w-full border border-sky-400 px-4 p-1 rounded-sm outline-none ' 
        />
      </div>
      {
        products.length > 0 && products.map((item) => (
          <div key={item.slug} className='w-full grid grid-cols-4 gap-2 border px-2'>
            <p>{item.name}</p>
            <p>{item.sale_price}</p>
            <p>{item.stock}</p>
            <button className='' onClick={() => setProduct(item)}>Update</button>
          </div>
        ))
      }

      {
        product !== null ? (
          <UpdateProductForm key={product.slug} product={product} /> 
        ) : (
          <p>Select a product</p>
        )
      }
    </div>
  )
}

export default NewProductPage