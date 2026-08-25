'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { 
  RiHome5Line, RiProductHuntLine, RiShoppingCart2Line, 
  RiRefund2Line, RiAlertLine, RiUser3Line, RiTruckLine, 
  RiFileChartLine, RiArchiveLine, 
  RiPriceTag3Line, RiShoppingBag3Line, RiUserAddLine, 
  RiSuperscript, RiCloseLine, RiGlobeLine 
} from "react-icons/ri"
import { TbReport, TbReportAnalytics, TbReportSearch } from "react-icons/tb"
import { usePathname } from 'next/navigation'
import { BiPurchaseTagAlt } from "react-icons/bi"
import { BsFillHouseGearFill } from "react-icons/bs"
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { Context } from '../helper/Context'
import Image from 'next/image'

const MenuItem = ({ href, icon: Icon, label, isOpen }) => {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link 
      href={href} 
      className={`group flex flex-row gap-3.5 items-center px-3 py-2 transition-all rounded-xl mx-2 ${
        isActive 
          ? 'bg-linear-to-r from-sky-500 to-indigo-500 text-white shadow-md shadow-sky-500/20 font-medium' 
          : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium'
      }`}
    >
      <Icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`} />
      {isOpen && <span className="whitespace-nowrap text-xs tracking-wide">{label}</span>}
    </Link>
  )
}

const SectionHeader = ({ title, isOpen }) => {
  if (!isOpen) return <div className="h-2" />
  return (
    <p className="font-bold text-[10px] px-5 mb-1.5 uppercase tracking-wider text-slate-500 mt-4">
      {title}
    </p>
  )
}

const DashboardSidebar = () => {
  const { isDashboardSidebar: isOpen, setIsDashboardSidebar } = useContext(Context)

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
        
        {/* Logo Header */}
        <div className="flex items-center justify-between h-12 mb-4 px-4 relative border-b border-slate-800 pb-3">
          <div className="flex items-center justify-center w-full">
            <Image src={'/icon.png'} width={80} height={80} alt='icon' className="h-auto w-auto max-h-10 object-contain" />
          </div>
          <button 
            onClick={() => setIsDashboardSidebar(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 absolute right-3 cursor-pointer"
            title="Close Sidebar"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Menu Items List */}
        <div className="flex flex-col gap-0.5">
          <MenuItem href="/dashboard" icon={RiHome5Line} label="Dashboard" isOpen={isOpen} />
          <MenuItem href="/dashboard/pos" icon={RiShoppingCart2Line} label="POS Register" isOpen={isOpen} />
          <MenuItem href="/dashboard/pendingorders" icon={RiShoppingBag3Line} label="Pending Orders" isOpen={isOpen} />

          <SectionHeader title="Sales & Purchase" isOpen={isOpen} />
          <MenuItem href="/dashboard/sales-list" icon={BiPurchaseTagAlt} label="Sales List" isOpen={isOpen} />
          <MenuItem href="/dashboard/sales-transactions" icon={TbReport} label="Sales Transactions" isOpen={isOpen} />
          <MenuItem href="/dashboard/purchase" icon={RiShoppingCart2Line} label="New Purchase" isOpen={isOpen} />
          <MenuItem href="/dashboard/purchase-list" icon={RiShoppingBag3Line} label="Purchase List" isOpen={isOpen} />
          <MenuItem href="/dashboard/purchase-transactions" icon={TbReport} label="Purchase Transactions" isOpen={isOpen} />
          <MenuItem href="/dashboard/return-orders" icon={RiRefund2Line} label="Return Goods" isOpen={isOpen} />
          <MenuItem href="/dashboard/damage" icon={RiAlertLine} label="Damaged Items" isOpen={isOpen} />

          <SectionHeader title="Product Catalog" isOpen={isOpen} />
          <MenuItem href="/dashboard/products" icon={RiProductHuntLine} label="Product List" isOpen={isOpen} />
          <MenuItem href="/dashboard/newproduct" icon={RiPriceTag3Line} label="Add New Product" isOpen={isOpen} />
          <MenuItem href="/dashboard/category" icon={RiArchiveLine} label="Categories" isOpen={isOpen} />
          <MenuItem href="/dashboard/brand" icon={RiPriceTag3Line} label="Brands" isOpen={isOpen} />

          <SectionHeader title="Contacts & Reports" isOpen={isOpen} />
          <MenuItem href="/dashboard/customer" icon={RiUser3Line} label="Customers" isOpen={isOpen} />
          <MenuItem href="/dashboard/supplier" icon={RiTruckLine} label="Suppliers" isOpen={isOpen} />
          <MenuItem href="/dashboard/ledger" icon={RiFileChartLine} label="Ledger Book" isOpen={isOpen} />
          <MenuItem href="/dashboard/sales" icon={TbReportSearch} label="Sales Report" isOpen={isOpen} />
          <MenuItem href="/dashboard/stock" icon={RiFileChartLine} label="Stock Report" isOpen={isOpen} />
          <MenuItem href="/dashboard/analytics" icon={TbReportAnalytics} label="Analytics" isOpen={isOpen} />

          <SectionHeader title="System & Account" isOpen={isOpen} />
          <MenuItem href="/dashboard/account" icon={RiUser3Line} label="My Account" isOpen={isOpen} />
          <MenuItem href="/dashboard/rolemanagement" icon={RiUserAddLine} label="Role Management" isOpen={isOpen} />
          <MenuItem href="/dashboard/support" icon={RiSuperscript} label="Support" isOpen={isOpen} />
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-slate-800 flex flex-col gap-1.5">
          {isOpen && (
            <button 
              onClick={downloadDB} 
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-slate-800 text-sky-400 rounded-xl hover:bg-slate-700 transition-colors mx-3 border border-slate-700 cursor-pointer"
            >
              <BsFillHouseGearFill size={14} />
              <span>Backup Database</span>
            </button>
          )}
          
          <MenuItem href="/" icon={RiGlobeLine} label="Back to Website" isOpen={isOpen} />
          
          {isOpen && (
            <button 
              onClick={handleLogout} 
              className="flex items-center justify-center w-[calc(100%-1.5rem)] bg-rose-500/10 text-rose-400 text-xs py-2 rounded-xl mx-3 my-1 cursor-pointer font-bold hover:bg-rose-500 hover:text-white transition-colors border border-rose-500/20 shadow-xs"
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
