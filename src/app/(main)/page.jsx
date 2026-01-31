import Footer from '@/components/bar/Footer'
import Intro from '@/components/page/Intro'
import StoreVisit from '@/components/page/StoreVisit'
import Support from '@/components/page/Support'
import React from 'react'

const MainPage = () => {
  return (
    <div className='w-full min-h-screen flex flex-col'>
      <Intro />
      <StoreVisit/>
      <Support />
    </div>
  )
}

export default MainPage
