'use client'
import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const Context = createContext()


const ContextProvider = ({ children }) => {


  


  const [cartItems, setCartItems] = useState([])
 
  const [userData, setUserData] = useState(null)
  const [categories, setCategories]= useState([])

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/user/cart', { withCredentials: true })
      const plainCart = res.data.payload.map(item => ({
        _id: item._id.toString(),
        productId: item.productId.toString(),
        title: item.title,
        quantity: item.quantity,
        price: item.price
      }))
      setCartItems(plainCart)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user/islogin', { withCredentials: true })
        setUserData(response.data.payload)
      } catch (error) {
        setUserData(null)

      }

    }
    fetchUserData()

  }, [])


  
  const fetchCategory= async () => {
    try {
      const response= await axios.get('/api/category', {withCredentials:true})
      setCategories(response.data.payload)
    } catch (error) {
      console.log(error)
      setCategories([])
      
    }
    
  }
    


  useEffect(() => {
     fetchCart()

     fetchCategory()
   }, [])

    const contextValue = {
        categories, fetchCategory, cartItems, userData
    }
    return <Context.Provider value={contextValue}>
        {children}
    </Context.Provider>
}


export default ContextProvider




