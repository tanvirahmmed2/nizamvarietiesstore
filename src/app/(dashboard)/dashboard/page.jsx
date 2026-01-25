'use client'

import { Context } from "@/components/helper/Context"
import SalesCart from "@/components/page/SalesCart"
import axios from "axios"
import { useContext, useEffect, useState, } from "react"



const ManageHome = () => {
  const { addToCart } = useContext(Context)




  const [products, setProducts]= useState([])

  const [filterTerm, setFilterTerm] = useState({
    barcode: '',
    name: ''
  })

  const changeHandler=(e)=>{
    const {name, value}= e.target
    setFilterTerm((prev)=>({...prev, [name]:value}))
  }



  useEffect(() => {
    const fetchData = async () => {
      try {
        
      } catch (error) {
        console.log(error)
        setProducts([])
        
      }
    }
    fetchData()
  }, [filterTerm])



  return (
    <div className="w-full p-4 flex flex-col md:flex-row">
      <div className="flex-2 flex flex-col items-center  gap-4">

        <div className="w-full flex flex-row items-center justify-between gap-4 border-b-2 p-4">
          <p>Find item</p>
          <input type="number" className="w-auto border px-3 p-1 rounded-lg outline-none" id="barcode" name="barcode" value={filterTerm.barcode} onChange={changeHandler} placeholder="barcode" />
          <input type="text" className="w-auto border px-3 p-1 rounded-lg outline-none" id="name" name="name" value={filterTerm.name} onChange={changeHandler} placeholder="product name" />
        </div>

        {
          !products || products.length < 1 ? <p>Please search product</p> : <div className="w-full flex flex-col gap-2 items-center justify-center">
            {
              products?.map((item) => (
                <div key={item._id} className="w-full flex flex-row items-center justify-center p-1">
                  <p className="flex-5">{item.title}</p>
                  <p className="flex-1"> ৳ {item.price - item.discount}</p>
                  <button className="flex-1" onClick={() => addToCart(item)}>Add</button>
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