'use client'
import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const Context = createContext()


const ContextProvider = ({ children }) => {

  const [isCategoryBox, setIsCategoryBox] = useState(false)
  const [isBrandBox, setIsBrandBox] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  const [userData, setUserData] = useState(null)

  const [cartSalesItems, setCartSalesItems] = useState([])

  const [hydrated, setHydrated] = useState(false)
  const [cart, setCart] = useState({ items: [] })



  const fetchCart = () => {
    if (typeof window === 'undefined') return

    const storedCart = localStorage.getItem('cart')

    if (!storedCart || storedCart === 'undefined') {
      setCart({ items: [] })
      setHydrated(true)
      return
    }

    try {
      const parsed = JSON.parse(storedCart)

      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        Array.isArray(parsed.items)
      ) {
        setCart(parsed)
      } else {
        throw new Error('Invalid cart shape')
      }

      setHydrated(true)
    } catch (err) {
      console.warn('Corrupted cart detected. Resetting cart.', err)
      localStorage.removeItem('cart')
      setCart({ items: [] })
      setHydrated(true)
    }
  }


  useEffect(() => {
    if (typeof window !== 'undefined' && hydrated) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, hydrated])



  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.items.find(
        item => item.productId === product?._id
      )

      if (existing) {
        return {
          ...prev,
          items: prev.items.map(item =>
            item.productId === product?._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }

      return {
        ...prev,
        items: [
          ...prev.items,
          {
            productId: product?._id,
            title: product?.title,
            quantity: 1,
            price: product?.price - product?.discount
          }
        ]
      }
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId !== id)
    }))
  }


  const decreaseQuantity = (id) => {
    setCart((prev) => {
      const existing = prev.items.find(
        item => item.productId === id
      )

      if (!existing) return prev

      if (existing.quantity > 1) {
        return {
          ...prev,
          items: prev.items.map(item =>
            item.productId === id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        }
      }


      return {
        ...prev,
        items: prev.items.filter(item => item.productId !== id)
      }
    })
  }



  const clearCart = () => {
    setCart({ items: [] })
    localStorage.removeItem('cart')
  }











  const fetchSalesCart = async () => {
    try {
      const res = await axios.get('/api/user/cart', { withCredentials: true })
      const plainCart = res.data.payload.map(item => ({
        _id: item._id.toString(),
        productId: item.productId.toString(),
        title: item.title,
        quantity: item.quantity,
        price: item.price
      }))
      setCartSalesItems(plainCart)
    } catch (err) {
      console.log(err)
      setCartSalesItems([])
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



  const fetchCategory = async () => {
    try {
      const response = await axios.get('/api/category', { withCredentials: true })
      setCategories(response.data.payload)
    } catch (error) {
      console.log(error)
      setCategories([])

    }

  }


  const fetchBrand = async () => {
    try {
      const response = await axios.get('/api/brand', { withCredentials: true })
      setBrands(response.data.payload)
    } catch (error) {
      console.log(error)
      setBrands([])

    }

  }



  useEffect(() => {
    fetchCategory()
    fetchCart()
    fetchBrand()
  }, [])

  const contextValue = {
    isBrandBox, setIsBrandBox, isCategoryBox, setIsCategoryBox, brands, setBrands,
    categories, fetchCategory, cartSalesItems, userData, cart, setCart, fetchCart, addToCart, clearCart, removeFromCart, decreaseQuantity, fetchCart, fetchSalesCart
  }
  return <Context.Provider value={contextValue}>
    {children}
  </Context.Provider>
}


export default ContextProvider




