import React from 'react'
import SideBar from '../dashboard/SideBar';
import TopNavigation from '../dashboard/TopNavigation';

interface DashboardLayoutProps{
    children: React.ReactNode;
}
const DashboardLayout = ({children}: DashboardLayoutProps) => {
  return (
    <div className='w-full h-[100vh] bg-[#F8FFF2] flex justify-between items-center overflow-hidden'>
      <SideBar />
      <div className='w-full md:w-[calc(100%-280px)] h-full p-4 overflow-y-scroll bg-[#F8FFF2]'>
        <TopNavigation />
        {/* Main dashboard content goes here */}
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout;