import { isUserLogin } from '@/lib/usermiddleware'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { BASE_URL } from '@/lib/database/secret'

export const metadata = {
    title: 'Profile | User Dashboard',
    description: 'Manage your personal information and orders'
}

const UserProfileLayout = async ({ children }) => {
    // Check authentication
    const auth = await isUserLogin()
    if (!auth.success) return redirect('/login')

    const user = auth.payload;

   
    return (
        <div className='w-full min-h-screen bg-gray-50'>
            <header className='w-full bg-white border-b sticky top-0 z-10'>
                <div className='max-w-6xl mx-auto px-4 h-16 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className='h-8 w-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm'>
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className='font-semibold text-gray-800 hidden sm:inline-block'>
                            {user.name}
                        </span>
                    </div>

                    <nav className='flex items-center gap-6'>
                        <Link href="/profile" className='text-sm font-medium hover:text-black transition-colors'>
                            Dashboard
                        </Link>
                        <Link href="/profile/orders" className='text-sm font-medium hover:text-black transition-colors'>
                            Orders
                        </Link>
                        
                    </nav>
                </div>
            </header>

            <main className='w-full'>
                {children}
            </main>
        </div>
    )
}

export default UserProfileLayout