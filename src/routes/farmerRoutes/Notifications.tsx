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

interface Product {
  id: number;
  name: string;
  quantity: number;
  status: string;
  createdAt: string;
  price: string;
}

interface Notification {
  id: string;
  type: 'new_order' | 'new_product' | 'low_stock' | 'out_of_stock' | 'confirmed' | 'delivered' | 'cancelled';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  relatedId: number;
}

const FarmerNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

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
      const allNotifications: Notification[] = [];
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Fetch orders for farmer's products
      const ordersResponse = await axios.get(`${BACKEND_URL}/orders`);
      const allOrders = Array.isArray(ordersResponse.data.content) ? ordersResponse.data.content : [];
      
      const farmerOrders = allOrders.filter((order: Order) => 
        order.Product && order.Product.user_id === currentUser?.id
      );
      
      setOrders(farmerOrders);
      
      // Fetch farmer's products
      const productsResponse = await axios.get(`${BACKEND_URL}/product`);
      const allProducts = Array.isArray(productsResponse.data.content) ? productsResponse.data.content : [];
      const farmerProducts = allProducts.filter((p: Product) => p.user_id === currentUser?.id);
      setProducts(farmerProducts);

      // 1. ORDER NOTIFICATIONS (last 7 days)
      const orderNotifications = farmerOrders
        .filter((order: Order) => new Date(order.createdAt) > sevenDaysAgo)
        .map((order: Order) => ({
          id: `order-${order.id}`,
          type: getOrderNotificationType(order.status),
          title: getNotificationTitle(order.status),
          message: `${order.User?.name || 'A customer'} ordered ${order.quantity}x ${order.Product?.name} for $${order.total_price}`,
          time: formatTimeDifference(order.createdAt),
          read: order.status !== 'pending',
          priority: (order.status === 'pending' ? 'high' : 'medium') as 'high' | 'medium' | 'low',
          relatedId: order.id
        }));

      allNotifications.push(...orderNotifications);

      // 2. NEW PRODUCT NOTIFICATIONS (last 7 days)
      const newProductNotifications = farmerProducts
        .filter((product: Product) => new Date(product.createdAt) > sevenDaysAgo)
        .map((product: Product) => ({
          id: `product-new-${product.id}`,
          type: 'new_product' as const,
          title: '✨ Product Added Successfully',
          message: `${product.name} has been added to your catalog at $${product.price}. Initial stock: ${product.quantity} units`,
          time: formatTimeDifference(product.createdAt),
          read: true,
          priority: 'low' as const,
          relatedId: product.id
        }));

      allNotifications.push(...newProductNotifications);

      // 3. LOW STOCK WARNINGS (quantity < 5)
      const lowStockNotifications = farmerProducts
        .filter((product: Product) => product.quantity > 0 && product.quantity < 5)
        .map((product: Product) => ({
          id: `product-low-${product.id}`,
          type: 'low_stock' as const,
          title: '⚠️ Low Stock Alert',
          message: `${product.name} is running low on stock. Only ${product.quantity} unit${product.quantity !== 1 ? 's' : ''} remaining. Consider restocking soon.`,
          time: 'Current status',
          read: false,
          priority: 'medium' as const,
          relatedId: product.id
        }));

      allNotifications.push(...lowStockNotifications);

      // 4. OUT OF STOCK ALERTS (quantity = 0)
      const outOfStockNotifications = farmerProducts
        .filter((product: Product) => product.quantity === 0)
        .map((product: Product) => ({
          id: `product-out-${product.id}`,
          type: 'out_of_stock' as const,
          title: '🚫 Out of Stock',
          message: `${product.name} is out of stock and status has been changed to INACTIF. Please restock to continue selling.`,
          time: 'Urgent',
          read: false,
          priority: 'high' as const,
          relatedId: product.id
        }));

      allNotifications.push(...outOfStockNotifications);

      // Sort by priority (high -> medium -> low) then by time
      const sortedNotifications = allNotifications.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return 0; // Maintain order for same priority
      });
      
      setNotifications(sortedNotifications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const getOrderNotificationType = (status: string): any => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'new_order';
      case 'confirmed': return 'confirmed';
      case 'delivered': return 'delivered';
      case 'cancelled': return 'cancelled';
      default: return 'new_order';
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
      case 'new_product': return 'bi-plus-circle-fill text-[#78C726]';
      case 'low_stock': return 'bi-exclamation-triangle-fill text-orange-500';
      case 'out_of_stock': return 'bi-dash-circle-fill text-red-600';
      default: return 'bi-info-circle-fill text-gray-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingOrders = orders.filter(o => o.status?.toLowerCase() === 'pending');
  
  const filteredNotifications = filterType === 'all' 
    ? notifications 
    : notifications.filter(n => {
        if (filterType === 'orders') return ['new_order', 'confirmed', 'delivered', 'cancelled'].includes(n.type);
        if (filterType === 'products') return ['new_product', 'low_stock', 'out_of_stock'].includes(n.type);
        if (filterType === 'urgent') return n.priority === 'high';
        return true;
      });

  const urgentCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

  return (
    <FarmerDashboardLayout>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Notifications</h1>
          <p className='text-gray-600'>Stay updated with your orders & inventory • Auto-refreshes every 20s</p>
        </div>
        <div className='flex gap-3'>
          {urgentCount > 0 && (
            <span className='bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse'>
              🚨 {urgentCount} Urgent
            </span>
          )}
          {unreadCount > 0 && (
            <span className='bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
              {unreadCount} Unread
            </span>
          )}
          {pendingOrders.length > 0 && (
            <Link 
              to="/farmer/orders"
              className='bg-[#78C726] text-white px-4 py-2 rounded-lg hover:bg-[#6ab01e] flex items-center gap-2'
            >
              <i className='bi bi-box'></i>
              View {pendingOrders.length} Pending Order{pendingOrders.length !== 1 ? 's' : ''}
            </Link>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterType === 'all' 
              ? 'bg-[#78C726] text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('urgent')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterType === 'urgent' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Urgent ({urgentCount})
        </button>
        <button
          onClick={() => setFilterType('orders')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterType === 'orders' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Orders ({notifications.filter(n => ['new_order', 'confirmed', 'delivered', 'cancelled'].includes(n.type)).length})
        </button>
        <button
          onClick={() => setFilterType('products')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterType === 'products' 
              ? 'bg-[#78C726] text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Inventory ({notifications.filter(n => ['new_product', 'low_stock', 'out_of_stock'].includes(n.type)).length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
          <p className='ml-4'>Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <i className="bi bi-bell text-gray-300 text-6xl mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Notifications</h3>
          <p className="text-gray-500">
            {filterType === 'all' 
              ? "You'll be notified when customers order your products or inventory changes"
              : `No ${filterType} notifications at this time`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`bg-white rounded-lg shadow p-4 flex items-start gap-4 hover:shadow-md transition-shadow ${
                !notification.read ? 'border-l-4 border-amber-500' : ''
              } ${notification.priority === 'high' ? 'ring-2 ring-red-200' : ''}`}
            >
              <div className={`text-3xl`}>
                <i className={`bi ${getIconClass(notification.type)}`}></i>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{notification.title}</h3>
                    {notification.priority === 'high' && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                        URGENT
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{notification.time}</span>
                </div>
                <p className="text-gray-700 mb-3">{notification.message}</p>
                <div className="flex gap-2 items-center">
                  {['new_order', 'confirmed', 'delivered', 'cancelled'].includes(notification.type) ? (
                    <>
                      <span className="text-sm text-gray-600">
                        Order #{notification.relatedId}
                      </span>
                      <Link 
                        to="/farmer/orders"
                        className="ml-auto text-[#78C726] hover:text-[#6ab01e] text-sm font-semibold flex items-center gap-1"
                      >
                        View Order <i className="bi bi-arrow-right"></i>
                      </Link>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-gray-600">
                        Product #{notification.relatedId}
                      </span>
                      <Link 
                        to="/farmer/products"
                        className="ml-auto text-[#78C726] hover:text-[#6ab01e] text-sm font-semibold flex items-center gap-1"
                      >
                        Manage Inventory <i className="bi bi-arrow-right"></i>
                      </Link>
                    </>
                  )}
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