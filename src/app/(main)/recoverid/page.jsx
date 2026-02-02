'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const ForgetPasswordPage = () => {
    const router = useRouter()
    const [view, setView] = useState('request') // 'request' or 'reset'
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const handleRequestOTP = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post('/api/staff/forgetpassword', { email })
            if (res.data.success) {
                toast.success("OTP Dispatched")
                setView('reset')
            }
        } catch (err) { toast.error(err.response?.data?.message || "Error") }
        finally { setLoading(false) }
    }

    const handleFinalReset = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post('/api/staff/forgetpassword/reset', { email, otp, newPassword })
            if (res.data.success) {
                toast.success("Password Updated")
                router.push('/login')
            }
        } catch (err) { toast.error(err.response?.data?.message || "Error") }
        finally { setLoading(false) }
    }

    return (
        <div className='min-h-screen bg-white flex items-center justify-center p-8 font-sans'>
            <div className='max-w-md w-full border-t-8 border-black p-10 shadow-2xl rounded-sm bg-white'>
                
                <div className='mb-10'>
                    <h1 className='text-3xl font-black uppercase tracking-tighter text-gray-900'>
                        {view === 'request' ? 'Password Recovery' : 'Identity Verified'}
                    </h1>
                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2'>
                        {view === 'request' ? 'System Access Restoration' : 'Enter Received Credentials'}
                    </p>
                </div>

                {view === 'request' ? (
                    <form onSubmit={handleRequestOTP} className='flex flex-col gap-6'>
                        <div className='flex flex-col gap-2'>
                            <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Email Registry</label>
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full border-b-2 border-gray-100 py-3 outline-none focus:border-black transition-all text-lg font-medium'
                                placeholder="name@company.com"
                            />
                        </div>
                        <button 
                            disabled={loading}
                            className='w-full bg-black text-white py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-all disabled:opacity-50'
                        >
                            {loading ? 'Transmitting...' : 'Request OTP Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleFinalReset} className='flex flex-col gap-6'>
                        <div className='flex flex-col gap-2'>
                            <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>One-Time Code</label>
                            <input 
                                type="text"
                                maxLength="6"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className='w-full border-b-2 border-gray-100 py-3 outline-none focus:border-black transition-all text-center text-3xl font-black tracking-[0.4em]'
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>New Secure Password</label>
                            <input 
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className='w-full border-b-2 border-gray-100 py-3 outline-none focus:border-black transition-all'
                            />
                        </div>
                        <button 
                            disabled={loading}
                            className='w-full bg-black text-white py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-600 transition-all'
                        >
                            {loading ? 'Updating...' : 'Set New Password'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setView('request')}
                            className='text-[10px] font-bold text-gray-300 uppercase hover:text-black text-center'
                        >
                            Resend Code
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ForgetPasswordPage