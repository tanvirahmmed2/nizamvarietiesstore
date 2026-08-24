'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, Shield } from 'lucide-react'

const StaffRecoveryPage = () => {
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
            toast.error("Please enter your staff email address")
            return
        }

        setLoading(true)
        try {
            const res = await axios.post('/api/staff/forgetpassword', { email: cleanEmail })
            if (res.data.success) {
                toast.success(res.data.message || "OTP code sent to email")
                setStep(2)
                setResendCooldown(60)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP")
        } finally {
            setLoading(false)
        }
    }

    const handleResendOTP = async () => {
        if (resendCooldown > 0 || loading) return
        setLoading(true)
        try {
            const res = await axios.post('/api/staff/forgetpassword', { email: email.trim() })
            if (res.data.success) {
                toast.success("New OTP code sent to your email")
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
            toast.error("Please enter the 6-digit OTP code")
            return
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        setLoading(true)
        try {
            const res = await axios.post('/api/staff/forgetpassword/reset', {
                email: email.trim(),
                otp: otp.trim(),
                newPassword
            })

            if (res.data.success) {
                toast.success("Password updated successfully! Redirecting...")
                setTimeout(() => {
                    router.push('/access')
                }, 1500)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full min-h-[85vh] flex items-center justify-center p-4  font-sans text-black'>
            <div className='w-full max-w-md  border border-slate-800/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative'>
                
                <div className='text-center mb-6'>
                    
                    <h1 className='text-xl font-semibold tracking-tight'>Staff Password Recovery</h1>
                    <p className='text-xs mt-1'>
                        {step === 1 ? 'Enter your staff email to receive verification code' : `Code sent to ${email}`}
                    </p>
                </div>

                <AnimatePresence mode='wait'>
                    {step === 1 ? (
                        <motion.form
                            key='staff-step-1'
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleRequestOTP}
                            className='space-y-4'
                        >
                            <div className='space-y-1.5'>
                                <label htmlFor='email' className='text-xs font-semibold'>Staff Email</label>
                                <div className='relative'>
                                    <Mail size={17} className='absolute left-3.5 top-1/2 -translate-y-1/2 ' />
                                    <input
                                        type='email'
                                        id='email'
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='staff@nvs.com'
                                        className='w-full pl-10 pr-4 py-2.5  border border-slate-800/30 rounded-xl text-sm  outline-none  transition-colors'
                                    />
                                </div>
                            </div>

                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full py-2.5 px-4 bg-sky-600 text-white cursor-pointer hover:bg-sky-500  font-semibold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2'
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

                            <div className='text-center pt-2'>
                                <Link href='/access' className='text-xs  hover:text-sky-400 transition-colors inline-flex items-center gap-1.5'>
                                    <ArrowLeft size={14} /> Back to Staff Login
                                </Link>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.form
                            key='staff-step-2'
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleFinalReset}
                            className='space-y-4'
                        >
                            <div className='space-y-1.5'>
                                <label htmlFor='otp' className='text-xs font-semibold '>6-Digit Code</label>
                                <div className='relative'>
                                    <KeyRound size={17} className='absolute left-3.5 top-1/2 -translate-y-1/2 ' />
                                    <input
                                        type='text'
                                        id='otp'
                                        maxLength={6}
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder='******'
                                        className='w-full pl-10 pr-4 py-2.5  border border-slate-800/30 rounded-xl text-center text-lg font-bold tracking-[0.3em]  placeholder:tracking-normal  outline-none  transition-colors'
                                    />
                                </div>
                            </div>

                            <div className='space-y-1.5'>
                                <label htmlFor='newPassword' className='text-xs font-semibold '>New Password</label>
                                <div className='relative'>
                                    <Lock size={17} className='absolute left-3.5 top-1/2 -translate-y-1/2 ' />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id='newPassword'
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder='••••••••'
                                        className='w-full pl-10 pr-10 py-2.5  border border-slate-800/30 rounded-xl text-sm outline-none transition-colors'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2  hover:'
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className='space-y-1.5'>
                                <label htmlFor='confirmPassword' className='text-xs font-semibold '>Confirm Password</label>
                                <div className='relative'>
                                    <Lock size={17} className='absolute left-3.5 top-1/2 -translate-y-1/2 ' />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id='confirmPassword'
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder='••••••••'
                                        className={`w-full pl-10 pr-10 py-2.5  border rounded-xl text-sm   outline-none transition-colors ${
                                            confirmPassword && confirmPassword !== newPassword
                                                ? 'border-rose-500/80 focus:border-rose-500'
                                                : confirmPassword && confirmPassword === newPassword
                                                ? 'border-primary '
                                                : 'border-slate-800/30 '
                                        }`}
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2  hover:'
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {confirmPassword && confirmPassword !== newPassword && (
                                    <p className='text-[11px] text-rose-400 flex items-center gap-1 mt-1'>
                                        <AlertCircle size={12} /> Passwords do not match
                                    </p>
                                )}
                                {confirmPassword && confirmPassword === newPassword && (
                                    <p className='text-[11px] text-primary flex items-center gap-1 mt-1'>
                                        <CheckCircle2 size={12} /> Passwords match
                                    </p>
                                )}
                            </div>

                            <button
                                type='submit'
                                disabled={loading || (confirmPassword !== '' && confirmPassword !== newPassword)}
                                className='w-full py-2.5 px-4 bg-primary/80 text-white cursor-pointer hover:bg-primary font-semibold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2'
                            >
                                {loading ? (
                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                ) : (
                                    <>
                                        <span>Reset Password</span>
                                        <CheckCircle2 size={16} />
                                    </>
                                )}
                            </button>

                            <div className='flex items-center justify-between text-xs pt-2 '>
                                <button
                                    type='button'
                                    onClick={handleResendOTP}
                                    disabled={resendCooldown > 0 || loading}
                                    className='hover:text-sky-400 disabled:opacity-50 flex items-center gap-1 font-medium transition-colors'
                                >
                                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                                    {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setStep(1)}
                                    className='transition-colors'
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

export default StaffRecoveryPage
