'use client'
import Link from 'next/link'
import React from 'react'
import { RiHome5Line, RiProductHuntLine, RiShoppingCart2Line, RiRefund2Line, RiAlertLine, RiUser3Line, RiTruckLine, RiSettings3Line, RiFileChartLine, RiArchiveLine, RiPriceTag3Line, RiShoppingBag3Line, RiUserAddLine, RiUserCommunityLine, RiSuperscript } from "react-icons/ri"
import { TbReport, TbMoneybag, TbReportMoney, TbReportAnalytics, TbReportSearch } from "react-icons/tb"
import { usePathname } from 'next/navigation'
import { BiPurchaseTagAlt } from "react-icons/bi"
import { BsFillHouseGearFill } from "react-icons/bs"
import { MdChevronRight } from "react-icons/md";

const MenuItem = ({ href, icon: Icon, label }) => {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link href={href} className={`group font-serif flex opacity-80 flex-row gap-4 items-center px-2 py-1 transition-all ${isActive ? 'bg-sky-500 text-white' : 'hover:bg-sky-600 hover:text-white'}`}>
      <Icon size={14} />
      <span className="hidden group-hover:inline whitespace-nowrap">{label}</span>
    </Link>
  )
}

const DashboardSidebar = () => {
  return (
    <aside className="group select-none fixed top-0 left-0 z-50 bg-white h-screen w-16 hover:w-60 border-r-2  transition-all duration-300 p-2 flex flex-col gap-4 overflow-y-auto py-8">
      <div className="pb-5 text-xl">
        <MenuItem href="/dashboard" icon={RiHome5Line} label="Management" />
      </div>
      <div>
        <p className="font-semibold text-gray-400 text-xs hidden group-hover:flex items-center gap-2 mb-2 uppercase"><TbMoneybag />Purchase & Transaction</p>
        <MenuItem href="/dashboard" icon={RiShoppingCart2Line} label="POS" />
        <MenuItem href="/dashboard/pendingorders" icon={RiShoppingCart2Line} label="Pending Orders" />
        <div className="group/purchase flex flex-col gap-1">
          <p className="hidden group-hover:flex items-center gap-4 px-2 cursor-pointer"><BiPurchaseTagAlt />Purchase <MdChevronRight /></p>
          <div className="hidden group-hover/purchase:block px-3">
            <MenuItem href="/dashboard/saleslist" icon={RiShoppingBag3Line} label="Sales List" />
            <MenuItem href="/dashboard/transactions" icon={TbReport} label="Transaction" />
          </div>
        </div>
        <MenuItem href="/dashboard/return" icon={RiRefund2Line} label="Return" />
        <MenuItem href="/dashboard/damage" icon={RiAlertLine} label="Damage" />
      </div>
      <div>
        <p className="font-semibold text-gray-400 text-xs hidden group-hover:block mb-2 uppercase">Product Information</p>
        <MenuItem href="/dashboard/category" icon={RiArchiveLine} label="Category" />
        <div className="group/products flex flex-col gap-1">
          <p className="hidden group-hover:flex items-center gap-4 px-2 cursor-pointer"><RiProductHuntLine />Products <MdChevronRight /></p>
          <div className="hidden group-hover/products:block px-3">
            <MenuItem href="/dashboard/newproduct" icon={RiPriceTag3Line} label="New Product" />
            <MenuItem href="/dashboard/updateproduct" icon={RiPriceTag3Line} label="Update Product" />
            <MenuItem href="/dashboard/productlist" icon={RiShoppingBag3Line} label="Product List" />
          </div>
        </div>
        <MenuItem href="/dashboard/brand" icon={RiPriceTag3Line} label="Brand" />
      </div>
      <div>
        <p className="font-semibold text-gray-400 text-xs hidden group-hover:block mb-2 uppercase">Customer & Supplier</p>
        <MenuItem href="/dashboard/customer" icon={RiUser3Line} label="Customer" />
        <MenuItem href="/dashboard/supplier" icon={RiTruckLine} label="Supplier" />
      </div>
      <div>
        <p className="font-semibold text-gray-400 text-xs hidden group-hover:flex items-center gap-2 mb-2 uppercase"><TbReportMoney />Report & Ledger</p>
        <MenuItem href="/dashboard/ledger" icon={RiFileChartLine} label="Ledger" />
        <div className="group/reports flex flex-col gap-1">
          <p className="hidden group-hover:flex items-center gap-4 px-2 cursor-pointer"><TbReportSearch />Report<MdChevronRight /></p>
          <div className="hidden group-hover/reports:block px-3">
            <MenuItem href="/dashboard/sales" icon={TbReport} label="Sales" />
            <MenuItem href="/dashboard/stock" icon={RiFileChartLine} label="Stock" />
            <MenuItem href="/dashboard/analytics" icon={TbReportAnalytics} label="Analytics" />
          </div>
        </div>
      </div>
      <div>
        <p className="font-semibold text-gray-400 text-xs hidden group-hover:flex items-center gap-2 mb-2 uppercase"><BsFillHouseGearFill /> Settings</p>
        <MenuItem href="/profile" icon={RiUser3Line} label="Account" />
        <MenuItem href="/dashboard/rolemanagement" icon={RiUserAddLine} label="Role Management" />
        <MenuItem href="/dashboard/settings" icon={RiSettings3Line} label="Setting" />
        <MenuItem href="/dashboard/support" icon={RiSuperscript} label="Support" />
        <MenuItem href="/dashboard/help" icon={TbReport} label="Help" />
      </div>
    </aside>
  )
}

export default DashboardSidebar
