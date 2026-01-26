import React from 'react'
import TopNavigation from '../dashboard/TopNavigation';
import SideBarFarmer from '../dashboard/SideBarFarmer';

interface DashboardLayoutProps{
    children: React.ReactNode;
}
const FarmerDashboardLayout = ({children}: DashboardLayoutProps) => {
  return (
    <div className='w-full h-[100vh] bg-[#F8FFF2] flex justify-between items-center overflow-hidden'>
      <SideBarFarmer />
      <div className='w-full md:w-[calc(100%-280px)] h-full p-4 overflow-y-scroll bg-[#F8FFF2]'>
        <TopNavigation />
        {/* Main dashboard content goes here */}
        {children}
      </div>
    </div>
  )
}

export default FarmerDashboardLayout;