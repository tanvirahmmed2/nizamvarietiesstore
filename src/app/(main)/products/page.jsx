'use client'

import Item from "@/components/card/Item"
import { Context } from "@/components/helper/Context"
import axios from "axios"
import Link from "next/link"
import { useEffect, useState, useMemo, useContext } from "react"




const Products = () => {
  const {categories}= useContext(Context)
  const [products, setProducts] = useState([])
  const [filterData, setFilterData] = useState({
    category: '',
    availability: ''
  })

  const filterChange = (e) => {
    const { name, value } = e.target
    setFilterData(prev => ({ ...prev, [name]: value }))

  }

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

  useEffect(()=>{
    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/product/filter', {
                params: { 
                    category: filterData.category, 
                    availability: filterData.availability 
                }
            });
            setProducts(response.data.payload);
        } catch (error) {
            console.log(error)
            setProducts([])
        }
    };

    fetchProducts();
  },[filterData])

  console.log(products)

  return (
    <div className="w-full p-4 min-h-screen">
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col sm:flex-row items-start gap-4 p-2 sm:items-center justify-around shadow">
          <h1 className="w-full sm:w-auto outline-none text-center">Filter</h1>
          {
            categories && <select name="category" id="category" onChange={filterChange} value={filterData.category} className="w-full sm:w-auto outline-none px-4 cursor-pointer">
              <option value="" className="cursor-pointer ">All Product</option>
              {
                categories.map(cat => (
                  <option value={cat.title} key={cat._id} className="cursor-pointer ">{cat.title}</option>
                ))
              }

            </select>
          }
          <select name="availability" id="availability" onChange={filterChange} value={filterData.availability} className="w-full sm:w-auto outline-none px-4 cursor-pointer">
            <option value="" className="cursor-pointer ">All</option>
            <option value="isAvailable" className="cursor-pointer ">Available</option>
          </select>


        </div>
        {
          products.length < 1 ? <p>No product found</p> : <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {
              products.map(product => (
                <Link href={`/products/${product?.slug}`} key={product._id}>
                  <Item item={product} />
                </Link>
              ))
            }
          </div>
        }
      </div>
    </div>
  )
}

export default Products