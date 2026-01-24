'use client'
import Link from 'next/link'
import React from 'react'
import { RiHome5Line, RiShoppingCart2Line } from "react-icons/ri"
import { TbReport } from "react-icons/tb"
import { usePathname } from 'next/navigation'

const MenuItem = ({ href, icon: Icon, label }) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={`flex items-center gap-3 p-2 rounded-md transition-all ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-blue-400'}`}>
      <Icon size={20} />
      <span className="hidden group-hover:inline whitespace-nowrap">{label}</span>
    </Link>
  )
}

const ManageSidebar = () => {
  return (
    <aside className="group h-screen w-16 hover:w-56 bg-blue-300 transition-all duration-300 p-2 flex flex-col gap-1">

      <MenuItem href="/manage" icon={RiHome5Line} label="Management" />

      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-700 hidden group-hover:block mb-2">Purchase</p>
        <div className="flex flex-col gap-1">
          <MenuItem href="/pos" icon={RiShoppingCart2Line} label="POS" />
          <MenuItem href="/saleslist" icon={TbReport} label="Sales List" />
        </div>
      </div>

    </aside>
  )
}

export default ManageSidebar
