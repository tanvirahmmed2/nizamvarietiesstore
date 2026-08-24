import React from 'react'
import { FaPhoneAlt, FaHeadset, FaClock, FaEnvelope } from 'react-icons/fa'

const HelpPage = () => {
  return (
    <div className='w-full flex flex-col gap-6 bg-slate-50 min-h-screen relative'>
      {/* Header Card */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>Help & Support Center</h1>
          <p className='text-sm text-slate-500 mt-1'>Get assistance and contact system administration</p>
        </div>
        <span className="text-[10px] font-bold uppercase bg-sky-50 text-sky-700 px-3 py-2.5 rounded-xs text-center border border-sky-100">
          Status: Active Support
        </span>
      </div>

      {/* Content Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Direct Contact Card */}
        <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600'>
              <FaPhoneAlt size={22} />
            </div>
            <div>
              <h2 className='text-lg font-bold text-slate-800'>Emergency Hotline</h2>
              <p className='text-xs text-slate-500'>Direct phone support for urgent issues</p>
            </div>
          </div>
          <div className='p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between'>
            <span className='text-sm text-slate-600 font-medium'>Customer Support:</span>
            <a href="tel:+8801987131369" className='text-base font-bold text-sky-600 hover:underline'>
              +880 1987-131369
            </a>
          </div>
        </div>

        {/* Response Time Card */}
        <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600'>
              <FaClock size={22} />
            </div>
            <div>
              <h2 className='text-lg font-bold text-slate-800'>Operating Hours</h2>
              <p className='text-xs text-slate-500'>Support team response schedule</p>
            </div>
          </div>
          <div className='p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between'>
            <span className='text-sm text-slate-600 font-medium'>Working Hours:</span>
            <span className='text-sm font-bold text-slate-800'>10:00 AM - 10:00 PM Daily</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpPage

