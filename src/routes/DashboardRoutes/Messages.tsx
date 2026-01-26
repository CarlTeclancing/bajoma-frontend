import React from 'react'
import DashboardLayout from '../../components/general/DashboardLayout'

const Messages = () => {
  return (
    <DashboardLayout>
      <h1 className='font-bold text-2xl'>Messages</h1>
      <p>View and manage your messages</p>
      
      <div className="mt-8">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <i className='bi bi-chat-dots text-6xl text-gray-300'></i>
          <h3 className='text-xl font-bold mt-4 mb-2'>No messages yet</h3>
          <p className='text-gray-600'>Messages from users will appear here</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Messages
