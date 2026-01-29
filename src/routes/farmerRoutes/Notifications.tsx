import React, { useState, useEffect } from 'react';
import FarmerDashboardLayout from '../../components/general/FarmerDashboardLayout';
import axios from 'axios';
import { BACKEND_URL } from '../../global';
import { authStorage } from '../../config/storage.config';
import { Link } from 'react-router-dom';

interface Order {
  id: number;
  status: string;
  total_price: string;
  quantity: number;
  createdAt: string;
  User: {
    name: string;
    email: string;
    phone: string;
  };
  Product: {
    id: number;
    name: string;
    price: string;
    user_id: number;
  };
}

const FarmerNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const getCurrentUser = () => {
    const userStr = authStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchNotifications();
    
    // Auto-refresh every 20 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 20000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      // Fetch orders for farmer's products
      const response = await axios.get(`${BACKEND_URL}/orders`);
      const allOrders = Array.isArray(response.data.content) ? response.data.content : [];
      
      // Filter orders for this farmer's products
      const farmerOrders = allOrders.filter((order: Order) => 
        order.Product && order.Product.user_id === currentUser?.id
      );
      
      setOrders(farmerOrders);
      
      // Create notifications from recent orders (last 7 days)
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const recentNotifications = farmerOrders
        .filter((order: Order) => new Date(order.createdAt) > sevenDaysAgo)
        .map((order: Order) => ({
          id: order.id,
          type: getNotificationType(order.status),
          title: getNotificationTitle(order.status),
          message: `${order.User?.name || 'A customer'} ordered ${order.quantity}x ${order.Product?.name} for $${order.total_price}`,
          time: formatTimeDifference(order.createdAt),
          order: order,
          read: order.status !== 'pending' // Mark pending orders as unread
        }));
      
      setNotifications(recentNotifications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const getNotificationType = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'new_order';
      case 'confirmed': return 'confirmed';
      case 'delivered': return 'delivered';
      case 'cancelled': return 'cancelled';
      default: return 'info';
    }
  };

  const getNotificationTitle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '🔔 New Order Received!';
      case 'confirmed': return '✅ Order Confirmed';
      case 'delivered': return '📦 Order Delivered';
      case 'cancelled': return '❌ Order Cancelled';
      default: return 'Order Update';
    }
  };

  const formatTimeDifference = (dateString: string) => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getIconClass = (type: string) => {
    switch (type) {
      case 'new_order': return 'bi-bell-fill text-amber-500';
      case 'confirmed': return 'bi-check-circle-fill text-blue-500';
      case 'delivered': return 'bi-box-seam text-green-500';
      case 'cancelled': return 'bi-x-circle-fill text-red-500';
      default: return 'bi-info-circle-fill text-gray-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingOrders = orders.filter(o => o.status?.toLowerCase() === 'pending');

  return (
    <FarmerDashboardLayout>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Notifications</h1>
          <p className='text-gray-600'>Stay updated with your orders • Auto-refreshes every 20s</p>
        </div>
        <div className='flex gap-3'>
          {unreadCount > 0 && (
            <span className='bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
              {unreadCount} Unread
            </span>
          )}
          {pendingOrders.length > 0 && (
            <Link 
              to="/farmer/orders"
              className='bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-2'
            >
              <i className='bi bi-box'></i>
              View {pendingOrders.length} Pending Order{pendingOrders.length !== 1 ? 's' : ''}
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <i className="bi bi-bell text-gray-300 text-6xl mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Notifications Yet</h3>
          <p className="text-gray-500">You'll be notified when customers order your products</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`bg-white rounded-lg shadow p-4 flex items-start gap-4 hover:shadow-md transition-shadow ${
                !notification.read ? 'border-l-4 border-amber-500' : ''
              }`}
            >
              <div className={`text-3xl`}>
                <i className={`bi ${getIconClass(notification.type)}`}></i>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{notification.title}</h3>
                  <span className="text-sm text-gray-500">{notification.time}</span>
                </div>
                <p className="text-gray-700 mb-3">{notification.message}</p>
                <div className="flex gap-2 items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    notification.order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    notification.order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    notification.order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {notification.order.status?.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">
                    Order #{notification.order.id}
                  </span>
                  <Link 
                    to="/farmer/orders"
                    className="ml-auto text-[#90C955] hover:text-[#7ab043] text-sm font-semibold flex items-center gap-1"
                  >
                    View Details <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </FarmerDashboardLayout>
  );
};

export default FarmerNotifications;