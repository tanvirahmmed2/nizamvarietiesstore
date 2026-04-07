'use client'
import Link from 'next/link'
import React from 'react'
import { SearchIcon } from 'lucide-react';

const Navbar = () => {
  

  return (
    <div className='w-full relative'>
      <nav className='w-full flex flex-row items-center justify-between fixed top-0 right-0 h-14 px-4 bg-linear-to-br from-cyan-600 to-cyan-800 text-white z-50'>
        <Link href={'/'} className='text-lg sm:text-2xl font-semibold'>Nizam Varieties Store</Link>

        
        <div className='w-auto flex flex-row items-center justify-center gap-4'>
          <Link href={'/search'} className='text-2xl'><SearchIcon/></Link>
          <div className='w-auto hidden sm:flex flex-row items-center justify-center gap-2'>

            <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/offers'}>Offers</Link>
            <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/products'}>Products</Link>
            <Link className='px-2 h-14 w-auto flex items-center justify-center hover:bg-white/20' href={'/cart'}>Cart</Link>
            <Link className='px-4 h-10 bg-red-600 rounded-2xl w-auto flex items-center justify-center hover:bg-white/20' href={'/login'}>Login</Link>
          </div>
        </div>


      </nav>
    </div>
  )
}

export default Navbar