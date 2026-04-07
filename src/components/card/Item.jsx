'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useContext } from 'react'
import Image from 'next/image'
import { Context } from '../helper/Context'
import { CiShoppingCart } from 'react-icons/ci'

const Item = ({ product }) => {

  const { addToCart } = useContext(Context)

  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.7 }} className='w-full flex flex-col items-center justify-between gap-2 shadow  p-2 rounded-lg border border-blue-100/10 group'>

      <Link href={`/products/${product.slug}`} className='w-full overflow-hidden  cursor-pointer aspect-square'>
        <Image src={`${product?.image}`} alt='image' width={1000} height={1000} className='w-full group-hover:scale-105 transition ease-in-out duration-500 aspect-square object-cover overflow-hidden ' />
      </Link>
      <Link href={`/products/${product.slug}`} className='text-xs w-full md:text-sm font-mono'>{product?.name}</Link>

      <div className='w-full flex flex-row items-end justify-between'>
        {
          product?.discount_price > 0 ? <div>
            <p className='text-red-400 line-through text-xs'>BDT {product.sale_price}</p>
            <p>BDT {product?.sale_price - product?.discount_price}</p>
          </div> : <p>BDT {product.sale_price}</p>
        }
        <button onClick={() => addToCart(product)} className='text-2xl text-blue-500 cursor-pointer'><CiShoppingCart/></button>
      </div>


    </motion.div>


  )
}

export default Item
