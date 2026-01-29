import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/general/DashboardLayout'
import { Images } from '../../constants/ImgImports'
import { useAuth } from '../../hooks/auth';

const Settings = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update user settings
    console.log('Update settings:', formData);
    alert('Settings update functionality coming soon!');
  };

  return (
    <DashboardLayout>
        <h1 className='text-2xl font-bold'>Settings</h1>
        <p>Manage your account, system configurations, roles and general performance</p>
        <div className="flex w-full flex-col gap-4 mt-4 bg-[#E6F2D9] p-6 rounded-2xl">
            <div className="flex flex-col">
                <span className='text-2xl font-bold'><i className='bi bi-person'></i> Account & Profile</span>
                <p>Manage your personal information and preferences</p>
            </div>
            <div className="flex w-full mt-4 justify-items-start items-start">
                <img src={Images.profileimg} className='w-[200px]' alt="profile image" />
                <div className="flex flex-col w-full items-start ml-8">
                    <h2 className='text-2xl'>{currentUser?.name || 'User'}</h2>
                    <span className='bg-amber-300 rounded-4xl p-2 mt-4'>{currentUser?.account_type || 'User'}</span>
                </div>
            </div>
                <form onSubmit={handleSubmit} className="flex w-full flex-col">
                    <div className="flex w-full justify-between mt-4">
                        <div className='w-[48%]'>
                            <label htmlFor="name">Full Name</label>
                            <input 
                              type="text" 
                              name='name' 
                              value={formData.name}
                              onChange={handleChange}
                              className='w-full p-2 border border-gray rounded' 
                            />
                        </div>
                        <div className='w-[48%]'>
                            <label htmlFor="email">Email</label>
                            <input 
                              type="email" 
                              name='email' 
                              value={formData.email}
                              className='w-full p-2 border border-gray rounded bg-gray-100' 
                              disabled
                            />
                        </div>
                    </div>
                    <div className="flex w-full justify-between mt-4">
                        <div className='w-[48%]'>
                            <label htmlFor="phone">Phone Number</label>
                            <input 
                              type="tel" 
                              name='phone' 
                              value={formData.phone}
                              onChange={handleChange}
                              className='w-full p-2 border border-gray rounded' 
                            />
                        </div>
                        <div className='w-[48%]'>
                            <label htmlFor="role">Role</label>
                            <input 
                              type="text" 
                              name='role' 
                              value={currentUser?.account_type || ''}
                              className='w-full p-2 border border-gray rounded bg-gray-100' 
                              disabled
                            />
                        </div>
                    </div>
                    <div className="flex w-full justify-between mt-4">
                        <div className='w-[48%]'>
                            <label htmlFor="language">Language</label>
                            <input type="text" name='language' defaultValue="English" className='w-full p-2 border border-gray rounded' />
                        </div>
                        <div className='w-[48%]'>
                            <label htmlFor="timezone">Time Zone</label>
                            <input type="text" name='timezone' defaultValue="UTC" className='w-full p-2 border border-gray rounded' />
                        </div>
                    </div>
                    <div className="flex w-full justify-between mt-8">
                        <span className='border p-4 rounded border-green text-green-500 cursor-pointer'> Change Password</span>
                        <button type="submit" className='cursor-pointer p-4 rounded bg-green-500 text-white'>Update Profile</button>
                    </div>
                    
                </form>
        </div>

        <div className="flex w-full flex-col gap-4 mt-4 bg-[#E6F2D9] p-6  rounded-2xl">
            <h1 className='font-bold mt-4'><i className='bi bi-gear'></i> System Settings</h1>
            <p>Configure system-wide preferences and behaviors</p>
            <div className="flex w-full flex-col p-4 border border-gray rounded ">
                <div>
                    <h3 className='font-bold'> <i className='bi bi-check border rounded'></i> Require Admin Approval Before Products Go Live</h3>
                    <p className='text-[12px]'>New products must be reviewed and approved by an admin before appearing on the marketplace</p>
                </div>

            </div>
            <h3 className='font-bold mt-4'> <i className='bi bi-bell'></i>  Notification Preferences</h3>
            <p>Choose which events trigger notifications</p>
            <div className="flex w-full flex-col p-4 border border-gray rounded ">
                <div>
                    <h3 className='font-bold'> <i className='bi bi-check border rounded'></i> New Product Submitted</h3>
                    <p className='text-[12px]'>Get notified when farmers submit new products</p>
                </div>

            </div>
            <div className="flex w-full flex-col p-4 border border-gray rounded ">
                <div>
                    <h3 className='font-bold'> <i className='bi bi-check border rounded'></i> New Order Received</h3>
                    <p className='text-[12px]'>Get notified when buyers place new orders</p>
                </div>

            </div>
            <div className="flex w-full flex-col p-4 border border-gray rounded ">
                <div>
                    <h3 className='font-bold'> <i className='bi bi-check border rounded'></i> Order Cancelled</h3>
                    <p className='text-[12px]'>Get notified when orders are cancelled</p>
                </div>

            </div>
            <div className="flex w-full flex-col p-4 border border-gray rounded ">
                <div>
                    <h3 className='font-bold'> <i className='bi bi-check border rounded'></i> Support Message Received</h3>
                    <p className='text-[12px]'>Get notified when users send support messages</p>
                </div>

            </div>
            <h1 className='font-bold mt-4'><i className='bi bi-box'></i> Order Management Settings</h1>
            <p>Configure system-wide preferences and behaviors</p>
            <div className="flex w-full flex-col p-4 border border-gray rounded ">
                <div>
                    <h3 className='font-bold'> <i className='bi bi-check border rounded'></i> Default Status Flow</h3>
                    <div className="flex mt-4 items-center">
                        <span className="p-2 bg-[#FF9A00] m-1 rounded-2xl text-white">Pending</span>
                        <i className='bi bi-arrow-right'></i>
                        <span className="p-2 bg-[#FFE100] m-1 rounded-2xl text-white">Processing</span>
                        <i className='bi bi-arrow-right'></i>
                        <span className="p-2 bg-[#90C955] m-1 rounded-2xl text-white">Completed</span>
                    </div>
                </div>
            </div>
             <div className="flex w-full flex-col p-4 border border-gray rounded ">  
                <div>
                    <h3 className='font-bold'> <i className='bi bi-check border rounded'></i> Auto-Notify Farmer & Buyer</h3>
                    <p className='text-[12px]'>Automatically send notifications when order status changes</p>
                </div>
            </div>
            <div className="flex w-full justify-end">
                <button className='cursor-pointer p-4 rounded bg-green-500 text-white float-right'>Update Profile</button>

            </div>
            </div>
            <div className="flex w-full flex-col gap-4 mt-4 bg-[#E6F2D9] p-6  rounded-2xl">
                <h1 className='font-bold mt-4'><i className='bi bi-shield'></i> Access Control</h1>
                <p>Manage user roles, permissions, and access levels</p>
                <h1 className='font-bold mt-4'><i className='bi bi-person'></i> Manage Roles</h1>
                <div className="flex w-full flex-col p-4 border border-gray rounded ">  
                    <div>
                        <h3 className='font-bold'> <i className='bi bi-check border rounded'></i> Admin</h3>
                        <p className='text-[12px]'>Full system access and control</p>
                    </div>
                </div>
            </div>
        
    </DashboardLayout>
  )
}

export default Settings