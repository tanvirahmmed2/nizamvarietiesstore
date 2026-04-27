'use client'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { 
  RiHome5Line, RiProductHuntLine, RiShoppingCart2Line, 
  RiRefund2Line, RiAlertLine, RiUser3Line, RiTruckLine, 
  RiSettings3Line, RiFileChartLine, RiArchiveLine, 
  RiPriceTag3Line, RiShoppingBag3Line, RiUserAddLine, 
  RiUserCommunityLine, RiSuperscript, RiMenuLine, RiCloseLine 
} from "react-icons/ri"
import { TbReport, TbMoneybag, TbReportMoney, TbReportAnalytics, TbReportSearch } from "react-icons/tb"
import { usePathname } from 'next/navigation'
import { BiPurchaseTagAlt } from "react-icons/bi"
import { BsFillHouseGearFill } from "react-icons/bs"
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { FaChevronDown } from 'react-icons/fa6'
import { Context } from '../helper/Context'
import Image from 'next/image'

const MenuItem = ({ href, icon: Icon, label, isOpen }) => {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link 
      href={href} 
      className={`group flex flex-row gap-4 items-center px-3 py-2.5 transition-all rounded-xl mx-2 ${
        isActive 
          ? 'bg-linear-to-r from-sky-500 to-indigo-500 text-white shadow-md shadow-sky-500/20 font-medium' 
          : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium'
      }`}
    >
      <Icon size={20} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`} />
      {isOpen && <span className="whitespace-nowrap text-sm tracking-wide">{label}</span>}
    </Link>
  )
}

const DashboardSidebar = () => {
  const { isDashboardSidebar: isOpen } = useContext(Context)
  
  // Local states for submenus
  const [saleMenuOpen, setSaleMenuOpen] = useState(false)
  const [purchaseMenuOpen, setPurchaseMenuOpen] = useState(false)
  const [productsMenuOpen, setProductsMenuOpen] = useState(false)
  const [reportMenuOpen, setReportMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await axios.get('/api/staff/login', { withCredentials: true })
      toast.success(response.data.message)
      window.location.replace('/access')
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Failed to logout')
    }
  }

  const downloadDB = async () => {
    try {
      const response = await fetch('/api/backup');
      if (!response.ok) throw new Error('Failed to generate backup');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `nizam_store_backup_${date}.json`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Database backup downloaded successfully!");
    } catch (error) {
      console.error("Download Error:", error);
      toast.error("Could not download database backup.");
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90] md:hidden transition-opacity"
          onClick={() => setIsDashboardSidebar(false)}
        />
      )}
      
      <aside className={`select-none fixed top-0 left-0 z-[100] text-slate-300 bg-slate-900 h-screen transition-transform duration-300 flex flex-col py-4 overflow-y-auto custom-scrollbar border-r border-slate-800 w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-12 mb-6 px-2">
        <Image src={'/icon.png'} width={80} height={80} alt='icon'/>
      </div>

      <div className="pb-4 border-b border-slate-800 mb-2">
        <MenuItem href="/dashboard" icon={RiHome5Line} label="Management" isOpen={isOpen} />
      </div>

      <div className="flex flex-col gap-1">
        {(isOpen) && (
          <p className="font-bold text-[10px] flex items-center gap-2 px-4 mb-2 uppercase tracking-wider text-slate-500 mt-2">
            <TbMoneybag size={14} /> Purchase & Transaction
          </p>
        )}
        <MenuItem href="/dashboard/pos" icon={RiShoppingCart2Line} label="POS System" isOpen={isOpen} />
        <MenuItem href="/dashboard/pendingorders" icon={RiShoppingCart2Line} label="Pending Orders" isOpen={isOpen} />
        
        <div className="flex flex-col gap-1">
          {(isOpen) && (
            <div onClick={() => setSaleMenuOpen(!saleMenuOpen)} className="flex items-center gap-4 px-4 py-2 cursor-pointer text-[13px] font-medium text-slate-400 hover:text-white transition-colors">
              <BiPurchaseTagAlt size={18} /> Sale Menu 
              <FaChevronDown size={10} className={`ml-auto transition-transform ${saleMenuOpen ? 'rotate-180' : ''}`} />
            </div>
          )}
          <div className={`${(isOpen && saleMenuOpen) ? 'block' : 'hidden'} pl-4 flex flex-col gap-1 border-l-2 border-slate-800 ml-6 my-1`}>
            <MenuItem href="/dashboard/sales-list" icon={RiShoppingBag3Line} label="Sales List" isOpen={isOpen} />
            <MenuItem href="/dashboard/sales-transactions" icon={TbReport} label="Transaction" isOpen={isOpen} />
          </div>
        </div>

        <MenuItem href="/dashboard/purchase" icon={RiShoppingCart2Line} label="Purchase" isOpen={isOpen} />
        
        <div className="flex flex-col gap-1">
          {(isOpen) && (
            <div onClick={() => setPurchaseMenuOpen(!purchaseMenuOpen)} className="flex items-center gap-4 px-4 py-2 cursor-pointer text-[13px] font-medium text-slate-400 hover:text-white transition-colors">
              <BiPurchaseTagAlt size={18} /> Purchase Menu 
              <FaChevronDown size={10} className={`ml-auto transition-transform ${purchaseMenuOpen ? 'rotate-180' : ''}`} />
            </div>
          )}
          <div className={`${(isOpen && purchaseMenuOpen) ? 'block' : 'hidden'} pl-4 flex flex-col gap-1 border-l-2 border-slate-800 ml-6 my-1`}>
            <MenuItem href="/dashboard/purchase-list" icon={RiShoppingBag3Line} label="Purchase List" isOpen={isOpen} />
            <MenuItem href="/dashboard/purchase-transactions" icon={TbReport} label="Transaction" isOpen={isOpen} />
          </div>
        </div>

        <MenuItem href="/dashboard/return-orders" icon={RiRefund2Line} label="Return Goods" isOpen={isOpen} />
        <MenuItem href="/dashboard/damage" icon={RiAlertLine} label="Damage" isOpen={isOpen} />
      </div>

      <div className="flex flex-col gap-1">
        {(isOpen) && (
          <p className="font-bold text-[10px] mb-2 px-4 uppercase tracking-wider text-slate-500 mt-4">
            Product Information
          </p>
        )}
        <MenuItem href="/dashboard/category" icon={RiArchiveLine} label="Category" isOpen={isOpen} />
        <div className="flex flex-col gap-1">
          {(isOpen) && (
            <div onClick={() => setProductsMenuOpen(!productsMenuOpen)} className="flex items-center gap-4 px-4 py-2 cursor-pointer text-[13px] font-medium text-slate-400 hover:text-white transition-colors">
              <RiProductHuntLine size={18} /> Products 
              <FaChevronDown size={10} className={`ml-auto transition-transform ${productsMenuOpen ? 'rotate-180' : ''}`} />
            </div>
          )}
          <div className={`${(isOpen && productsMenuOpen) ? 'block' : 'hidden'} pl-4 flex flex-col gap-1 border-l-2 border-slate-800 ml-6 my-1`}>
            <MenuItem href="/dashboard/newproduct" icon={RiPriceTag3Line} label="New Product" isOpen={isOpen} />
            <MenuItem href="/dashboard/products" icon={RiShoppingBag3Line} label="Product List" isOpen={isOpen} />
          </div>
        </div>
        <MenuItem href="/dashboard/brand" icon={RiPriceTag3Line} label="Brand" isOpen={isOpen} />
      </div>

      <div className="flex flex-col gap-1">
        {(isOpen) && (
          <p className="font-bold text-[10px] mb-2 px-4 uppercase tracking-wider text-slate-500 mt-4">
            Customer & Supplier
          </p>
        )}
        <MenuItem href="/dashboard/customer" icon={RiUser3Line} label="Customer" isOpen={isOpen} />
        <MenuItem href="/dashboard/supplier" icon={RiTruckLine} label="Supplier" isOpen={isOpen} />
      </div>

      <div className="flex flex-col gap-1">
        {(isOpen) && (
          <p className="font-bold text-[10px] flex items-center gap-2 px-4 mb-2 uppercase tracking-wider text-slate-500 mt-4">
            <TbReportMoney size={14} /> Report & Ledger
          </p>
        )}
        <MenuItem href="/dashboard/ledger" icon={RiFileChartLine} label="Ledger" isOpen={isOpen} />
        <div className="flex flex-col gap-1">
          {(isOpen) && (
            <div onClick={() => setReportMenuOpen(!reportMenuOpen)} className="flex items-center gap-4 px-4 py-2 cursor-pointer text-[13px] font-medium text-slate-400 hover:text-white transition-colors">
              <TbReportSearch size={18} /> Report 
              <FaChevronDown size={10} className={`ml-auto transition-transform ${reportMenuOpen ? 'rotate-180' : ''}`} />
            </div>
          )}
          <div className={`${(isOpen && reportMenuOpen) ? 'block' : 'hidden'} pl-4 flex flex-col gap-1 border-l-2 border-slate-800 ml-6 my-1`}>
            <MenuItem href="/dashboard/sales" icon={TbReport} label="Sales" isOpen={isOpen} />
            <MenuItem href="/dashboard/stock" icon={RiFileChartLine} label="Stock" isOpen={isOpen} />
            <MenuItem href="/dashboard/analytics" icon={TbReportAnalytics} label="Analytics" isOpen={isOpen} />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-800 flex flex-col gap-1">
        {(isOpen) && (
          <p className="font-bold text-[10px] flex items-center gap-2 px-4 mb-2 uppercase tracking-wider text-slate-500">
            <BsFillHouseGearFill size={14} /> Settings
          </p>
        )}
        <MenuItem href="/dashboard/account" icon={RiUser3Line} label="Account" isOpen={isOpen} />
        <MenuItem href="/dashboard/rolemanagement" icon={RiUserAddLine} label="Role Management" isOpen={isOpen} />
        <MenuItem href="/dashboard/support" icon={RiSuperscript} label="Support" isOpen={isOpen} />
        
        {(isOpen) && (
          <button 
            onClick={downloadDB} 
            className="flex items-center justify-center gap-2 px-2 py-2.5 text-sm font-semibold bg-slate-800 text-sky-400 rounded-xl hover:bg-slate-700 transition-colors mx-4 my-2 border border-slate-700"
          >
            <BsFillHouseGearFill size={16} />
            <span>Backup Data</span>
          </button>
        )}
        
        <MenuItem href="/" icon={TbReport} label="Website" isOpen={isOpen} />
        
        {(isOpen) && (
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center w-[calc(100%-2rem)] bg-rose-500/10 text-rose-500 py-2.5 rounded-xl mx-4 mt-4 cursor-pointer font-bold hover:bg-rose-500 hover:text-white transition-colors border border-rose-500/20 shadow-sm"
          >
            Logout
          </button>
        )}
      </div>
      </aside>
    </>
  )
}

export default DashboardSidebar
