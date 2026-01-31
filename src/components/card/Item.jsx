'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useContext } from 'react'
import Image from 'next/image'
import { CiShoppingCart } from "react-icons/ci";
import { Context } from '../helper/Context'

const Item = ({ product }) => {

  const {addToCart}= useContext(Context)
  
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className='w-auto bg-white p-1 border border-black/10 flex flex-col items-center justify-between group gap-1'>
      <Image src={`${product?.image}`} alt='image' width={1000} height={1000} className='w-50 h-50'/>
      <Link href={`/products/${product?.slug}`}>{product?.name}</Link>
      <p>BDT {product?.sale_price-product?.discount_price}</p>
      <button className='w-full p-1 bg-orange-500 text-white cursor-pointer hover:bg-orange-700'>Add to cart</button>
    </motion.div>
  )
}

export default Item
