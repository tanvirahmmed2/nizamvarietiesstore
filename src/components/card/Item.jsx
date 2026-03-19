'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useContext } from 'react'
import Image from 'next/image'
import { Context } from '../helper/Context'

const Item = ({ product }) => {

  const { addToCart } = useContext(Context)

  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.7 }} className='w-full border flex flex-col items-center justify-between border-black/10 hover:shadow-lg shadow-cyan-100 shadow group overflow-hidden transition ease-in-out duration-500 relative'>
      <div className='w-full flex items-center gap-1 flex-col p-2  relative  '>
        <Link href={`/products/${product.slug}`} className='w-full overflow-hidden  cursor-pointer'>
          <Image src={`${product?.image}`} alt='image' width={1000} height={1000} className='w-full group-hover:scale-105 transition ease-in-out duration-500 aspect-square object-cover overflow-hidden '  />
        </Link>
        <p className='text-xs w-full text-center  uppercase'>{product?.name}</p>
        {
          product?.discount_price > 0 ? <div>
            <p className='text-red-400 line-through text-xs'>BDT {product.sale_price}</p>
            <strong>BDT {product?.sale_price - product?.discount_price}</strong>
          </div> : <strong>BDT {product.sale_price}</strong>
        }
      </div>
      <button onClick={() => addToCart(product)} className='w-full sm:absolute z-10 bottom-0 sm:p-1 transition ease-in-out duration-500 bg-sky-500 text-white transform cursor-pointer group-hover:translate-y-0 translate-y-0 sm:translate-y-full rounded-t-2xl'>Add to cart</button>
    </motion.div>

    
  )
}

export default Item
