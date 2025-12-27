// context/CartContext.jsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

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

  useEffect(() => { fetchCart() }, [])

  return (
    <CartContext.Provider value={{ cartItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
