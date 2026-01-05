'use client'
import React from 'react'
import { useCart } from '../context/Context'

const About = () => {
  const { siteData } = useCart()
  return (
    <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2 min-h-150 p-4 bg-white'>
      <div className='w-full flex-col items-center justify-center gap-4 flex '>
        <h1 className='text-5xl'>About Us</h1>
        <p className='font-semibold text-xl text-center'>{siteData?.tagline}</p>
        <p className='text-center'>{siteData?.bio}</p>
      </div>

    </div>
  )
}

export default About
