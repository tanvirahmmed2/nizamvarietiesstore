import { isLogin, isManager } from '@/lib/middleware';
import Link from 'next/link'
import React from 'react'

import { CiShoppingCart } from "react-icons/ci";

const Navbar = async () => {
  const auth = await isLogin()
  const manage= await isManager()

  return (
    <div className='w-full relative'>
      <nav className='w-full flex flex-row items-center justify-between fixed top-0 right-0 h-14 px-4 bg-black text-white z-50'>
        <Link href={'/'} className='text-lg sm:text-2xl font-semibold  '>Nizam Varieties Store</Link>
        <div className='w-auto hidden sm:flex flex-row items-center justify-center'>
          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/offers'}>Offers</Link>
          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/products'}>Products</Link>
          <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/cart'}>Cart</Link>
          {
            manage.success && <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/dashboard'}>Dashboard</Link>
          }
          {
            auth.success ? <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'profile'}>Profile</Link> : <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/login'}>Login</Link>
          }
        </div>
        <Link href={'/cart'} className='flex sm:hidden w-auto h-14 items-center justify-center text-2xl'><CiShoppingCart /></Link>
      </nav>

    </div>
  )
}

export default Navbar
