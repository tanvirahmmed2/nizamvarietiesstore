'use client'
import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const Context = createContext()

const ContextProvider = ({ children }) => {
  const [isCategoryBox, setIsCategoryBox] = useState(false)
  const [isBrandBox, setIsBrandBox] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [userData, setUserData] = useState(null)
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
      if (typeof parsed === 'object' && parsed !== null && Array.isArray(parsed.items)) {
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
    const exists = cart.items.find(item => item.product_id === product?.product_id);

    setCart((prev) => {
      const existing = prev.items.find(
        item => item.product_id === product?.product_id
      )

      if (existing) {
        return {
          ...prev,
          items: prev.items.map(item =>
            item.product_id === product?.product_id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }

      const salePrice = parseFloat(product?.sale_price) || 0;
      const discountAmount = parseFloat(product?.discount_price) || 0;

      return {
        ...prev,
        items: [
          ...prev.items,
          {
            product_id: product?.product_id,
            name: product?.name,
            quantity: 1,
            base_price: salePrice,
            discount_per_item: discountAmount,
            price: salePrice - discountAmount
          }
        ]
      }
    })

    if (exists) {
      toast.info("Quantity increased")
    } else {
      toast.success("Added to cart")
    }
  }

  const removeFromCart = (id) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.product_id !== id)
    }))
  }

  const decreaseQuantity = (id) => {
    setCart((prev) => {
      const existing = prev.items.find(
        item => item.product_id === id
      )
      if (!existing) return prev
      if (existing.quantity > 1) {
        return {
          ...prev,
          items: prev.items.map(item =>
            item.product_id === id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        }
      }
      return {
        ...prev,
        items: prev.items.filter(item => item.product_id !== id)
      }
    })
  }

  const clearCart = () => {
    setCart({ items: [] })
    localStorage.removeItem('cart')
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
      setCategories([])
    }
  }

  const fetchBrand = async () => {
    try {
      const response = await axios.get('/api/brand', { withCredentials: true })
      setBrands(response.data.payload)
    } catch (error) {
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
    categories, fetchCategory, userData, cart, setCart, fetchCart, addToCart, clearCart, removeFromCart, decreaseQuantity
  }

  return <Context.Provider value={contextValue}>
    {children}
  </Context.Provider>
}

export default ContextProvider