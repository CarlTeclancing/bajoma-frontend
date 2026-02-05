import React from 'react'
import DashboardLayout from '../../components/general/DashboardLayout'
import axios from 'axios'
import useAuth from '../../hooks/auth'
import { BACKEND_URL } from '../../global'

const MyAccount = () => {
  const { logout, getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editMode, setEditMode] = React.useState(false);
  const [profileForm, setProfileForm] = React.useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || ''
  });

  React.useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/orders`);
      const data = Array.isArray(response.data.content) ? response.data.content : [];
      
      // Filter orders for the current user
      let myOrders = data;
      if (currentUser && currentUser.id) {
        myOrders = data.filter((order: any) => order.user_id === currentUser.id);
      }
      
      setOrders(myOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${BACKEND_URL}/users/${currentUser?.id}`, profileForm);
      alert('Profile updated successfully!');
      setEditMode(false);
      // Update localStorage
      const updatedUser = { ...currentUser, ...profileForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload(); // Refresh to show updated data
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status?.toLowerCase() === 'pending').length,
    completed: orders.filter(o => ['completed', 'delivered'].includes(o.status?.toLowerCase())).length,
    cancelled: orders.filter(o => o.status?.toLowerCase() === 'cancelled').length
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    const styles = {
      pending: 'bg-amber-100 text-amber-800',
      accepted: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return styles[statusLower as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mt-4">
        <div>
          <h1 className='text-2xl font-bold'>My Account</h1>
          <p className='text-gray-600'>Manage your profile and orders</p>
        </div>
        <button
          onClick={logout}
          className='bg-red-500 text-white rounded-xl px-6 py-2 hover:bg-red-600 transition-all font-semibold flex items-center gap-2'
        >
          <i className='bi bi-box-arrow-right'></i>
          Logout
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 mt-6">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
          <p className='ml-4 text-gray-600'>Loading account data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards - Matching Admin Dashboard */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                  <i className='bi bi-basket text-2xl text-[#78C726]'></i>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Total Orders</p>
                  <h2 className='text-2xl font-bold text-gray-800'>{orderStats.total}</h2>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-amber-300 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <i className='bi bi-clock text-2xl text-amber-600'></i>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Pending</p>
                  <h2 className='text-2xl font-bold text-gray-800'>{orderStats.pending}</h2>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-green-300 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className='bi bi-check-circle text-2xl text-green-600'></i>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Completed</p>
                  <h2 className='text-2xl font-bold text-gray-800'>{orderStats.completed}</h2>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-red-300 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <i className='bi bi-x-circle text-2xl text-red-600'></i>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Cancelled</p>
                  <h2 className='text-2xl font-bold text-gray-800'>{orderStats.cancelled}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout - Matching Admin Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Profile Information Card */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className='text-xl font-bold'>Profile Information</h2>
                {!editMode && (
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setProfileForm({
                        name: currentUser?.name || '',
                        email: currentUser?.email || '',
                        phone: currentUser?.phone || '',
                        address: currentUser?.address || ''
                      });
                    }}
                    className='text-[#78C726] hover:underline font-semibold text-sm flex items-center gap-1'
                  >
                    <i className='bi bi-pencil'></i>
                    Edit
                  </button>
                )}
              </div>

              {!editMode ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border-2 border-[#E6F2D9] rounded-lg hover:border-[#90C955] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                        <i className='bi bi-person text-xl text-[#78C726]'></i>
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-800'>Name</h3>
                        <p className='text-sm text-gray-500'>{currentUser?.name || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border-2 border-[#E6F2D9] rounded-lg hover:border-[#90C955] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                        <i className='bi bi-envelope text-xl text-[#78C726]'></i>
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-800'>Email</h3>
                        <p className='text-sm text-gray-500'>{currentUser?.email || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border-2 border-[#E6F2D9] rounded-lg hover:border-[#90C955] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                        <i className='bi bi-phone text-xl text-[#78C726]'></i>
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-800'>Phone</h3>
                        <p className='text-sm text-gray-500'>{currentUser?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border-2 border-[#E6F2D9] rounded-lg hover:border-[#90C955] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                        <i className='bi bi-geo-alt text-xl text-[#78C726]'></i>
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-800'>Address</h3>
                        <p className='text-sm text-gray-500'>{currentUser?.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className='block font-semibold mb-2 text-sm text-gray-700'>Name *</label>
                    <input 
                      type="text" 
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className='w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#78C726] focus:outline-none'
                      required
                    />
                  </div>
                  <div>
                    <label className='block font-semibold mb-2 text-sm text-gray-700'>Email *</label>
                    <input 
                      type="email" 
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      className='w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#78C726] focus:outline-none'
                      required
                    />
                  </div>
                  <div>
                    <label className='block font-semibold mb-2 text-sm text-gray-700'>Phone</label>
                    <input 
                      type="tel" 
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      className='w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#78C726] focus:outline-none'
                    />
                  </div>
                  <div>
                    <label className='block font-semibold mb-2 text-sm text-gray-700'>Address</label>
                    <input 
                      type="text" 
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                      className='w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#78C726] focus:outline-none'
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="submit"
                      className='flex-1 bg-[#78C726] text-white rounded-lg px-4 py-2 font-semibold hover:bg-[#6AB31E] transition'
                    >
                      Save Changes
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEditMode(false)}
                      className='flex-1 border-2 border-gray-300 rounded-lg px-4 py-2 font-semibold hover:bg-gray-50 transition'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Account Overview Card */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className='text-xl font-bold'>Account Overview</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                      <i className='bi bi-shield-check text-lg text-[#78C726]'></i>
                    </div>
                    <div>
                      <p className='font-semibold text-sm text-gray-800'>Account Type</p>
                      <p className='text-xs text-gray-500 capitalize'>{currentUser?.account_type || 'Member'}</p>
                    </div>
                  </div>
                  <span className='px-3 py-1 bg-[#E6F2D9] text-[#78C726] rounded-full text-xs font-semibold uppercase'>
                    {currentUser?.account_type || 'Member'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className='bi bi-calendar text-lg text-blue-600'></i>
                    </div>
                    <div>
                      <p className='font-semibold text-sm text-gray-800'>Member Since</p>
                      <p className='text-xs text-gray-500'>
                        {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className='bi bi-bag-check text-lg text-green-600'></i>
                    </div>
                    <div>
                      <p className='font-semibold text-sm text-gray-800'>Total Orders</p>
                      <p className='text-xs text-gray-500'>{orderStats.total} orders placed</p>
                    </div>
                  </div>
                  <p className='font-bold text-[#78C726]'>{orderStats.total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders - Full Width */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className='text-xl font-bold'>Recent Orders</h2>
              <a href="/shop" className='text-[#78C726] hover:underline font-semibold text-sm flex items-center gap-1'>
                <i className='bi bi-plus-circle'></i>
                Shop Now
              </a>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <i className='bi bi-inbox text-6xl text-gray-300'></i>
                <h3 className='text-xl font-bold mt-4 mb-2'>No orders yet</h3>
                <p className='text-gray-600 mb-6'>Start shopping to see your orders here!</p>
                <a 
                  href="/shop" 
                  className='inline-block bg-[#78C726] text-white rounded-xl px-6 py-3 hover:bg-[#6AB31E] transition font-semibold'
                >
                  Browse Products
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 border-2 border-[#E6F2D9] rounded-lg hover:border-[#90C955] transition-all">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                        <i className='bi bi-box text-xl text-[#78C726]'></i>
                      </div>
                      <div className="flex-1">
                        <h3 className='font-semibold text-gray-800'>Order #{order.id}</h3>
                        <p className='text-sm text-gray-500'>{order.Product?.name || 'Product'} × {order.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                        {order.status?.toUpperCase()}
                      </span>
                      <p className='font-bold text-[#78C726]'>${order.total_price || '0.00'}</p>
                      <i className='bi bi-chevron-right text-gray-400'></i>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default MyAccount
