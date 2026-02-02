'use client'
import axios from 'axios';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { CiShoppingCart } from "react-icons/ci";

const Navbar = () => {


  const [products, setProducts] = useState([])

  const [searchTerm, setSearchTerm] = useState('')


  useEffect(() => {
    const fetchData = async () => {
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


  return (
    <div className='w-full relative'>
      <nav className='w-full flex flex-row items-center justify-between fixed top-0 right-0 h-14 px-4 bg-linear-to-br from-sky-600 to-blue-800 text-white z-50'>
        <Link href={'/'} className='text-lg sm:text-2xl font-semibold  '>Nizam Varieties Store</Link>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='px-2 p-1 outline-none bg-white text-black' placeholder='search' />
        <div className='w-auto hidden sm:flex flex-row items-center justify-center'>
          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/offers'}>Offers</Link>
          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/products'}>Products</Link>
          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/cart'}>Cart</Link>

          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/dashboard'}>Dashboard</Link>

        </div>
      </nav>
      {products.length > 0 && (
        <div className='fixed w-full z-50 top-14 flex items-center justify-center'>
          <div className='w-auto mx-auto flex flex-col items-center bg-white gap-2'>
            {products.map((product) => (
            <Link
            onClick={()=>setSearchTerm('')}
              href={`/products/${product.slug}`}
              key={product.slug}
              className="w-full px-2 py-1 bg-gray-50 hover:bg-white rounded block"
            >
              {product.name}
            </Link>
          ))}
          </div>
        </div>
      )}


    </div>
  )
}

export default Navbar
