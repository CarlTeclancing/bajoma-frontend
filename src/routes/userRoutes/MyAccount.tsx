import React from 'react'
import HomeLayout from '../../components/general/HomeLayout'
import axios from 'axios'
import useAuth from '../../hooks/auth'

const MyAccount = () => {
  const { logout, getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = React.useState('orders');
  const [orders, setOrders] = React.useState<any[]>([]);
  const [userInfo] = React.useState<any>(currentUser || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St, City, Country'
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    console.log('Fetching orders...');
    axios.get('http://localhost:5000/api/v1/orders')
      .then((res: any) => {
        console.log('Full response:', res.data);
        const data = Array.isArray(res.data.content) ? res.data.content : [];
        console.log('All orders from API:', data);
        console.log('Current user object:', currentUser);
        
        // Filter orders for the current user
        let myOrders = data;
        if (currentUser && currentUser.id) {
          myOrders = data.filter((order: any) => {
            console.log(`Comparing order.user_id (${order.user_id}) with currentUser.id (${currentUser.id})`);
            return order.user_id === currentUser.id;
          });
        }
        
        console.log('Filtered orders for current user:', myOrders);
        console.log('Number of orders:', myOrders.length);
        setOrders(myOrders);
        setLoading(false);
      })
      .catch((error: any) => {
        console.error('Error fetching orders:', error);
        setOrders([]);
        setLoading(false);
      });
  }, [currentUser]);

  return (
    <HomeLayout>
      <div className="container mx-auto px-4 py-24">
        <h1 className='text-4xl font-bold mb-8'>My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-20 h-20 bg-[#78C726] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                  {userInfo?.name?.charAt(0) || 'U'}
                </div>
                <h3 className='font-bold text-lg'>{userInfo?.name || 'User'}</h3>
                <p className='text-sm text-gray-600'>{userInfo?.email || 'user@example.com'}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                    activeTab === 'orders' ? 'bg-[#78C726] text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <i className='bi bi-box-seam'></i>
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                    activeTab === 'profile' ? 'bg-[#78C726] text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <i className='bi bi-person'></i>
                  Profile Info
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                    activeTab === 'settings' ? 'bg-[#78C726] text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <i className='bi bi-gear'></i>
                  Settings
                </button>
                <button
                  onClick={logout}
                  className='w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-red-50 text-red-600 transition'
                >
                  <i className='bi bi-box-arrow-right'></i>
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className='text-2xl font-bold mb-6'>My Orders</h2>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                    <p className='mt-4 text-gray-600'>Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <i className='bi bi-inbox text-6xl text-gray-300'></i>
                    <h3 className='text-xl font-bold mt-4 mb-2'>No orders yet</h3>
                    <p className='text-gray-600 mb-6'>Start shopping to see your orders here!</p>
                    <a 
                      href="/shop" 
                      className='inline-block bg-[#78C726] text-white rounded-lg px-6 py-3 hover:bg-[#6AB31E] transition'
                    >
                      Browse Products
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className='font-bold text-lg'>Order #{order.id}</h3>
                            <p className='text-sm text-gray-600'>
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between mb-2">
                            <span className='text-gray-600'>Product:</span>
                            <span className='font-semibold'>{order.product?.name || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className='text-gray-600'>Quantity:</span>
                            <span className='font-semibold'>{order.quantity}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className='text-gray-600'>Total:</span>
                            <span className='font-bold text-[#78C726]'>${order.total_price || '0.00'}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button className='flex-1 border border-[#78C726] text-[#78C726] rounded py-2 hover:bg-green-50 transition'>
                            View Details
                          </button>
                          <button className='flex-1 bg-[#78C726] text-white rounded py-2 hover:bg-[#6AB31E] transition'>
                            Track Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className='text-2xl font-bold mb-6'>Profile Information</h2>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className='block font-semibold mb-2'>Full Name</label>
                        <input 
                          type="text" 
                          defaultValue={userInfo?.name || ''}
                          className='w-full border border-gray-300 rounded-lg p-3'
                          placeholder='John Doe'
                        />
                      </div>
                      <div>
                        <label className='block font-semibold mb-2'>Email Address</label>
                        <input 
                          type="email" 
                          defaultValue={userInfo?.email || ''}
                          className='w-full border border-gray-300 rounded-lg p-3'
                          placeholder='john@example.com'
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className='block font-semibold mb-2'>Phone Number</label>
                        <input 
                          type="tel" 
                          defaultValue={userInfo?.phone || ''}
                          className='w-full border border-gray-300 rounded-lg p-3'
                          placeholder='+1234567890'
                        />
                      </div>
                      <div>
                        <label className='block font-semibold mb-2'>Date of Birth</label>
                        <input 
                          type="date" 
                          className='w-full border border-gray-300 rounded-lg p-3'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block font-semibold mb-2'>Address</label>
                      <textarea 
                        defaultValue={userInfo?.address || ''}
                        className='w-full border border-gray-300 rounded-lg p-3'
                        rows={3}
                        placeholder='Street address, City, Country'
                      />
                    </div>

                    <div className="flex gap-4">
                      <button 
                        type="submit"
                        className='bg-[#78C726] text-white rounded-lg px-6 py-3 font-semibold hover:bg-[#6AB31E] transition'
                      >
                        Save Changes
                      </button>
                      <button 
                        type="button"
                        className='border border-gray-300 rounded-lg px-6 py-3 font-semibold hover:bg-gray-50 transition'
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className='text-2xl font-bold mb-6'>Account Settings</h2>
                
                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className='font-bold text-lg mb-4'>Change Password</h3>
                    <form className="space-y-4">
                      <div>
                        <label className='block font-semibold mb-2'>Current Password</label>
                        <input 
                          type="password" 
                          className='w-full border border-gray-300 rounded-lg p-3'
                          placeholder='Enter current password'
                        />
                      </div>
                      <div>
                        <label className='block font-semibold mb-2'>New Password</label>
                        <input 
                          type="password" 
                          className='w-full border border-gray-300 rounded-lg p-3'
                          placeholder='Enter new password'
                        />
                      </div>
                      <div>
                        <label className='block font-semibold mb-2'>Confirm New Password</label>
                        <input 
                          type="password" 
                          className='w-full border border-gray-300 rounded-lg p-3'
                          placeholder='Confirm new password'
                        />
                      </div>
                      <button 
                        type="submit"
                        className='bg-[#78C726] text-white rounded-lg px-6 py-3 font-semibold hover:bg-[#6AB31E] transition'
                      >
                        Update Password
                      </button>
                    </form>
                  </div>

                  {/* Notification Preferences */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className='font-bold text-lg mb-4'>Notification Preferences</h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className='w-5 h-5 text-[#78C726]' defaultChecked />
                        <span>Email notifications for order updates</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className='w-5 h-5 text-[#78C726]' defaultChecked />
                        <span>Promotional emails and offers</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className='w-5 h-5 text-[#78C726]' />
                        <span>SMS notifications</span>
                      </label>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="bg-white border border-red-200 rounded-lg p-6">
                    <h3 className='font-bold text-lg mb-2 text-red-600'>Danger Zone</h3>
                    <p className='text-gray-600 mb-4'>Once you delete your account, there is no going back. Please be certain.</p>
                    <button className='bg-red-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-red-700 transition'>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </HomeLayout>
  )
}

export default MyAccount
