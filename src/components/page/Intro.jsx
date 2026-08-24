'use client'
import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const images = [
    'https://res.cloudinary.com/dz45x9efk/image/upload/v1778366015/nizamvaritiesstore33_jdrnyr.png',
    'https://res.cloudinary.com/dz45x9efk/image/upload/v1778366051/nizamvaritiesstore3_d6m3al.png',
    'https://res.cloudinary.com/dz45x9efk/image/upload/v1778366050/nizamvaritiesstore1_lbw7v7.png',
    'https://res.cloudinary.com/dz45x9efk/image/upload/v1778366014/nizamvaritiesstore22_vzoqrg.png',
    'https://res.cloudinary.com/dz45x9efk/image/upload/v1778366047/nizamvaritiesstore2_lu7b3x.png',
]

const SLIDE_INTERVAL = 4000 // ms

const Intro = () => {
    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward

    const goTo = useCallback((index, dir = 1) => {
        setDirection(dir)
        setCurrent(index)
    }, [])

    const next = useCallback(() => {
        setDirection(1)
        setCurrent(prev => (prev + 1) % images.length)
    }, [])

    const prev = useCallback(() => {
        setDirection(-1)
        setCurrent(prev => (prev - 1 + images.length) % images.length)
    }, [])

    useEffect(() => {
        const timer = setInterval(next, SLIDE_INTERVAL)
        return () => clearInterval(timer)
    }, [next])

    const slideVariants = {
        enter: (dir) => ({  x: dir > 0 ? 80 : -80, scale: 1.04 }),
        center: {  x: 0, scale: 1 },
        exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80, scale: 0.96 }),
    }

    return (
        <section className='relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900'>

     
            <AnimatePresence custom={direction} initial={false}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    className='absolute inset-0 z-0'
                >
                    <Image
                        src={images[current]}
                        alt={`Slide ${current + 1}`}
                        fill
                        sizes="100vw"
                        className='object-cover blur-[2px] scale-105'
                        priority={current === 0}
                    />
                </motion.div>
            </AnimatePresence>



            <div className='relative z-20 max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-6'>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className='flex flex-col items-center gap-3'
                >
                 
                    <h1 className='text-5xl sm:text-7xl font-black text-white leading-none tracking-tighter uppercase'>
                        Nizam <span className='text-primary'>Varieties Store</span>
                    </h1>
                    <p className='max-w-lg text-base sm:text-lg text-white font-medium leading-relaxed'>
                        Discover an exclusive collection of premium products curated just for you. Quality meets variety at Nizam Varieties Store.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className='flex flex-wrap items-center justify-center gap-3'
                >
                    <Link
                        href='/products'
                        className='group flex items-center gap-2.5 px-6 py-3 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary-dark transition-all shadow-sm active:scale-95'
                    >
                        <ShoppingBag size={18} />
                        Shop Collection
                        <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                    </Link>
                    <Link
                        href='/offers'
                        className='px-6 py-3 bg-white/10 text-white rounded-xl font-bold text-base hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all active:scale-95'
                    >
                        View Offers
                    </Link>
                </motion.div>
            </div>

            <button
                onClick={prev}
                aria-label="Previous slide"
                className='absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/10 text-white transition-all active:scale-90'
            >
                <ChevronLeft size={22} />
            </button>
            <button
                onClick={next}
                aria-label="Next slide"
                className='absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/10 text-white transition-all active:scale-90'
            >
                <ChevronRight size={22} />
            </button>

            {/* ─── Dot Indicators ─── */}
            <div className='absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2'>
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i, i > current ? 1 : -1)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`rounded-full transition-all duration-300 ${
                            i === current
                                ? 'w-7 h-2.5 bg-primary'
                                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                        }`}
                    />
                ))}
            </div>

        </section>
    )
}

export default Intro
