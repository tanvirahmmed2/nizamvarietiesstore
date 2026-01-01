import { BASE_URL } from '@/lib/database/secret'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Intro = async () => {
  const res = await fetch(`${BASE_URL}/api/product/latest`, { method: 'GET', cache: 'no-store' })
  const data = await res.json()
  if (!data.success) return console.log('no data found')
  const product = data.payload[0]
  return (
    <div className='w-full h-200 p-4 flex flex-col items-center justify-center gap-2 text-center relative text-white'>
      <Image src={product.image} alt={product.title} width={2000} height={1000} className='w-full h-200 absolute -z-20 object-cover blur-[2px]' />
      <h1 className='text-8xl font-serif text-center text-sky-500'>Grand Kitchen</h1>
      <p className='text-4xl'>Experience Authentic Meals</p>
      <div className='w-full flex flex-row items-center justify-center gap-6'>
        <Link href={'/menu'} className='p-2 px-6 bg-sky-600 hover:scale-105 transform ease-in-out duration-500 cursor-pointer text-white text-xl'>Menu</Link>
        <Link href={'/reservation'} className='p-2 px-6 bg-sky-600 hover:scale-105 transform ease-in-out duration-500 cursor-pointer text-white text-xl'>Book</Link>
      </div>

    </div>
  )
}

export default Intro
