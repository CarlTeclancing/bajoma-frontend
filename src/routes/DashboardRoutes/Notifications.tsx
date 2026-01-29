import DashboardLayout from '../../components/general/DashboardLayout'
import axios from 'axios';
import { BACKEND_URL } from '../../global';

interface Notification {
  id: string;
  type: 'new_product' | 'new_user' | 'new_order';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon: string;
  color: string;
  relatedId?: number;
}

const Notifications = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<'all' | 'new_product' | 'new_user' | 'new_order'>('all');

  React.useEffect(() => {
    fetchNotifications();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/product`),
        axios.get(`${BACKEND_URL}/users`),
        axios.get(`${BACKEND_URL}/orders`)
      ]);

      const products = Array.isArray(productsRes.data.content) ? productsRes.data.content : [];
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const orders = Array.isArray(ordersRes.data.content) ? ordersRes.data.content : [];

      const notificationsList: Notification[] = [];

      // Get products from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // New Products Notifications
      products
        .filter((p: any) => new Date(p.createdAt) > sevenDaysAgo)
        .forEach((product: any) => {
          notificationsList.push({
            id: `product-${product.id}`,
            type: 'new_product',
            title: 'New Product Added',
            message: `${product.User?.name || 'A farmer'} added "${product.name}" to the marketplace`,
            timestamp: new Date(product.createdAt),
            read: false,
            icon: 'bi-box-seam',
            color: 'bg-blue-100 text-blue-600',
            relatedId: product.id
          });
        });

      // New Users Notifications
      users
        .filter((u: any) => new Date(u.createdAt) > sevenDaysAgo)
        .forEach((user: any) => {
          notificationsList.push({
            id: `user-${user.id}`,
            type: 'new_user',
            title: 'New User Registered',
            message: `${user.name} (${user.account_type || 'User'}) joined the platform`,
            timestamp: new Date(user.createdAt),
            read: false,
            icon: 'bi-person-plus',
            color: 'bg-green-100 text-green-600',
            relatedId: user.id
          });
        });

      // New Orders Notifications
      orders
        .filter((o: any) => new Date(o.createdAt) > sevenDaysAgo)
        .forEach((order: any) => {
          notificationsList.push({
            id: `order-${order.id}`,
            type: 'new_order',
            title: 'New Order Placed',
            message: `${order.User?.name || 'A customer'} ordered ${order.Product?.name || 'a product'} - $${order.total_price}`,
            timestamp: new Date(order.createdAt),
            read: false,
            icon: 'bi-cart-check',
            color: 'bg-purple-100 text-purple-600',
            relatedId: order.id
          });
        });

      // Sort by timestamp (newest first)
      notificationsList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setNotifications(notificationsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const formatTimeDifference = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const stats = {
    total: notifications.length,
    products: notifications.filter(n => n.type === 'new_product').length,
    users: notifications.filter(n => n.type === 'new_user').length,
    orders: notifications.filter(n => n.type === 'new_order').length
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
          <p className='ml-4'>Loading notifications...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className='text-2xl font-bold'>Notifications</h1>
          <p className='text-gray-600'>Stay updated with platform activities</p>
        </div>
        <button 
          onClick={fetchNotifications}
          className='bg-[#78C726] text-white rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-[#6ab31f]'
        >
          <i className='bi bi-arrow-clockwise'></i>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <button
          onClick={() => setFilter('all')}
          className={`bg-white rounded-lg p-4 border-2 transition-all ${
            filter === 'all' ? 'border-[#78C726]' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className='text-sm text-gray-600'>Total</p>
              <h3 className='text-2xl font-bold text-gray-800'>{stats.total}</h3>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <i className='bi bi-bell text-2xl text-gray-600'></i>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('new_product')}
          className={`bg-white rounded-lg p-4 border-2 transition-all ${
            filter === 'new_product' ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className='text-sm text-gray-600'>Products</p>
              <h3 className='text-2xl font-bold text-blue-600'>{stats.products}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className='bi bi-box-seam text-2xl text-blue-600'></i>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('new_user')}
          className={`bg-white rounded-lg p-4 border-2 transition-all ${
            filter === 'new_user' ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className='text-sm text-gray-600'>Users</p>
              <h3 className='text-2xl font-bold text-green-600'>{stats.users}</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className='bi bi-person-plus text-2xl text-green-600'></i>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('new_order')}
          className={`bg-white rounded-lg p-4 border-2 transition-all ${
            filter === 'new_order' ? 'border-purple-500' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className='text-sm text-gray-600'>Orders</p>
              <h3 className='text-2xl font-bold text-purple-600'>{stats.orders}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className='bi bi-cart-check text-2xl text-purple-600'></i>
            </div>
          </div>
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border-2 border-gray-200">
        <div className="p-4 border-b-2 border-gray-200">
          <h2 className='text-lg font-bold'>
            {filter === 'all' ? 'All Notifications' : 
             filter === 'new_product' ? 'Product Notifications' :
             filter === 'new_user' ? 'User Notifications' : 'Order Notifications'}
          </h2>
          <p className='text-sm text-gray-500'>Last 7 days</p>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <i className='bi bi-bell-slash text-6xl text-gray-300'></i>
            <p className="text-gray-500 text-lg mt-4">No notifications</p>
            <p className="text-gray-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${notification.color}`}>
                    <i className={`bi ${notification.icon} text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className='font-semibold text-gray-800'>{notification.title}</h3>
                        <p className='text-sm text-gray-600 mt-1'>{notification.message}</p>
                        <p className='text-xs text-gray-400 mt-2'>{formatTimeDifference(notification.timestamp)}</p>
                      </div>
                      {!notification.read && (
                        <span className='w-2 h-2 bg-[#78C726] rounded-full flex-shrink-0 mt-2'></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Notifications