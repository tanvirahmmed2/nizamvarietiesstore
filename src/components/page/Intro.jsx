'use client'
import Image from 'next/image'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'

const Intro = () => {
    const {categories}= useContext(Context)
    console.log(categories)
    return (
        <div className=' w-full flex flex-col gap-8'>

            <div className='w-full flex items-center justify-center rounded-lg relative'>
                <Image src={`https://images.pexels.com/photos/29234756/pexels-photo-29234756.jpeg`} className='w-full max-h-100 object-cover' alt='home image' width={1000} height={1000} />
                <div className="absolute inset-0 sm:gap-4 flex flex-col items-center justify-center text-white bg-black/10">
                    <p className='font-semibold font-serif '>Welcome to</p>
                    <h1 className='text-5xl sm:text-7xl font-extrabold'>Baby Mart</h1>
                    <p className='font-semibold font-serif '>Collect surprises for you happiness</p>
                </div>
            </div>

            <div className='w-full text-center flex flex-col items-center justify-center gap-6'>
                <h1 className='text-xl  text-center'>Find best product for your happiness among these categories</h1>
                <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 justify-items-center gap-4'>
                    {
                        categories.length > 0 && categories.map((cat)=>(
                            <Link key={cat.title} href={`/products/category/${cat?.title}`} className='w-full relative'>
                                <Image src={`${cat?.image}`} width={1000} height={1000} alt='image' className='w-full h-70 object-cover rounded-sm'/>
                                <p className='px-5 border-b'>{cat?.title}</p>
                            </Link>
                        ))
                    }
                </div>
            </div>

            <div className='w-full flex items-center justify-center rounded-lg relative'>
                <Image src={`https://images.pexels.com/photos/421879/pexels-photo-421879.jpeg`} className='w-full max-h-100 object-cover' alt='home image' width={1000} height={1000} />
                <div className="absolute inset-0 sm:gap-4 flex flex-col items-center justify-center text-white bg-black/10 backdrop-blur-xs">
                    <p className='font-semibold font-serif '>Find your best choices</p>
                    <p className='font-semibold font-serif '>We are always ready to fulfil your dreams</p>
                    <p className='font-semibold font-serif '>Order and get products at the door</p>
                </div>
            </div>



        </div>
    )
}

export default Intro
