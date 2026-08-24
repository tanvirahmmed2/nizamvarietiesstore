import React from 'react'
import { FaBook } from 'react-icons/fa'

const LedgerPage = () => {
  return (
    <div className='w-full flex flex-col gap-6 bg-slate-50 min-h-screen relative'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>General Ledger</h1>
          <p className='text-sm text-slate-500 mt-1'>Financial accounts and transaction history records</p>
        </div>
        <span className="text-[10px] font-bold uppercase bg-sky-50 text-sky-700 px-3 py-2.5 rounded-xs text-center border border-sky-100">
          Financial Books
        </span>
      </div>

      {/* Content Placeholder */}
      <div className='w-full h-64 flex flex-col items-center justify-center text-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100'>
        <div className='w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400'>
          <FaBook size={28} />
        </div>
        <div>
          <p className='text-slate-700 font-bold'>General Ledger Overview</p>
          <p className='text-slate-400 text-sm mt-1'>Detailed account ledgers will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}

export default LedgerPage

