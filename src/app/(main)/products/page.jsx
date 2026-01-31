'use client'

import Item from "@/components/card/Item"
import { Context } from "@/components/helper/Context"
import axios from "axios"
import { useEffect, useState, useContext } from "react"




const Products = () => {
  const { categories } = useContext(Context)
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('')



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/product', { withCredentials: true })
        setProducts(response.data.payload)
      } catch (error) {
        console.error("Fetch error:", error)
        setProducts([])
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product/filter', {
          params: {
            category: category,
          }
        });
        setProducts(response.data.payload);
      } catch (error) {
        console.log(error)
        setProducts([])
      }
    };

    fetchProducts();
  }, [category])



  return (
    <div className="w-full p-4 min-h-screen">
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col sm:flex-row items-start gap-4 p-2 sm:items-center justify-around shadow">
          <h1 className="w-full sm:w-auto outline-none text-center">Filter</h1>
          {
            categories && <select name="category" id="category" onChange={(e)=>setCategory(e.target.value)} value={category} className="w-full sm:w-auto outline-none px-4 cursor-pointer">
              <option value="" className="cursor-pointer ">All Product</option>
              {
                categories.map(cat => (
                  <option value={cat.category_id} key={cat.category_id} className="cursor-pointer ">{cat.name}</option>
                ))
              }

            </select>
          }


        </div>
        {
          products.length < 1 ? <p className="">No product found</p> : <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {
              products.map(product => (
                <Item product={product} key={product.product_id} />
              ))
            }
          </div>
        }
      </div>
    </div>
  )
}

export default Products