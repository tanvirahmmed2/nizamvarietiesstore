import { isLogin } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata = {
    title: 'Account Recovery | Nizam Varieties Store',
    description: 'Reset your password and recover your Nizam Varieties Store customer account.'
}

const RecoverCustomerLayout = async ({ children }) => {
    const auth = await isLogin()
    if (auth.success) {
        return redirect('/profile')
    }

    return (
        <div className='w-full'>
            {children}
        </div>
    )
}

export default RecoverCustomerLayout
