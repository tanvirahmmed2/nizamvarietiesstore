'use client'
import Link from 'next/link'
import React, { useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  RiCloseLine,
  RiDashboard3Line,
  RiStore2Line,
  RiTimeLine,
  RiFileList3Line,
  RiShoppingBag3Line,
  RiListCheck2,
  RiRefund2Line,
  RiHistoryLine,
  RiExchangeDollarLine,
  RiCoinsLine,
  RiAlertLine,
  RiPriceTag3Line,
  RiBox3Line,
  RiAddBoxLine,
  RiAwardLine,
  RiGroupLine,
  RiTruckLine,
  RiBookReadLine,
  RiLineChartLine,
  RiStackLine,
  RiPieChartLine,
  RiShieldUserLine,
  RiCustomerService2Line,
  RiDatabase2Line,
  RiUser3Line,
  RiLogoutBoxRLine,
  RiHome4Line,
  RiArrowDownSLine,
} from 'react-icons/ri'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { Context } from '../helper/Context'
import Image from 'next/image'

const DashboardSidebar = () => {
  const [group, setGroup] = useState('')
  const { isDashboardSidebar: isOpen, setIsDashboardSidebar } = useContext(Context)
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    if (pathname.startsWith('/dashboard/purchase') || pathname.startsWith('/dashboard/purchase-list')) {
      setGroup('purchase')
    } else if (pathname.startsWith('/dashboard/return')) {
      setGroup('return')
    } else if (
      pathname.startsWith('/dashboard/sales-transactions') ||
      pathname.startsWith('/dashboard/purchase-transactions')
    ) {
      setGroup('transactions')
    } else if (pathname.startsWith('/dashboard/damage')) {
      setGroup('damage')
    } else if (
      pathname.startsWith('/dashboard/products') ||
      pathname.startsWith('/dashboard/new-product')
    ) {
      setGroup('products')
    } else if (
      pathname.startsWith('/dashboard/ledger') ||
      pathname.startsWith('/dashboard/sales-report') ||
      pathname.startsWith('/dashboard/stock') ||
      pathname.startsWith('/dashboard/analytics')
    ) {
      setGroup('report')
    }
  }, [pathname])

  const toggleGroup = (groupName) => {
    setGroup((prev) => (prev === groupName ? '' : groupName))
  }

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

  const isActive = (href) => {
    if (!pathname) return false
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const renderNavLink = (href, label, Icon, isSub = false) => {
    const active = isActive(href)
    return (
      <Link
        key={href + label}
        href={href}
        onClick={() => {
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsDashboardSidebar(false)
          }
        }}
        className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm  transition-all duration-200 ${active
            ? 'bg-primary text-white    shadow-sm shadow-sky-500/10'
            : 'text-white hover:text-slate-100 hover:bg-slate-800/60'
          } ${isSub ? 'py-1.5 text-xs' : ''}`}
      >
        {Icon && (
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-primary' : 'text-slate-400 group-hover:text-slate-200'
              }`}
          />
        )}
        <span className="truncate">{label}</span>
      </Link>
    )
  }

  const renderNavButton = (onClick, label, Icon, variant = 'default') => {
    const isDanger = variant === 'danger'
    return (
      <button
        type="button"
        onClick={() => {
          onClick()
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsDashboardSidebar(false)
          }
        }}
        className={`group relative flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm  transition-all duration-200 cursor-pointer ${isDanger
            ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/15'
            : 'text-white hover:text-slate-100 hover:bg-slate-800/60'
          }`}
      >
        {Icon && (
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${isDanger
                ? 'text-rose-400 group-hover:text-rose-300'
                : 'text-slate-400 group-hover:text-slate-200'
              }`}
          />
        )}
        <span className="truncate">{label}</span>
      </button>
    )
  }

  const renderGroupHeader = (groupKey, label, Icon) => {
    const isOpen = group === groupKey
    return (
      <button
        type="button"
        onClick={() => toggleGroup(groupKey)}
        className="group relative flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 text-white hover:text-slate-100 hover:bg-slate-800/60 cursor-pointer"
      >
        <span className="flex items-center gap-3">
          {Icon && (
            <Icon
              className={`w-4 h-4 shrink-0 transition-colors ${
                isOpen ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            />
          )}
          <span className="truncate">{label}</span>
        </span>
        <RiArrowDownSLine
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-sky-400' : 'text-slate-500 group-hover:text-slate-300'
          }`}
        />
      </button>
    )
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsDashboardSidebar(false)}
        />
      )}

      <aside
        className={`select-none fixed top-0 left-0 z-50 text-slate-300 bg-slate-950 h-screen transition-transform duration-300 ease-in-out flex flex-col p-3.5 border-r border-slate-800/80 w-64 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 mb-3 px-2 border-b border-slate-800/80 pb-3">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="p-1 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-sky-500/50 transition-colors">
              <Image
                src={'/icon.png'}
                width={32}
                height={32}
                alt="icon"
                className="h-7 w-7 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-100 text-sm tracking-wide group-hover:text-primary transition-colors">
                Nizam Store
              </span>
              <span className="text-[10px] text-slate-400  tracking-wider uppercase">
                Admin Panel
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsDashboardSidebar(false)}
            className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Sidebar"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar pr-1 gap-4">
          <div className="flex flex-col gap-1">
            {renderNavLink('/dashboard', 'Dashboard', RiDashboard3Line)}
            {renderNavLink('/dashboard/pos', 'POS', RiStore2Line)}
            {renderNavLink('/dashboard/pending-orders', 'Pending Orders', RiTimeLine)}
            {renderNavLink('/dashboard/sales-list', 'Sales List', RiFileList3Line)}

            {/* Purchase Group */}
            <div className="mt-1 flex flex-col gap-1">
              {renderGroupHeader('purchase', 'Purchase', RiShoppingBag3Line)}
              {group === 'purchase' && (
                <div className="flex flex-col gap-0.5 pl-3 border-l border-slate-800/80 ml-3">
                  {renderNavLink('/dashboard/purchase', 'Purchase', RiShoppingBag3Line, true)}
                  {renderNavLink('/dashboard/purchase-list', 'Purchase List', RiListCheck2, true)}
                </div>
              )}
            </div>

            {/* Return Group */}
            <div className="mt-1 flex flex-col gap-1">
              {renderGroupHeader('return', 'Return', RiRefund2Line)}
              {group === 'return' && (
                <div className="flex flex-col gap-0.5 pl-3 border-l border-slate-800/80 ml-3">
                  {renderNavLink('/dashboard/return-orders', 'Orders', RiRefund2Line, true)}
                  {renderNavLink('/dashboard/return-purchases', 'Purchases', RiHistoryLine, true)}
                </div>
              )}
            </div>

            {/* Transactions Group */}
            <div className="mt-1 flex flex-col gap-1">
              {renderGroupHeader('transactions', 'Transactions', RiExchangeDollarLine)}
              {group === 'transactions' && (
                <div className="flex flex-col gap-0.5 pl-3 border-l border-slate-800/80 ml-3">
                  {renderNavLink(
                    '/dashboard/sales-transactions',
                    'Sales Transactions',
                    RiExchangeDollarLine,
                    true
                  )}
                  {renderNavLink(
                    '/dashboard/purchase-transactions',
                    'Purchases Transactions',
                    RiCoinsLine,
                    true
                  )}
                </div>
              )}
            </div>

            {/* Damage Group */}
            <div className="mt-1 flex flex-col gap-1">
              {renderGroupHeader('damage', 'Damage', RiAlertLine)}
              {group === 'damage' && (
                <div className="flex flex-col gap-0.5 pl-3 border-l border-slate-800/80 ml-3">
                  {renderNavLink('/dashboard/damage', 'Damage', RiAlertLine, true)}
                  {renderNavLink('/dashboard/damage-list', 'Damage List', RiFileList3Line, true)}
                </div>
              )}
            </div>

            {renderNavLink('/dashboard/category', 'Category', RiPriceTag3Line)}

            {/* Products Group */}
            <div className="mt-1 flex flex-col gap-1">
              {renderGroupHeader('products', 'Products', RiBox3Line)}
              {group === 'products' && (
                <div className="flex flex-col gap-0.5 pl-3 border-l border-slate-800/80 ml-3">
                  {renderNavLink('/dashboard/products', 'Products', RiBox3Line, true)}
                  {renderNavLink('/dashboard/new-product', 'Add Product', RiAddBoxLine, true)}
                </div>
              )}
            </div>

            {renderNavLink('/dashboard/brand', 'Brands', RiAwardLine)}
            {renderNavLink('/dashboard/customer', 'Customers', RiGroupLine)}
            {renderNavLink('/dashboard/supplier', 'Supplier', RiTruckLine)}

            {/* Report Group */}
            <div className="mt-1 flex flex-col gap-1">
              {renderGroupHeader('report', 'Report', RiPieChartLine)}
              {group === 'report' && (
                <div className="flex flex-col gap-0.5 pl-3 border-l border-slate-800/80 ml-3">
                  {renderNavLink('/dashboard/ledger', 'Ledger', RiBookReadLine, true)}
                  {renderNavLink('/dashboard/sales-report', 'Sales', RiLineChartLine, true)}
                  {renderNavLink('/dashboard/stock', 'Stock', RiStackLine, true)}
                  {renderNavLink('/dashboard/analytics', 'Analytics', RiPieChartLine, true)}
                </div>
              )}
            </div>

            {renderNavLink('/dashboard/role-management', 'Role Management', RiShieldUserLine)}
            {renderNavLink('/dashboard/support', 'Support', RiCustomerService2Line)}

            {renderNavButton(downloadDB, 'Backup', RiDatabase2Line)}
          </div>

          {/* Footer Group (Account, Logout, Home) */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-1 bg-slate-950/80 rounded-xl">
            {renderNavLink('/dashboard/account', 'Account', RiUser3Line)}
            {renderNavButton(handleLogout, 'Logout', RiLogoutBoxRLine, 'danger')}
            {renderNavLink('/', 'Home', RiHome4Line)}
          </div>
        </div>
      </aside>
    </>
  )
}

export default DashboardSidebar
