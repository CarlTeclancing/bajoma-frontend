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

      const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0);
      const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
      const activeProducts = products.filter(product => product.status === 'ACTIF').length;

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
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
          <p className='mt-4 text-gray-600'>Loading dashboard...</p>
        </div>
      ) : (
      <>
      <div className='flex flex-wrap w-[100%] md:h-[200px] h-auto rounded p-6 mt-4 bg-[#FFFFFF] border-gray-300 border-2 justify-between items-center'>

        <div className="flex justify-center items-center mt-4 md:mt-0">
          <i className='bi bi-box text-4xl text-[#58AC01]'></i>
          <div className="flex flex-col p-2 ">
            <p className='text-2xl'>Total Products</p>
            <h2 className='text-4xl font-bold'>{stats.totalProducts}</h2>
          </div>
        </div>

        <div className="w-[100%] md:w-[2px] bg-gray-300 h-[1px] md:h-full mt-2"></div>

        <div className="flex justify-center items-center mt-4 md:mt-0">
          <i className='bi bi-basket text-4xl text-[#58AC01]'></i>
          <div className="flex flex-col p-2 ">
            <p className='text-2xl'>Total Orders</p>
            <h2 className='text-4xl font-bold'>{stats.totalOrders}</h2>
          </div>
        </div>

        <div className="w-[100%] md:w-[2px] bg-gray-300 h-[1px] md:h-full mt-2"></div>

        <div className="flex justify-center items-center mt-4 md:mt-0">
          <i className='bi bi-person text-4xl text-[#58AC01]'></i>
          <div className="flex flex-col p-2 ">
            <p className='text-2xl'>Total Users</p>
            <h2 className='text-4xl font-bold'>{stats.totalUsers}</h2>
          </div>
        </div>

        <div className="w-[100%] md:w-[2px] bg-gray-300 h-[1px] md:h-full mt-2"></div>

        <div className="flex justify-center items-center mt-4 md:mt-0">
          <i className='bi bi-wallet text-4xl text-[#58AC01]'></i>
          <div className="flex flex-col p-2 ">
            <p className='text-2xl'>Total Revenue</p>
            <h2 className='text-4xl font-bold'>${stats.totalRevenue.toFixed(2)}</h2>
          </div>
        </div>
      </div>

      {/*Platform activities */}
      <h1 className='text-2xl font-bold mt-12'>Platform Activities</h1>
      <div className="flex w-full flex-col md:flex-row md:h-auto h-auto md:justify-between items-center pt-6">
        <div className=" w-full md:w-[49%] flex-col bg-white h-auto rounded md:p-6 p-0" >
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Manage Orders</h1>
            <p>{stats.pendingOrders} Pending orders to process</p>
          </div>
        
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Total Categories</h1>
            <p>{stats.categories} categories available</p>
          </div>
        
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>View Messages</h1>
            <p>Check customer inquiries</p>
          </div>
        
        </div>
        <div className=" w-full md:w-[49%] flex-col bg-white h-auto rounded md:p-6 p-0" >
          
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Active Products</h1>
            <p>{stats.activeProducts} products currently active</p>
          </div>
        
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Registered Users</h1>
            <p>{stats.totalUsers} users registered</p>
          </div>
        
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Total Revenue</h1>
            <p>${stats.totalRevenue.toFixed(2)}</p>
          </div>
        
        </div>
      </div>

      <div className="flex w-full flex-col md:flex-row md:h-auto h-auto md:justify-between items-center pt-6">
        <div className=" w-full md:w-auto flex-col bg-white h-auto rounded md:p-6 p-0" >
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Pending Orders</h1>
            <p>{stats.pendingOrders} orders awaiting action</p>
          </div>
        </div>
        <div className=" w-full md:w-auto flex-col bg-white h-auto rounded md:p-6 p-0" >
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Categories</h1>
            <p>{stats.categories} total categories</p>
          </div>
        </div>
        <div className=" w-full md:w-auto flex-col bg-white h-auto rounded md:p-6 p-0" >
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>All Products</h1>
            <p>{stats.totalProducts} products in system</p>
          </div>
        </div>

      </div>
      </>
      )}

    </DashboardLayout>
  )
}

export default Dashboard;