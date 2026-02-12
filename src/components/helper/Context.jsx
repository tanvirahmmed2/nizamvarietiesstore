'use client'
import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const Context = createContext()

const ContextProvider = ({ children }) => {
  const [isCategoryBox, setIsCategoryBox] = useState(false)
  const [isBrandBox, setIsBrandBox] = useState(false)
  const [isSupplierBox, setIsSupplierBox] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [suppliers, setSuppliers] = useState([])
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

    // 1. Check if product is out of stock entirely
    if (Number(product.stock) <= 0) {
      toast.error("Item is out of stock!");
      return;
    }

    // 2. Find if item already exists in cart to check quantity limit
    const existingInCart = cart.items.find(item => item.product_id === product.product_id);

    if (existingInCart) {
      // 3. Move the toast warning OUTSIDE of the setCart callback
      if (existingInCart.quantity >= Number(product.stock)) {
        toast.warning(`Only ${product.stock} items available in stock`);
        return; // Stop here, do not call setCart
      }

      // If we reach here, quantity is okay to increase
      setCart((prev) => ({
        ...prev,
        items: prev.items.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
      toast.info("Quantity increased");
    } else {
      // 4. Item is new to cart
      const salePrice = parseFloat(product?.sale_price) || 0;
      const wholeSalePrice = parseFloat(product?.wholesale_price) || 0;
      const discountAmount = parseFloat(product?.discount_price) || 0;

      setCart((prev) => ({
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
      }));
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
    setCart({ items: [] });
    if (typeof window !== 'undefined') localStorage.removeItem('cart');
    toast.success("Cart cleared"); // Keep this outside of any logic blocks
  };

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


  const fetchSupplier = async () => {
    try {
      const response = await axios.get('/api/supplier', { withCredentials: true })
      setSuppliers(response.data.payload || [])
    } catch (error) { setSuppliers([]) }
  }



  useEffect(() => {
    fetchCategory()
    fetchCart()
    fetchBrand()
    fetchSupplier()

  }, [])

  const [purchaseItems, setPurchaseItems] = useState([]);

  const addToPurchase = (product) => {
    setPurchaseItems((prev) => {
      const existingItem = prev.find(item => item.product_id === product.product_id);

      if (existingItem) {
        return prev.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, {
        product_id: product.product_id,
        name: product.name,
        purchase_price: parseFloat(product.purchase_price) || 0,
        sale_price: parseFloat(product.sale_price) || 0,
        quantity: 1
      }];
    });
  };



  const removeFromPurchase = (productId) => {
    setPurchaseItems((prev) => prev.filter(item => item.product_id !== productId));
  };


  const clearPurchase = () => {
    setPurchaseItems([]);
  };


  return (
    <Context.Provider value={{
      isBrandBox, setIsBrandBox, isCategoryBox, setIsCategoryBox, brands, setBrands, purchaseItems, addToPurchase, removeFromPurchase,
      isSupplierBox, setIsSupplierBox, fetchSupplier, suppliers, setSuppliers, setPurchaseItems,
      categories, fetchCategory, cart, setCart, fetchCart, addToCart, clearCart, removeFromCart, decreaseQuantity, clearPurchase
    }}>
      {children}
    </Context.Provider>
  )
}

export default ContextProvider