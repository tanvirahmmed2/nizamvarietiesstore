import { BASE_URL } from '@/lib/database/secret'
import Link from 'next/link'
import React from 'react'
import Item from '../card/Item'
import Image from 'next/image'

const Offer = async () => {
  const res = await fetch(`${BASE_URL}/api/product/offer`, { method: 'GET', cache: 'no-store' })
  const data = await res.json()
  if (!data.success) return console.log('No data found')
  const products = data.payload.slice(0,12)
  return (
    <div className='w-full  flex flex-col items-center  p-4 gap-4 bg-black/10 relative text-white overflow-hidden'>
      <h1 className='text-3xl text-center '>Offer Products</h1>
      <Image src={'/offerbg.jpg'} alt='offer image' width={1000} height={1000} className='w-full  blur-[5px] absolute -z-10 scale-105' />
      {
        products && <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4'>
          {
            products.map((item) => (

              <Item product={item} key={item.product_id} />

            ))
          }
        </div>
      }
    </div>
  )
}

export default Offer
