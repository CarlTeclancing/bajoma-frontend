import { useState, useEffect } from 'react'
import { Images } from '../../constants/ImgImports'
import FarmerDashboardLayout from '../../components/general/FarmerDashboardLayout'
import { useAuth } from '../../hooks/auth';
import axios from 'axios';
import { BACKEND_URL } from '../../global';
import { authStorage } from '../../config/storage.config';

const FarmerSettings = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [profileImage, setProfileImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
      });
      // Construct full URL if profileimg exists and is a relative path
      const imageUrl = currentUser.profileimg 
          ? (currentUser.profileimg.startsWith('http') 
              ? currentUser.profileimg 
              : `http://localhost:5000${currentUser.profileimg}`)
          : '';
      setProfileImage(imageUrl);
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      alert('Please select an image first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('profileImage', imageFile);

    try {
      const response = await axios.post(`${BACKEND_URL}/user/upload-profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Construct full URL for the uploaded image
      const imageUrl = response.data.profileimg.startsWith('http') 
          ? response.data.profileimg 
          : `http://localhost:5000${response.data.profileimg}`;
      
      setProfileImage(imageUrl);
      setImagePreview('');
      setImageFile(null);
      
      // Update user in localStorage
      const updatedUser = response.data.user;
      authStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('Profile image updated successfully!');
      window.location.reload(); // Reload to show new image
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(`${BACKEND_URL}/user/profile`, {
        name: formData.name,
        phone: formData.phone,
      });

      // Update user in localStorage
      const updatedUser = response.data.user;
      authStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <FarmerDashboardLayout>
        <h1 className='text-2xl font-bold'>Settings</h1>
        <p className='text-gray-600'>Manage your account and preferences</p>

        {/* Account & Profile Section */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 mt-6 overflow-hidden">
            <div className="p-4 bg-[#E6F2D9] border-b-2 border-gray-200">
                <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                    <i className='bi bi-person'></i> 
                    Account & Profile
                </h2>
                <p className='text-sm text-gray-600'>Manage your personal information and preferences</p>
            </div>
            
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center gap-3">
                        <img 
                            src={imagePreview || profileImage || Images.profileimg} 
                            className='w-32 h-32 rounded-full object-cover border-4 border-[#E6F2D9]' 
                            alt="profile image" 
                        />
                        <div className="flex flex-col gap-2 w-full">
                            <label htmlFor="farmer-profile-image-input" className='bg-[#78C726] text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#6ab31f] transition-all text-center'>
                                <i className='bi bi-camera mr-2'></i>
                                Choose Photo
                            </label>
                            <input 
                                id="farmer-profile-image-input"
                                type="file" 
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            {imageFile && (
                                <button
                                    onClick={handleImageUpload}
                                    disabled={uploading}
                                    className='bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all disabled:bg-gray-400'
                                >
                                    {uploading ? (
                                        <>
                                            <i className='bi bi-hourglass-split animate-spin mr-2'></i>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <i className='bi bi-upload mr-2'></i>
                                            Upload
                                        </>
                                    )}
                                </button>
                            )}
                            {imageFile && !uploading && (
                                <button
                                    onClick={() => {
                                        setImageFile(null);
                                        setImagePreview('');
                                    }}
                                    className='bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-all'
                                >
                                    <i className='bi bi-x-circle mr-2'></i>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex flex-col flex-1">
                        <h2 className='text-2xl font-bold text-gray-800'>{currentUser?.name || 'User'}</h2>
                        <span className='bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold mt-2 inline-block w-fit'>
                            {currentUser?.account_type || 'User'}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className='block text-sm font-semibold text-gray-700 mb-2'>Full Name</label>
                            <input 
                              type="text" 
                              name='name' 
                              value={formData.name}
                              onChange={handleChange}
                              className='w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#90C955] focus:outline-none' 
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className='block text-sm font-semibold text-gray-700 mb-2'>Email</label>
                            <input 
                              type="email" 
                              name='email' 
                              value={formData.email}
                              className='w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed' 
                              disabled
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="phone" className='block text-sm font-semibold text-gray-700 mb-2'>Phone Number</label>
                            <input 
                              type="tel" 
                              name='phone' 
                              value={formData.phone}
                              onChange={handleChange}
                              className='w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#90C955] focus:outline-none' 
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className='block text-sm font-semibold text-gray-700 mb-2'>Role</label>
                            <input 
                              type="text" 
                              name='role' 
                              value={currentUser?.account_type || ''}
                              className='w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed' 
                              disabled
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="language" className='block text-sm font-semibold text-gray-700 mb-2'>Language</label>
                            <input type="text" name='language' defaultValue="English" className='w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#90C955] focus:outline-none' />
                        </div>
                        <div>
                            <label htmlFor="timezone" className='block text-sm font-semibold text-gray-700 mb-2'>Time Zone</label>
                            <input type="text" name='timezone' defaultValue="UTC" className='w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#90C955] focus:outline-none' />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-end pt-4">
                        <button type="button" className='border-2 border-[#78C726] text-[#78C726] px-6 py-3 rounded-xl hover:bg-[#E6F2D9] transition-all font-semibold'>
                            <i className='bi bi-key mr-2'></i>
                            Change Password
                        </button>
                        <button type="submit" className='bg-[#78C726] text-white px-6 py-3 rounded-xl hover:bg-[#6ab31f] transition-all font-semibold'>
                            <i className='bi bi-check-circle mr-2'></i>
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 mt-6 overflow-hidden">
            <div className="p-4 bg-[#E6F2D9] border-b-2 border-gray-200">
                <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                    <i className='bi bi-bell'></i> 
                    Notification Preferences
                </h2>
                <p className='text-sm text-gray-600'>Choose which events trigger notifications</p>
            </div>
            
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#E6F2D9] rounded-xl hover:bg-[#d4e8c1] transition-all">
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-[#78C726] rounded-lg flex items-center justify-center'>
                            <i className='bi bi-box text-white'></i>
                        </div>
                        <div>
                            <h3 className='font-bold text-gray-800'>New Product Submitted</h3>
                            <p className='text-xs text-gray-600'>Get notified when farmers submit new products</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#78C726]"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#E6F2D9] rounded-xl hover:bg-[#d4e8c1] transition-all">
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-[#78C726] rounded-lg flex items-center justify-center'>
                            <i className='bi bi-basket text-white'></i>
                        </div>
                        <div>
                            <h3 className='font-bold text-gray-800'>New Order Received</h3>
                            <p className='text-xs text-gray-600'>Get notified when buyers place new orders</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#78C726]"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#E6F2D9] rounded-xl hover:bg-[#d4e8c1] transition-all">
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center'>
                            <i className='bi bi-x-circle text-white'></i>
                        </div>
                        <div>
                            <h3 className='font-bold text-gray-800'>Order Cancelled</h3>
                            <p className='text-xs text-gray-600'>Get notified when orders are cancelled</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#78C726]"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#E6F2D9] rounded-xl hover:bg-[#d4e8c1] transition-all">
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center'>
                            <i className='bi bi-chat-dots text-white'></i>
                        </div>
                        <div>
                            <h3 className='font-bold text-gray-800'>Support Message Received</h3>
                            <p className='text-xs text-gray-600'>Get notified when users send support messages</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#78C726]"></div>
                    </label>
                </div>
            </div>
        </div>

        {/* Order Management Settings */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 mt-6 overflow-hidden">
            <div className="p-4 bg-[#E6F2D9] border-b-2 border-gray-200">
                <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                    <i className='bi bi-box'></i> 
                    Order Management Settings
                </h2>
                <p className='text-sm text-gray-600'>Configure order processing preferences</p>
            </div>
            
            <div className="p-6 space-y-4">
                <div className="p-4 bg-[#E6F2D9] rounded-xl">
                    <h3 className='font-bold text-gray-800 mb-3'>
                        <i className='bi bi-arrow-repeat mr-2'></i>
                        Default Status Flow
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-4 py-2 bg-amber-500 rounded-full text-white font-semibold">Pending</span>
                        <i className='bi bi-arrow-right text-gray-400'></i>
                        <span className="px-4 py-2 bg-blue-500 rounded-full text-white font-semibold">Accepted</span>
                        <i className='bi bi-arrow-right text-gray-400'></i>
                        <span className="px-4 py-2 bg-[#78C726] rounded-full text-white font-semibold">Delivered</span>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#E6F2D9] rounded-xl">
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-[#78C726] rounded-lg flex items-center justify-center'>
                            <i className='bi bi-bell text-white'></i>
                        </div>
                        <div>
                            <h3 className='font-bold text-gray-800'>Auto-Notify Farmer & Buyer</h3>
                            <p className='text-xs text-gray-600'>Automatically send notifications when order status changes</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#78C726]"></div>
                    </label>
                </div>

                <div className="flex justify-end pt-4">
                    <button className='bg-[#78C726] text-white px-6 py-3 rounded-xl hover:bg-[#6ab31f] transition-all font-semibold'>
                        <i className='bi bi-check-circle mr-2'></i>
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
        
    </FarmerDashboardLayout>
  )
}

export default FarmerSettings