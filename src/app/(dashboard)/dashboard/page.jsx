'use client'

import { Context } from "@/components/helper/Context"
import SalesCart from "@/components/page/SalesCart"
import axios from "axios"
import { useContext, useEffect, useState, } from "react"



const ManageHome = () => {
  const { addToCart } = useContext(Context)




  const [products, setProducts] = useState([])

  const [searchTerm, setSearchTerm] = useState('')


  useEffect(() => {
    const fetchData = async () => {
      try {
        const respoonse = await axios.get(`/api/product/search?q=${searchTerm}`,{withCredentials:true})
        setProducts(respoonse.data.payload)
      } catch (error) {
        console.log(error)
        setProducts([])

      }
    }
    fetchData()
  }, [searchTerm])



  return (
    <div className="w-full p-4 flex flex-col md:flex-row">
      <div className="flex-2 flex flex-col items-center  gap-4">

        <div className="w-full flex flex-row items-center justify-between gap-4 border-b-2 p-4">
          <p>Find item</p>
          <input
            type="text"
            name='searchTerm'
            id='searchTerm'
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            className='w-auto border border-sky-400 px-4 p-1 rounded-sm outline-none '
          />
        </div>

        {
          !products || products.length < 1 ? <p>Please search product</p> : <div className="w-full flex flex-col gap-2 items-center justify-center">
            {
              products?.map((product) => (
                <div key={product.product_id} className="w-full flex flex-row items-center justify-center p-1">
                  <p className="flex-5">{product.name}</p>
                  <p className="flex-1"> ৳ {product.sale_price - product.discount_price}</p>
                  <button className="flex-1" onClick={() => addToCart(product)}>Add</button>
                </div>
              ))
            }
          </div>
        }
      </div>
      <SalesCart />
    </div>
  )
}

export default ManageHome