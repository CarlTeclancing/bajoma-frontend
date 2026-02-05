import React from 'react'
import SideBar from '../dashboard/SideBar';
import TopNavigation from '../dashboard/TopNavigation';

interface DashboardLayoutProps{
    children: React.ReactNode;
    showQuickStatsToggle?: boolean;
    onToggleQuickStats?: () => void;
    quickStatsVisible?: boolean;
}
const DashboardLayout = ({children, showQuickStatsToggle, onToggleQuickStats, quickStatsVisible}: DashboardLayoutProps) => {
  return (
    <div className='w-full h-[100vh] bg-[#F8FFF2] flex justify-between items-center overflow-hidden'>
      <SideBar />
      <div className='w-full md:w-[calc(100%-280px)] h-full p-4 overflow-y-scroll bg-[#F8FFF2]'>
        <TopNavigation 
          showQuickStatsToggle={showQuickStatsToggle}
          onToggleQuickStats={onToggleQuickStats}
          quickStatsVisible={quickStatsVisible}
        />
        {/* Main dashboard content goes here */}
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout;