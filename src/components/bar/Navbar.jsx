import { isLogin, isManager } from '@/lib/middleware';
import Link from 'next/link'
import React from 'react'

import { AiOutlineProduct } from "react-icons/ai";
import { BiSolidOffer } from "react-icons/bi";
import { IoLogInSharp } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineAccountBox } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";

const Navbar = async () => {
  const auth = await isLogin()
  const manage= await isManager()

  return (
    <div className='w-full relative'>
      <nav className='fixed px-4 bottom-0 sm:top-0 sm:bottom-auto left-0 right-0 mx-auto w-full bg-pink-400 flex flex-row items-center justify-between text-white h-14 z-50'>
        <Link href={'/'} className='text-2xl font-semibold italic hidden sm:block'>BabyMart</Link>

        <div className='w-full flex flex-row items-center justify-around text-2xl sm:hidden'>
          <Link href={'/'}><IoHomeOutline /></Link>
          <Link href={'/offers'}><BiSolidOffer /></Link>
          <Link href={'/products'}><AiOutlineProduct /></Link>
          {
            auth.success ? <Link href={'/profile'}><MdOutlineAccountBox /></Link> : <Link href={'/login'}><IoLogInSharp /></Link>
          }

          <Link href={'/cart'}><CiShoppingCart /></Link>
        </div>

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
      </nav>

    </div>
  )
}

export default Navbar
