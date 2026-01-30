 import React from 'react';
import FarmerDashboardLayout from '../../components/general/FarmerDashboardLayout';
import axios from 'axios';
import { BACKEND_URL } from '../../global';
import { authStorage } from '../../config/storage.config';
import { Link } from 'react-router-dom';

const FarmerDashboard = () => {
  const [stats, setStats] = React.useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0
  });
  const [mostDemandedProducts, setMostDemandedProducts] = React.useState<any[]>([]);
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Get current user from storage
  const getCurrentUser = () => {
    const userStr = authStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const currentUser = getCurrentUser();

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch products - FIXED: using /product instead of /products
      const productsResponse = await axios.get(`${BACKEND_URL}/product`);
      const allProducts = Array.isArray(productsResponse.data.content) ? productsResponse.data.content : [];
      const myProducts = allProducts.filter((p: any) => p.user_id === currentUser?.id);
      
      console.log('Fetched products:', allProducts.length);
      console.log('My products:', myProducts.length);
      console.log('Current user ID:', currentUser?.id);
      
      // Fetch orders
      const ordersResponse = await axios.get(`${BACKEND_URL}/orders`);
      const allOrders = Array.isArray(ordersResponse.data.content) ? ordersResponse.data.content : [];
      
      // Filter orders for farmer's products
      const myOrders = allOrders.filter((order: any) => 
        myProducts.some((product: any) => product.id === order.product_id)
      );
      
      console.log('Total orders:', allOrders.length);
      console.log('My orders:', myOrders.length);
      
      // Calculate stats
      const pending = myOrders.filter((o: any) => o.status === 'pending').length;
      const delivered = myOrders.filter((o: any) => o.status === 'delivered').length;
      const totalRev = myOrders.reduce((sum: number, order: any) => 
        sum + parseFloat(order.total_price || 0), 0
      );
      
      setStats({
        totalProducts: myProducts.length,
        totalOrders: myOrders.length,
        pendingOrders: pending,
        deliveredOrders: delivered,
        totalRevenue: totalRev
      });

      // Calculate most demanded products (by order count)
      const productOrderCounts = myProducts.map((product: any) => {
        const productOrders = myOrders.filter((order: any) => order.product_id === product.id);
        return {
          ...product,
          orderCount: productOrders.length,
          totalQuantitySold: productOrders.reduce((sum: number, order: any) => 
            sum + (order.quantity || 0), 0
          ),
          revenue: productOrders.reduce((sum: number, order: any) => 
            sum + parseFloat(order.total_price || 0), 0
          )
        };
      });

      // Sort by order count and take top 5
      const topProducts = productOrderCounts
        .filter((p: any) => p.orderCount > 0)
        .sort((a: any, b: any) => b.orderCount - a.orderCount)
        .slice(0, 5);
      
      setMostDemandedProducts(topProducts);

      // Get recent orders (last 5)
      const recent = myOrders
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentOrders(recent);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <FarmerDashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
          <p className='ml-4'>Loading dashboard...</p>
        </div>
      </FarmerDashboardLayout>
    );
  }

  return (
    <FarmerDashboardLayout>
      <h1 className='text-2xl font-bold'>Farmer Dashboard</h1>
      <p className='text-gray-600'>Overview of your BAJOMA platform</p>

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
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className='bi bi-clock text-2xl text-amber-600'></i>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Pending</p>
              <h2 className='text-2xl font-bold text-gray-800'>{stats.pendingOrders}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className='bi bi-check-circle text-2xl text-green-600'></i>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Delivered</p>
              <h2 className='text-2xl font-bold text-gray-800'>{stats.deliveredOrders}</h2>
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

      {/* Most Demanded Products */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className='text-xl font-bold'>Most Demanded Products</h2>
            <p className='text-gray-600 text-sm'>Top selling products in the market</p>
          </div>
          <Link to="/farmer/sales" className='text-[#78C726] hover:underline flex items-center gap-1'>
            View All <i className='bi bi-arrow-right'></i>
          </Link>
        </div>
        
        {mostDemandedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-center">
            <i className='bi bi-graph-up text-5xl text-gray-300'></i>
            <p className="text-gray-500 mt-3">No sales data yet</p>
            <p className="text-gray-400 text-sm">Products will appear here once customers place orders</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className='w-full'>
                <thead className='bg-[#E6F2D9]'>
                  <tr>
                    <th className='text-left p-4 font-semibold text-gray-800'>Rank</th>
                    <th className='text-left p-4 font-semibold text-gray-800'>Product</th>
                    <th className='text-center p-4 font-semibold text-gray-800'>Orders</th>
                    <th className='text-center p-4 font-semibold text-gray-800'>Qty Sold</th>
                    <th className='text-right p-4 font-semibold text-gray-800'>Revenue</th>
                    <th className='text-center p-4 font-semibold text-gray-800'>Demand</th>
                  </tr>
                </thead>
                <tbody>
                  {mostDemandedProducts.map((product, index) => (
                    <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className='p-4'>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className='p-4'>
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className='w-12 h-12 object-cover rounded-lg'
                            />
                          ) : (
                            <div className='w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center'>
                              <i className='bi bi-image text-gray-400'></i>
                            </div>
                          )}
                          <div>
                            <div className='font-semibold text-gray-800'>{product.name}</div>
                            <div className='text-sm text-gray-500'>${product.price}</div>
                          </div>
                        </div>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='bg-[#E6F2D9] text-[#78C726] px-3 py-1 rounded-full font-semibold border border-[#90C955]'>
                          {product.orderCount}
                        </span>
                      </td>
                      <td className='p-4 text-center font-semibold text-gray-700'>
                        {product.totalQuantitySold}
                      </td>
                      <td className='p-4 text-right font-bold text-[#78C726] text-lg'>
                        ${product.revenue.toFixed(2)}
                      </td>
                      <td className='p-4 text-center'>
                        <div className="flex items-center justify-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`bi bi-star${i < Math.min(5, Math.ceil(product.orderCount / 2)) ? '-fill' : ''} text-yellow-500`}
                            ></i>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Platform Activities & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <h2 className='text-xl font-bold mb-4'>Quick Actions</h2>
          
          <Link to="/farmer/orders" className="flex items-center justify-between p-4 border-2 border-[#E6F2D9] rounded-lg mb-3 hover:border-[#90C955] transition-all">
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
          </Link>
        
          <Link to="/farmer/products" className="flex items-center justify-between p-4 border-2 border-[#E6F2D9] rounded-lg mb-3 hover:border-[#90C955] transition-all">
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
          </Link>
        
          <Link to="/farmer/messages" className="flex items-center justify-between p-4 border-2 border-[#E6F2D9] rounded-lg hover:border-[#90C955] transition-all">
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
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className='text-xl font-bold'>Recent Orders</h2>
            <Link to="/farmer/orders" className='text-[#78C726] hover:underline text-sm flex items-center gap-1'>
              View All <i className='bi bi-arrow-right'></i>
            </Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <i className='bi bi-inbox text-5xl text-gray-300'></i>
              <p className="text-gray-500 mt-3">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      order.status === 'pending' ? 'bg-amber-100' : 
                      order.status === 'delivered' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <i className={`bi ${
                        order.status === 'pending' ? 'bi-clock text-amber-600' : 
                        order.status === 'delivered' ? 'bi-check-circle text-green-600' : 'bi-x-circle text-gray-600'
                      } text-lg`}></i>
                    </div>
                    <div>
                      <p className='font-semibold text-sm text-gray-800'>Order #{order.id}</p>
                      <p className='text-xs text-gray-500'>{order.Product?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className='font-bold text-[#78C726]'>${order.total_price}</p>
                    <p className='text-xs text-gray-500'>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FarmerDashboardLayout>
  )
}

export default FarmerDashboard;