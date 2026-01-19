'use client'
import { useCart } from '@/components/context/Context'
import LoginForm from '@/components/forms/LoginForm'
import RegisterForm from '@/components/forms/RegisterForm'
import React from 'react'

const Login = () => {
  const {siteData}= useCart()
  return (
    <div className='w-full flex min-h-screen items-center justify-center p-2'>
      <div className='w-full md:w-3/4 lg:w-1/2 flex flex-col md:flex-row items-center justify-center gap-2 border border-black/10 shadow-sm rounded-lg p-2'>
        <div className='flex-1 flex items-center justify-center flex-col text-center'>
          <h1>Welcome to</h1>
          <h1 className='text-3xl font-semibold'>{siteData?.title || 'Business'}</h1>
          <p>Please register & access our services</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

export default Login
