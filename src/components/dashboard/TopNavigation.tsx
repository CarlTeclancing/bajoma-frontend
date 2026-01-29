import React from 'react'
import { Images } from '../../constants/ImgImports'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../global';
import { useAuth } from '../../hooks/auth';

const TopNavigation = () => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [change, setChange] = React.useState(0);
    const [pendingOrdersCount, setPendingOrdersCount] = React.useState(0);
    const [adminNotificationCount, setAdminNotificationCount] = React.useState(0);
    const { currentUser } = useAuth();
    const location = window.location.pathname;
    const isFarmerDashboard = location.startsWith('/farmer');

    // Fetch pending orders count for farmers
    React.useEffect(() => {
        if (isFarmerDashboard && currentUser) {
            fetchPendingOrders();
            
            // Refresh every 30 seconds
            const interval = setInterval(fetchPendingOrders, 30000);
            return () => clearInterval(interval);
        }
    }, [isFarmerDashboard, currentUser]);

    // Fetch admin notifications count
    React.useEffect(() => {
        if (!isFarmerDashboard) {
            fetchAdminNotifications();
            
            // Refresh every 30 seconds
            const interval = setInterval(fetchAdminNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [isFarmerDashboard]);

    const fetchPendingOrders = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/orders`);
            const allOrders = Array.isArray(response.data.content) ? response.data.content : [];
            
            // Filter pending orders for farmer's products
            const farmerPendingOrders = allOrders.filter((order: any) => 
                order.Product && 
                order.Product.user_id === currentUser?.id &&
                order.status?.toLowerCase() === 'pending'
            );
            
            setPendingOrdersCount(farmerPendingOrders.length);
        } catch (error) {
            console.error('Error fetching pending orders:', error);
        }
    };

    const fetchAdminNotifications = async () => {
        try {
            // Get notifications from last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const [productsRes, usersRes, ordersRes] = await Promise.all([
                axios.get(`${BACKEND_URL}/product`),
                axios.get(`${BACKEND_URL}/users`),
                axios.get(`${BACKEND_URL}/orders`)
            ]);

            const products = Array.isArray(productsRes.data.content) ? productsRes.data.content : [];
            const users = Array.isArray(usersRes.data) ? usersRes.data : [];
            const orders = Array.isArray(ordersRes.data.content) ? ordersRes.data.content : [];

            const newProducts = products.filter((p: any) => new Date(p.createdAt) > sevenDaysAgo).length;
            const newUsers = users.filter((u: any) => new Date(u.createdAt) > sevenDaysAgo).length;
            const newOrders = orders.filter((o: any) => new Date(o.createdAt) > sevenDaysAgo).length;

            setAdminNotificationCount(newProducts + newUsers + newOrders);
        } catch (error) {
            console.error('Error fetching admin notifications:', error);
        }
    };
  return (

    <>
    
        <div className="hidden md:flex justify-between items-center mb-4 border-b-2 border-gray-300 pb-2">
            <h1 className='text-2 font-bold'>
                {isFarmerDashboard ? 'Welcome to BAJOMA Farmers Dashboard' : 'Welcome to BAJOMA Admin Dashboard'}
            </h1>
            <div className='flex items-center'>
              <Link to={isFarmerDashboard ? '/farmer/notifications' : '/dashboard/notifications'} className='relative'>
                <button className='border border-[#90C955] rounded relative'>
                  <i className='bi bi-bell text-2xl text-[#90C955] m-2'></i>
                  {isFarmerDashboard && pendingOrdersCount > 0 && (
                    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse'>
                      {pendingOrdersCount}
                    </span>
                  )}
                  {!isFarmerDashboard && adminNotificationCount > 0 && (
                    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse'>
                      {adminNotificationCount}
                    </span>
                  )}
                </button>
              </Link>
                <img src={Images.profileimg} alt="profile" className='w-10 h-10 rounded-full ml-4'/>
                <div className='flex flex-col ml-2'>
                    <span className='font-semibold'>{currentUser?.name || 'User'}</span>
                    <span className='text-xs text-gray-500'>{currentUser?.email || ''}</span>
                    <span className='text-xs text-gray-400'>{currentUser?.phone || ''} • {currentUser?.account_type || ''}</span>
                </div>
            </div>
            
        </div>
        {/* mobile menu bar */}
        <nav className='flex w-full justify-between items-center mobile-navigation'>
          
              <button className='bg-none outline-2 text-[#78C726] outline-[#78C726] rounded m-4 h-11 p-4 flex justify-center items-center w-auto'
              onClick={() => setMenuOpen(prev => !prev)}
              >
                <i className={menuOpen?"bi bi-x text-4xl":"bi bi-list text-4xl"}></i>
              </button>
          
            <div className='flex items-center'>
              <Link to={isFarmerDashboard ? '/farmer/notifications' : '/dashboard/notifications'} className='relative'>
                <button className='border border-[#90C955] rounded relative'>
                  <i className='bi bi-bell text-2xl text-[#90C955] m-2'></i>
                  {isFarmerDashboard && pendingOrdersCount > 0 && (
                    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse'>
                      {pendingOrdersCount}
                    </span>
                  )}
                  {!isFarmerDashboard && adminNotificationCount > 0 && (
                    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse'>
                      {adminNotificationCount}
                    </span>
                  )}
                </button>
              </Link>
                <img src={Images.profileimg} alt="profile" className='w-10 h-10 rounded-full ml-4'/>
                <div className='flex flex-col ml-2'>
                    <span className='font-semibold text-sm'>{currentUser?.name || 'User'}</span>
                    <span className='text-xs text-gray-500'>{currentUser?.account_type || ''}</span>
                </div>
            </div>
        </nav>

        {/* Mobile Dashboard sidebar menu */}
        <div className={menuOpen?'flex md:hidden w-full h-[100vh] p-2 flex-col overflow-y-scroll bg-white border-r-1 border-gray-300 fixed l-0 t-0 z-10':'hidden'}>

        <div className="flex flex-col mt-4">
            <Link 
              to={''} 
              onClick={()=> setChange(0)}
              className={change==0?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-speedometer2"></i><span>Dashboard</span>
                </div>
                <i className="bi bi-chevron-right "></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(1)}
              className={change==1?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-box-seam"></i><span>Products</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(2)}
              className={change==2?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-grid-3x3-gap-fill"></i><span>Categories</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(3)}
              className={change==3?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-people-fill"></i><span>USers</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(4)}
              className={change==4?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-cart-fill"></i><span>Orders</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(5)}
              className={change==5?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-chat-dots-fill"></i><span>Messages</span>
                </div>
              <i className="bi bi-chevron-right"></i>
            </Link>
                
            <Link 
              to={''} 
              onClick={()=> setChange(6)}
              className={change==6?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-gear-fill"></i><span>Settings</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(7)}
              className={change==7?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-headset"></i><span>Support Center</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(8)}
              className={change==8?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-gear-fill"></i><span>Settings</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>

            <Link 
              to={''} 
              onClick={()=> setChange(9)}
              className={change==9?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-box-arrow-right"></i><span>Logout</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
        </div>
    </div>

    </>
  )
}

export default TopNavigation