'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const AnalyticsPage = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('/api/report/analytics')
                setData(res.data.payload)
            } catch (err) { console.log(err) }
            finally { setLoading(false) }
        }
        fetchAnalytics()
    }, [])

    if (loading) return <div className='p-10 text-center text-gray-400 animate-pulse'>Aggregating Data...</div>

    const chartConfig = {
        labels: data?.chartData?.map(d => d.date) || [],
        datasets: [{
            label: 'Daily Sales',
            data: data?.chartData?.map(d => Number(d.amount)) || [],
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            fill: true,
            tension: 0.4,
        }]
    }

    const formatNum = (val) => Number(val || 0).toLocaleString();

    return (
        <div className=' mx-auto w-full p-8 flex flex-col gap-8 bg-white min-h-screen'>
            <div className='flex flex-col gap-1'>
                <h1 className='text-3xl font-black text-gray-900'>Business Analytics</h1>
                <p className='text-gray-400 text-sm font-medium tracking-widest uppercase'>Periodic Growth & Capital Overview</p>
            </div>

            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                {[
                    { label: 'Today', val: data?.sales?.today },
                    { label: 'Yesterday', val: data?.sales?.yesterday },
                    { label: 'Last 7 Days', val: data?.sales?.last_week },
                    { label: 'This Year', val: data?.sales?.last_year },
                ].map((s, i) => (
                    <div key={i} className='p-6 bg-gray-50 rounded-2xl border border-gray-100'>
                        <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>{s.label}</span>
                        <p className='text-xl font-black text-gray-800 mt-1'>৳{formatNum(s.val)}</p>
                    </div>
                ))}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='p-8 bg-sky-600 rounded-3xl text-white shadow-xl shadow-sky-100'>
                    <span className='text-xs font-bold opacity-80 uppercase tracking-wider'>Total Invested</span>
                    <p className='text-3xl font-black mt-2'>৳{formatNum(data?.finance?.total_invested)}</p>
                </div>
                <div className='p-8 bg-emerald-600 rounded-3xl text-white shadow-xl shadow-emerald-100'>
                    <span className='text-xs font-bold opacity-80 uppercase tracking-wider'>Total Earned</span>
                    <p className='text-3xl font-black mt-2'>৳{formatNum(data?.finance?.total_earned)}</p>
                </div>
                <div className='p-8 bg-gray-900 rounded-3xl text-white shadow-xl shadow-gray-200'>
                    <span className='text-xs font-bold opacity-80 uppercase tracking-wider'>Remaining Capitals</span>
                    <p className='text-3xl font-black mt-2'>৳{formatNum(data?.finance?.remaining_capitals)}</p>
                </div>
            </div>

            <div className='w-full p-8 border border-gray-100 rounded-3xl bg-white shadow-sm'>
                <h3 className='text-lg font-bold text-gray-800 mb-6'>Sales Growth (Last 7 Days)</h3>
                <div className='h-75 w-full'>
                    <Line data={chartConfig} options={{ maintainAspectRatio: false, responsive: true }} />
                </div>
            </div>
        </div>
    )
}

export default AnalyticsPage