'use client'
import Image from 'next/image'
import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { Context } from '../helper/Context'
import Link from 'next/link'

const Intro = () => {
    const {categories}= useContext(Context)
    
    return (
        <div className=' w-full flex flex-col gap-8'>

            <div className='w-full h-150 overflow-hidden flex items-center justify-center relative'>
                <Image src={`/intro.jpg`} className='w-full h-150 object-cover blur-[8px] opacity-90' alt='home image' width={1000} height={1000} />
                <div className="absolute inset-0 gap-4 flex flex-col items-center justify-center text-white bg-black/10 p-4">
                    <p className='font-semibold font-serif uppercase'>Welcome to</p>
                    <h1 className='text-5xl sm:text-7xl font-extrabold text-sky-500 text-center'>Nizam Varieties Store</h1>
                    <p className='font font-serif text-center max-w-3xl'>Quality meets convenience. We bridge the gap between your daily needs and modern tech. From essential personal care and professional phone recharge services to high-quality electronics and fresh bakery items, we provide a seamless shopping experience for our local community. One basket, endless possibilities</p>
                </div>
            </div>

            <div className='w-full text-center flex flex-col items-center justify-center gap-6 py-8 px-4'>
                <h1 className='text-xl  text-center'>Find best product for your daily life among these categories</h1>
                <div className='w-full max-w-2xl flex flex-wrap items-center justify-center gap-4'>
                    {
                        categories.length > 0 && categories.map((cat)=>(
                              <Link href={`/products/category/${cat?.category_id}`} className='w-auto px-4 p-1 border rounded-full shadow' key={cat.category_id}>{cat?.name}</Link>
                          
                        ))
                    }
                </div>
            </div>

        </div>
    )
}

export default Intro
