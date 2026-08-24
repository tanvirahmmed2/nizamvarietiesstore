'use client'
import { SHOPNAME } from '@/lib/database/secret'
import Link from 'next/link'
import React from 'react'

const FooterTagline = () => {
  return (
    <div className='w-full flex flex-col md:flex-row items-center justify-between gap-4'>
          <p className='text-center'>Copyright reserved by {SHOPNAME} | 2026</p>
          <p>Developed by <Link className='font-semibold' href={'https://disibin.com'}>Disibin </Link></p>
          
 
    </div>
  )
}

export default FooterTagline
