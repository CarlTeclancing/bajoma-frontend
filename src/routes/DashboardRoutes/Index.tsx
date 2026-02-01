import React from 'react'
import DashboardLayout from '../../components/general/DashboardLayout';
import axios from 'axios';
import { BACKEND_URL } from '../../global';

const Dashboard = () => {
  const [stats, setStats] = React.useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeProducts: 0,
    categories: 0
  });
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [productsRes, ordersRes, usersRes, categoriesRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/product`),
        axios.get(`${BACKEND_URL}/orders`),
        axios.get(`${BACKEND_URL}/users`),
        axios.get(`${BACKEND_URL}/categories`)
      ]);

      const products = Array.isArray(productsRes.data.content) ? productsRes.data.content : [];
      const orders = Array.isArray(ordersRes.data.content) ? ordersRes.data.content : [];
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const categories = Array.isArray(categoriesRes.data.content) ? categoriesRes.data.content : [];

      const totalRevenue = orders.reduce((sum: any, order: any) => sum + (parseFloat(order.amount) || 0), 0);
      const pendingOrders = orders.filter((order: any) => order.status === 'PENDING').length;
      const activeProducts = products.filter((product: any) => product.status === 'ACTIF').length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders,
        activeProducts: activeProducts,
        categories: categories.length
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className='text-2xl font-bold mt-4'>Admin Dashboard</h1>
      <p>Overview of your BAJOMA platform</p>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
          <p className='ml-4'>Loading dashboard...</p>
        </div>
      ) : (
      <>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6'>
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
              <i className='bi bi-box text-2xl text-[#78C726]'></i>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Total Products</p>
              <h2 className='text-2xl font-bold text-gray-800'>{stats.totalProducts}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
              <i className='bi bi-basket text-2xl text-[#78C726]'></i>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Total Orders</p>
              <h2 className='text-2xl font-bold text-gray-800'>{stats.totalOrders}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
              <i className='bi bi-person text-2xl text-[#78C726]'></i>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Total Users</p>
              <h2 className='text-2xl font-bold text-gray-800'>{stats.totalUsers}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className='bi bi-clock text-2xl text-amber-600'></i>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Pending Orders</p>
              <h2 className='text-2xl font-bold text-gray-800'>{stats.pendingOrders}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
              <i className='bi bi-cash-stack text-2xl text-[#78C726]'></i>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Revenue</p>
              <h2 className='text-2xl font-bold text-[#78C726]'>${stats.totalRevenue.toFixed(2)}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <h2 className='text-xl font-bold mb-4'>Quick Actions</h2>

          <div className="flex items-center justify-between p-4 border-2 border-[#E6F2D9] rounded-lg mb-3 hover:border-[#90C955] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <i className='bi bi-basket text-xl text-amber-600'></i>
              </div>
              <div>
                <h3 className='font-semibold text-gray-800'>Manage Orders</h3>
                <p className='text-sm text-gray-500'>{stats.pendingOrders} Pending orders to process</p>
              </div>
            </div>
            <i className='bi bi-chevron-right text-gray-400'></i>
          </div>

          <div className="flex items-center justify-between p-4 border-2 border-[#E6F2D9] rounded-lg mb-3 hover:border-[#90C955] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                <i className='bi bi-box text-xl text-[#78C726]'></i>
              </div>
              <div>
                <h3 className='font-semibold text-gray-800'>Manage Products</h3>
                <p className='text-sm text-gray-500'>{stats.totalProducts} Active products</p>
              </div>
            </div>
            <i className='bi bi-chevron-right text-gray-400'></i>
          </div>

          <div className="flex items-center justify-between p-4 border-2 border-[#E6F2D9] rounded-lg hover:border-[#90C955] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className='bi bi-chat text-xl text-blue-600'></i>
              </div>
              <div>
                <h3 className='font-semibold text-gray-800'>View Messages</h3>
                <p className='text-sm text-gray-500'>Chat with customers</p>
              </div>
            </div>
            <i className='bi bi-chevron-right text-gray-400'></i>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className='text-xl font-bold'>Platform Overview</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                  <i className='bi bi-tag text-lg text-[#78C726]'></i>
                </div>
                <div>
                  <p className='font-semibold text-sm text-gray-800'>Categories</p>
                  <p className='text-xs text-gray-500'>{stats.categories} total categories</p>
                </div>
              </div>
              <p className='font-bold text-[#78C726]'>{stats.categories}</p>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className='bi bi-check-circle text-lg text-green-600'></i>
                </div>
                <div>
                  <p className='font-semibold text-sm text-gray-800'>Active Products</p>
                  <p className='text-xs text-gray-500'>{stats.activeProducts} currently active</p>
                </div>
              </div>
              <p className='font-bold text-[#78C726]'>{stats.activeProducts}</p>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className='bi bi-people text-lg text-blue-600'></i>
                </div>
                <div>
                  <p className='font-semibold text-sm text-gray-800'>Registered Users</p>
                  <p className='text-xs text-gray-500'>{stats.totalUsers} users registered</p>
                </div>
              </div>
              <p className='font-bold text-[#78C726]'>{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>
      </>
      )}

    </DashboardLayout>
  )
}

export default Dashboard;
