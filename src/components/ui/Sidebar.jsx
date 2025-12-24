'use client'
import Link from 'next/link'
import React from 'react'
import Logout from '../buttons/Logout'

const Sidebar = ({ isSidebar, setIsSidebar }) => {
    return (
        <div className={`w-full flex md:hidden items-center flex-col justify-center gap-2 p-4 ${isSidebar ? 'flex' : 'hidden'}`}>
            <Link href={'/'} onClick={()=> setIsSidebar(false)}>Home</Link>
            <Link href={'/menu'} onClick={()=> setIsSidebar(false)}>Menu</Link>
            <Link href={'/login'} onClick={()=> setIsSidebar(false)}>Login</Link>
            <Link href={'/cart'} onClick={()=> setIsSidebar(false)}>Cart</Link>
            <Link href={'/manage'} onClick={()=> setIsSidebar(false)}>Manage</Link>
            <Link href={'/sales'} onClick={()=> setIsSidebar(false)}>Sales</Link>
            <Link href={'/profile'} onClick={()=> setIsSidebar(false)}>Profile</Link>
            <p onClick={()=> setIsSidebar(false)}><Logout /></p>


        </div>
    )
}

export default Sidebar
