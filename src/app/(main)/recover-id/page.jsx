'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, Key } from 'lucide-react'

const CustomerRecoveryPage = () => {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)

    useEffect(() => {
        let timer
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [resendCooldown])

    const handleRequestOTP = async (e) => {
        e.preventDefault()
        const cleanEmail = email.trim()
        if (!cleanEmail) {
            toast.error("Please enter your email address")
            return
        }

        setLoading(true)
        try {
            const res = await axios.post('/api/user/forgetpassword', { email: cleanEmail })
            if (res.data.success) {
                toast.success(res.data.message || "Reset code sent to your email!")
                setStep(2)
                setResendCooldown(60)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send reset code")
        } finally {
            setLoading(false)
        }
    }

    const handleResendOTP = async () => {
        if (resendCooldown > 0 || loading) return
        setLoading(true)
        try {
            const res = await axios.post('/api/user/forgetpassword', { email: email.trim() })
            if (res.data.success) {
                toast.success("A new code has been sent to your email.")
                setResendCooldown(60)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resend code")
        } finally {
            setLoading(false)
        }
    }

    const handleFinalReset = async (e) => {
        e.preventDefault()

        if (!otp || otp.trim().length !== 6) {
            toast.error("Please enter the 6-digit verification code")
            return
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        setLoading(true)
        try {
            const res = await axios.post('/api/user/forgetpassword/reset', {
                email: email.trim(),
                otp: otp.trim(),
                newPassword
            })

            if (res.data.success) {
                toast.success("Password reset successful! Redirecting to login...")
                setTimeout(() => {
                    router.push('/login')
                }, 1500)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full min-h-[85vh] flex items-center justify-center p-4 bg-slate-50/50 pt-20 font-sans text-slate-800'>
            <div className='w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 relative'>
                
                <div className='text-center mb-6'>
                    
                    <h1 className='text-xl font-bold tracking-tight text-slate-900'>Account Recovery</h1>
                    <p className='text-xs text-slate-500 mt-1'>
                        {step === 1 ? 'Enter your registered email to reset password' : `Verification code sent to ${email}`}
                    </p>
                </div>

                <AnimatePresence mode='wait'>
                    {step === 1 ? (
                        <motion.form
                            key='user-step-1'
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleRequestOTP}
                            className='space-y-4'
                        >
                            <div className='space-y-1.5'>
                                <label htmlFor='email' className='text-xs font-semibold text-slate-700'>Email Address</label>
                                <div className='relative'>
                                    <Mail size={17} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                                    <input
                                        type='email'
                                        id='email'
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='name@example.com'
                                        className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-medium'
                                    />
                                </div>
                            </div>

                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full py-2.5 px-4 bg-slate-900 hover:bg-primary text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md'
                            >
                                {loading ? (
                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                ) : (
                                    <>
                                        <span>Send Verification Code</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>

                            <div className='flex items-center justify-between pt-2 text-xs'>
                                <Link href='/login' className='text-slate-500 hover:text-slate-900 font-semibold transition-colors inline-flex items-center gap-1'>
                                    <ArrowLeft size={13} /> Sign In
                                </Link>
                                <Link href='/register' className='text-primary font-bold hover:underline'>
                                    Create Account
                                </Link>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.form
                            key='user-step-2'
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleFinalReset}
                            className='space-y-4'
                        >
                            {/* OTP */}
                            <div className='space-y-1.5'>
                                <label htmlFor='otp' className='text-xs font-semibold text-slate-700'>6-Digit Verification Code</label>
                                <div className='relative'>
                                    <KeyRound size={17} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                                    <input
                                        type='text'
                                        id='otp'
                                        maxLength={6}
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder='123456'
                                        className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold tracking-[0.3em] text-slate-900 placeholder:tracking-normal placeholder:text-slate-300 outline-none focus:border-primary focus:bg-white transition-all'
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className='space-y-1.5'>
                                <label htmlFor='newPassword' className='text-xs font-semibold text-slate-700'>New Password</label>
                                <div className='relative'>
                                    <Lock size={17} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id='newPassword'
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder='••••••••'
                                        className='w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary focus:bg-white transition-all'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className='space-y-1.5'>
                                <label htmlFor='confirmPassword' className='text-xs font-semibold text-slate-700'>Confirm Password</label>
                                <div className='relative'>
                                    <Lock size={17} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id='confirmPassword'
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder='••••••••'
                                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                                            confirmPassword && confirmPassword !== newPassword
                                                ? 'border-rose-400 focus:border-rose-500'
                                                : confirmPassword && confirmPassword === newPassword
                                                ? 'border-emerald-400 focus:border-emerald-500'
                                                : 'border-slate-200 focus:border-primary focus:bg-white'
                                        }`}
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {confirmPassword && confirmPassword !== newPassword && (
                                    <p className='text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-medium'>
                                        <AlertCircle size={12} /> Passwords do not match
                                    </p>
                                )}
                                {confirmPassword && confirmPassword === newPassword && (
                                    <p className='text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium'>
                                        <CheckCircle2 size={12} /> Passwords match
                                    </p>
                                )}
                            </div>

                            <button
                                type='submit'
                                disabled={loading || (confirmPassword !== '' && confirmPassword !== newPassword)}
                                className='w-full py-2.5 px-4 bg-slate-900 hover:bg-primary text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md'
                            >
                                {loading ? (
                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                ) : (
                                    <>
                                        <span>Update Password</span>
                                        <CheckCircle2 size={16} />
                                    </>
                                )}
                            </button>

                            <div className='flex items-center justify-between text-xs pt-2 text-slate-500'>
                                <button
                                    type='button'
                                    onClick={handleResendOTP}
                                    disabled={resendCooldown > 0 || loading}
                                    className='hover:text-primary disabled:opacity-50 flex items-center gap-1 font-semibold transition-colors'
                                >
                                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                                    {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setStep(1)}
                                    className='hover:text-slate-900 font-medium transition-colors'
                                >
                                    Change Email
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default CustomerRecoveryPage
