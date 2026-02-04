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
      if (parsed && Array.isArray(parsed.items)) {
        setCart(parsed)
      } else {
        setCart({ items: [] })
      }
    } catch (err) {
      localStorage.removeItem('cart')
      setCart({ items: [] })
    }
    setHydrated(true)
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && hydrated) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, hydrated])

  const addToCart = (product) => {
    if (!product?.product_id) return;

    // 1. Check if it exists first for the toast logic
    const exists = cart.items.find(item => item.product_id === product.product_id);

    // 2. Perform the state update (Keep this pure!)
    setCart((prev) => {
      const existing = prev.items.find(item => item.product_id === product.product_id)

      if (existing) {
        return {
          ...prev,
          items: prev.items.map(item =>
            item.product_id === product.product_id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }

      const salePrice = parseFloat(product?.sale_price) || 0;
      const wholeSalePrice = parseFloat(product?.wholesale_price) || 0;
      const discountAmount = parseFloat(product?.discount_price) || 0;

      return {
        ...prev,
        items: [
          ...prev.items,
          {
            product_id: product.product_id,
            name: product.name,
            quantity: 1,
            sale_price: salePrice,
            wholesale_price: wholeSalePrice,
            discount_price: discountAmount,
            price: salePrice - discountAmount
          }
        ]
      }
    });

    // 3. Show the toast AFTER the setCart call (Outside the updater)
    if (exists) {
      toast.info("Quantity increased");
    } else {
      toast.success("Added to cart");
    }
  };
  const removeFromCart = (id) => {
    setCart(prev => ({ ...prev, items: prev.items.filter(item => item.product_id !== id) }))
  }

  const decreaseQuantity = (id) => {
    setCart((prev) => {
      const existing = prev.items.find(item => item.product_id === id)
      if (!existing) return prev
      if (existing.quantity > 1) {
        return {
          ...prev,
          items: prev.items.map(item =>
            item.product_id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
        }
      }
      return { ...prev, items: prev.items.filter(item => item.product_id !== id) }
    })
  }

  const clearCart = () => {
    setCart({ items: [] })
    if (typeof window !== 'undefined') localStorage.removeItem('cart')
  }

  const fetchCategory = async () => {
    try {
      const response = await axios.get('/api/category', { withCredentials: true })
      setCategories(response.data.payload || [])
    } catch (error) { setCategories([]) }
  }

  const fetchBrand = async () => {
    try {
      const response = await axios.get('/api/brand', { withCredentials: true })
      setBrands(response.data.payload || [])
    } catch (error) { setBrands([]) }
  }

  useEffect(() => {
    fetchCategory()
    fetchCart()
    fetchBrand()

  }, [])

  return (
    <Context.Provider value={{
      isBrandBox, setIsBrandBox, isCategoryBox, setIsCategoryBox, brands, setBrands,
      categories, fetchCategory, cart, setCart, fetchCart, addToCart, clearCart, removeFromCart, decreaseQuantity
    }}>
      {children}
    </Context.Provider>
  )
}

export default ContextProvider