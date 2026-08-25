'use client'
import React, { useContext } from 'react'
import { Home, Tag, Package, User, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Context } from '../helper/Context';
import { motion } from 'framer-motion';

const BottomBar = () => {
  const { cart } = useContext(Context)

  return (
    <div className='w-full fixed bottom-0 left-0 right-0 z-50 sm:hidden'>
      <div className='glass-dark mx-4 mb-4 rounded-2xl flex flex-row items-center justify-around h-16 px-4 shadow-2xl'>
        <BottomNavItem href='/' icon={<Home size={20} />} label='Home' />
        <BottomNavItem href='/offers' icon={<Tag size={20} />} label='Offers' />
        <BottomNavItem href='/products' icon={<Package size={20} />} label='Products' />
        
        <Link href='/cart' className='relative flex flex-col items-center justify-center text-white/70 hover:text-white transition-colors'>
          {cart?.items?.length > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className='absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-lg'
            >
              {cart.items.length}
            </motion.span>
          )}
          <ShoppingCart size={20} />
          <span className='text-[10px] mt-1 font-medium'>Cart</span>
        </Link>

        <BottomNavItem href='/user/profile' icon={<User size={20} />} label='Account' />
      </div>
    </div>
  )
}

const BottomNavItem = ({ href, icon, label }) => (
  <Link href={href} className='flex flex-col items-center justify-center text-white/80 hover:text-white transition-colors'>
    {icon}
    <span className='text-[10px] mt-1 font-medium'>{label}</span>
  </Link>
)

export default BottomBar
