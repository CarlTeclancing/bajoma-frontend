import React, { type ReactNode } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'


interface HomeLayoutProps {
  children: ReactNode;
}
const HomeLayout = ({children}: HomeLayoutProps) => {
  return (
    <div className='flex items-center w-full flex-col h-auto'>
      <Navigation />
        {children}
      <Footer />
    </div>
  )
}

export default HomeLayout