import Item from '@/components/card/Item'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const Offers = async () => {
  const res = await fetch(`${BASE_URL}/api/product/offer`, {
    method: 'GET',
    cache: 'no-store'
  })
  const data = await res.json()
  if (!data.success) return <p>No product found</p>
  const products = data.payload
  return (
    <div className='w-full flex flex-col items-center min-h-screen py-6 gap-4'>


      {
        products.length === 0 ? <p>No product found</p> : <div className='w-full flex flex-col items-center justify-center gap-4'>
          <h1 className='font-semibold text-center'>Offer available on specific items</h1>
          <div>
            {
              products && products.map(product => (
                <Item product={product} key={product.product_id} />
              ))
            }
          </div>
        </div>
      }
    </div>
  )
}

export default Offers
