import LoginForm from '@/components/forms/LoginForm'
import Image from 'next/image'
import React from 'react'

const LoginPage = () => {
  return (
    <div className='w-full min-h-screen flex items-stretch bg-slate-900'>

      <div className='hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden'>
       
        <div className='relative z-10 flex flex-col items-center text-center'>
          <div className='w-20 h-20 mb-6 relative'>
            <Image src='/icon.png' alt='NVS Logo' fill className='object-contain drop-shadow-2xl' />
          </div>
          <h1 className='text-4xl font-black text-white tracking-tight leading-tight'>
            Nizam Varieties<br />
            <span className='bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent'>
              Store
            </span>
          </h1>
          <p className='text-slate-400 mt-4 text-base font-medium max-w-xs leading-relaxed'>
            Management dashboard for staff. Sign in with your credentials to continue.
          </p>

          
        </div>
      </div>

      <div className='w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50'>
        <div className='w-full max-w-md'>

          <div className='flex lg:hidden items-center gap-3 mb-10'>
            <div className='w-10 h-10 relative'>
              <Image src='/icon.png' alt='NVS Logo' fill className='object-contain' />
            </div>
            <span className='font-black text-slate-900 text-lg uppercase tracking-tight'>Nizam Varieties Store</span>
          </div>

          <div className='mb-8'>
            
            <h2 className='text-3xl font-black text-slate-900 tracking-tight'>Welcome back</h2>
            <p className='text-slate-500 mt-2 text-sm font-medium'>
              Sign in to access your dashboard and manage store operations.
            </p>
          </div>

          <LoginForm />

        </div>
      </div>
    </div>
  )
}

export default LoginPage
