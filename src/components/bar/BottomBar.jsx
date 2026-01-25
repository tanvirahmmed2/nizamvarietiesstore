'use client'
import React from 'react'

import { AiOutlineProduct } from "react-icons/ai";
import { BiSolidOffer } from "react-icons/bi";
import { IoLogInSharp } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineAccountBox } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";
import Link from 'next/link';

const BottomBar = () => {
  return (
    <div  className='w-full flex sm:hidden flex-row items-center justify-between fixed bottom-0 right-0 h-14 px-4 bg-black text-white z-50 text-2xl'>
          <Link href={'/'}><IoHomeOutline /></Link>
          <Link href={'/offers'}><BiSolidOffer /></Link>
          <Link href={'/products'}><AiOutlineProduct /></Link>
          <Link href={'/login'}><IoLogInSharp /></Link>
          <Link href={'/cart'}><CiShoppingCart /></Link>
    </div>
  )
}

export default BottomBar
