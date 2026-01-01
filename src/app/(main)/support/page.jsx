'use client'
import React from 'react'

const Support = () => {
  return (
    <div className='w-full min-h-screen p-4 flex flex-col md:flex-row items-center justify-center gap-6'>
      <div className='w-full h-full flex flex-col gap-4'>
        <h1 className='text-2xl font-semibold text-center'>Join Us at Our Table</h1>
        <p className='text-wrap w-full'>Whether you are planning a romantic evening, a family celebration, or a private event, we are here to make it unforgettable.</p>

      </div>
      <div className='w-full flex flex-col items-center justify-center gap-4'>
        <h1 className='text-2xl font-semibold border-b-2 px-5 text-center'>Get In Touch</h1>
        <form className='flex w-full flex-col gap-4'>
          <div className='w-full flex flex-col gap-2'>
            <label htmlFor="name">Name</label>
            <input type="text" id=' name' name='name' required className='border border-black/30 outline-none px-2 p-1' />
          </div>
          <div className='w-full flex flex-col gap-2'>
            <label htmlFor="email">Email</label>
            <input type="email" id='email' name='email' required className='border border-black/30 outline-none px-2 p-1' />
          </div>
          <div className='w-full flex flex-col gap-2'>
            <label htmlFor="subject">Subject</label>
            <input type="text" id='subject' name='subject' required className='border border-black/30 outline-none px-2 p-1' />
          </div>
          <div className='w-full flex flex-col gap-2'>
            <label htmlFor="message">Message</label>
            <textarea name="message" id="message" required className='border border-black/30 outline-none px-2 p-1' />
          </div>
          <button type='submit' className='bg-sky-600 w-auto cursor-pointer p-1 text-white hover:scale-[1.02] transform ease-in-out duration-500'>Submit</button>
        </form>
      </div>

    </div>
  )
}

export default Support
