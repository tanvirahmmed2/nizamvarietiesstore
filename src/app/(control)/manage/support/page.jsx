import DeleteSupport from '@/components/buttons/DeleteSupport'
import { BASE_URL } from '@/lib/database/secret'
import Link from 'next/link'
import React from 'react'

const Support = async () => {
  const res = await fetch(`${BASE_URL}/api/support`, { method: 'GET', cache: 'no-store' })
  const data = await res.json()
  
  if (!data.success || data.payload.length === 0) return (
    <div className='w-full h-64 flex flex-col items-center justify-center text-slate-400'>
      <p className="text-xl font-medium">No support tickets found</p>
      <p className="text-sm">New messages will appear here.</p>
    </div>
  )

  const supports = data.payload

  return (
    <div className='max-w-6xl mx-auto w-full p-6 space-y-4'>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Support Inbox</h2>
        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
          {supports.length} Messages
        </span>
      </div>

      <div className="grid gap-4">
        {supports.map((info) => (
          <div key={info._id} className='group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-200'>
            <div className='flex flex-col md:flex-row md:items-start justify-between gap-6'>
              
              <div className='flex-1 space-y-1'>
                <div className="flex items-center gap-3">
                  <h1 className='font-bold text-slate-900 text-lg'>{info.name}</h1>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-semibold">Customer</span>
                </div>
                <p className='text-sm text-slate-500 flex items-center gap-1'>
                  <span className="opacity-70">Email:</span> {info.email}
                </p>
              </div>

              <div className='flex-2 space-y-2'>
                <h3 className='font-semibold text-amber-600 text-sm uppercase tracking-wider'>
                  {info.subject}
                </h3>
                <p className='text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100'>
                  {info.message}
                </p>
              </div>

              <div className='flex flex-row md:flex-col gap-2 min-w-30'>
                <Link 
                  href={`mailto:${info.email}`}
                  className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors"
                >
                  Reply
                </Link>
                <div className="flex-1">
                   <DeleteSupport id={info._id} />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Support