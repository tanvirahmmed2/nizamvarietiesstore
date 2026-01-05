'use client'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useCart } from '../context/Context'

const About = () => {
  const { siteData } = useCart()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('api/product/latest', { withCredentials: true })
        const products = response.data.payload
        setProduct(products[0])
      } catch (error) {
        console.log(error)
        setProduct(null)
      }
    }
    fetchData()
  }, [])
  return (
    <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2 min-h-150 p-4 bg-white'>
      <div className='w-full flex-col items-center justify-center gap-4 flex '>
        <h1 className='text-5xl'>About Us</h1>
        <p className='font-semibold text-xl'>{siteData?.tagline}</p>
        <p className='text-center'>{siteData?.bio}</p>
      </div>
      {
        product &&
        <Link href={`/products/${product?.slug}`} className='w-full'>
          <Image src={product?.image} alt='Hello' width={1000} height={1000} className='h-100 w-full object-cover p-1 rounded-lg shadow-sm hover:scale-[1.02] transform ease-in-out duration-500 cursor-pointer' />
        </Link>
      }

    </div>
  )
}

export default About
