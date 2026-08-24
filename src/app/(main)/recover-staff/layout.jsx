import { isLogin } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata = {
    title: 'Staff Password Recovery | Nizam Varieties Store',
    description: 'Staff password recovery portal for Nizam Varieties Store management system.'
}

const RecoverStaffLayout = async ({ children }) => {
    const auth = await isLogin()
    if (auth.success) {
        return redirect('/dashboard')
    }

    return (
        <div className='w-full min-h-screen '>
            {children}
        </div>
    )
}

export default RecoverStaffLayout
