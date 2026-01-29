import React from 'react';
import FarmerDashboardLayout from '../../components/general/FarmerDashboardLayout';
import axios from 'axios';
import { BACKEND_URL } from '../../global';import { authStorage } from '../../config/storage.config';
const FarmerOrders = () => {
    const [orders, setOrders] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [products, setProducts] = React.useState<any[]>([]);
    const [refreshKey, setRefreshKey] = React.useState(0);

    // Get current user from storage
    const getCurrentUser = () => {
        const userStr = authStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    };

    const currentUser = getCurrentUser();

    React.useEffect(() => {
        fetchOrders();
        fetchProducts();
        
        // Auto-refresh every 30 seconds to check for new orders
        const interval = setInterval(() => {
            fetchOrders();
        }, 30000);
        
        return () => clearInterval(interval);
    }, [refreshKey]);

<<<<<<< HEAD
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/product`);
            const data = Array.isArray(response.data.content) ? response.data.content : [];
            const myProducts = data.filter((p: any) => p.user_id === currentUser?.id);
            setProducts(myProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

=======
>>>>>>> e97a5c913d2cad93495ede8957f2c111fc0bbe7b
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/orders`);
            const data = Array.isArray(response.data.content) ? response.data.content : [];
            
            console.log('Fetched farmer orders:', data.length);
            console.log('Orders data:', data);
            
            // Backend already filters orders for farmer's products
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-500';
            case 'accepted': return 'bg-blue-500';
            case 'completed': return 'bg-blue-600';
            case 'delivered': return 'bg-green-500';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        setRefreshKey(prev => prev + 1);
    };

    const pendingOrders = orders.filter(order => order.status?.toLowerCase() === 'pending');

    const handleAcceptOrder = async (orderId: number) => {
        try {
            await axios.put(`${BACKEND_URL}/orders/${orderId}`, { status: 'accepted' });
            alert('Order accepted successfully! Product inventory has been updated.');
            fetchOrders();
        } catch (error) {
            console.error('Error accepting order:', error);
            alert('Failed to accept order. Please try again.');
        }
    };

    const handleMarkDelivered = async (orderId: number) => {
        try {
            await axios.put(`${BACKEND_URL}/orders/${orderId}`, { status: 'delivered' });
            alert('Order marked as delivered!');
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order status.');
        }
    };

    const handleCancelOrder = async (orderId: number) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        
        try {
            await axios.put(`${BACKEND_URL}/orders/${orderId}`, { status: 'cancelled' });
            alert('Order cancelled successfully.');
            fetchOrders();
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order.');
        }
    };

    if (loading) {
        return (
            <FarmerDashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                    <p className='ml-4 text-gray-600'>Loading orders...</p>
                </div>
            </FarmerDashboardLayout>
        );
    }

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status?.toLowerCase() === 'pending').length,
        accepted: orders.filter(o => o.status?.toLowerCase() === 'accepted').length,
        delivered: orders.filter(o => o.status?.toLowerCase() === 'delivered').length,
        cancelled: orders.filter(o => o.status?.toLowerCase() === 'cancelled').length
    };

    return (
        <FarmerDashboardLayout>
            <div className='flex justify-between items-center mb-6'>
                <div>
                    <h1 className='text-2xl font-bold'>Order Management</h1>
                    <p className='text-gray-600'>Manage orders for your products • Auto-refreshes every 30s</p>
                </div>
                <button 
                    onClick={handleRefresh}
                    className='bg-[#90C955] text-white px-4 py-2 rounded-lg hover:bg-[#7ab043] flex items-center gap-2 transition-all'
                    disabled={loading}
                >
                    <i className={`bi bi-arrow-clockwise ${loading ? 'animate-spin' : ''}`}></i>
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mb-6'>
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                            <i className='bi bi-basket text-2xl text-[#78C726]'></i>
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>Total</p>
                            <h2 className='text-2xl font-bold text-gray-800'>{stats.total}</h2>
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
                            <h2 className='text-2xl font-bold text-amber-600'>{stats.pending}</h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className='bi bi-check2-square text-2xl text-blue-600'></i>
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>Accepted</p>
                            <h2 className='text-2xl font-bold text-blue-600'>{stats.accepted}</h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-green-300 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className='bi bi-check-circle text-2xl text-green-600'></i>
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>Delivered</p>
                            <h2 className='text-2xl font-bold text-green-600'>{stats.delivered}</h2>
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
                            <h2 className='text-2xl font-bold text-red-600'>{stats.cancelled}</h2>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Orders Table */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <i className='bi bi-inbox text-5xl text-gray-300'></i>
                        <p className="text-gray-500 text-lg mt-3">No orders yet</p>
                        <p className="text-gray-400">Orders for your products will appear here</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className='w-full'>
                            <thead className='bg-[#E6F2D9]'>
                                <tr>
                                    <th className='text-left p-4 font-semibold text-gray-800'>Order ID</th>
                                    <th className='text-left p-4 font-semibold text-gray-800'>Customer</th>
                                    <th className='text-left p-4 font-semibold text-gray-800'>Product</th>
                                    <th className='text-center p-4 font-semibold text-gray-800'>Quantity</th>
                                    <th className='text-right p-4 font-semibold text-gray-800'>Total</th>
                                    <th className='text-center p-4 font-semibold text-gray-800'>Status</th>
                                    <th className='text-center p-4 font-semibold text-gray-800'>Date</th>
                                    <th className='text-center p-4 font-semibold text-gray-800'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order.id} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#F5F9F0] transition-all`}>
                                        <td className='p-4'>
                                            <span className='font-semibold text-gray-800'>#{order.id}</span>
                                        </td>
                                        <td className='p-4'>
                                            <div>
                                                <p className='font-semibold text-gray-800'>{order.User?.name || 'N/A'}</p>
                                                <p className='text-sm text-gray-500'>{order.User?.email || 'N/A'}</p>
                                                <p className='text-sm text-gray-500'>{order.User?.phone || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className='font-semibold text-gray-700'>{order.Product?.name || 'N/A'}</div>
                                            <div className='text-sm text-gray-500'>${order.Product?.price || 0} per unit</div>
                                        </td>
                                        <td className='p-4 text-center'>
                                            <span className='bg-[#E6F2D9] px-3 py-1 rounded-full font-semibold text-[#78C726]'>
                                                {order.quantity}
                                            </span>
                                        </td>
                                        <td className='p-4 text-right'>
                                            <span className='text-lg font-bold text-[#78C726]'>${order.total_price}</span>
                                        </td>
                                        <td className='p-4 text-center'>
                                            <span className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${getStatusColor(order.status)}`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className='p-4 text-center text-sm text-gray-600'>
                                            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                            <div className='text-xs text-gray-500'>{new Date(order.createdAt).toLocaleTimeString()}</div>
                                        </td>
                                        <td className='p-4'>
                                            <div className='flex justify-center gap-2'>
                                                {order.status?.toLowerCase() === 'pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleAcceptOrder(order.id)} 
                                                            className='bg-[#78C726] hover:bg-[#6ab01e] text-white rounded-lg px-3 py-2 text-sm transition-all font-semibold'
                                                            title="Accept Order"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            onClick={() => handleCancelOrder(order.id)} 
                                                            className='bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 text-sm transition-all'
                                                            title="Decline Order"
                                                        >
                                                            <i className='bi bi-x-lg'></i>
                                                        </button>
                                                    </>
                                                )}
                                                {(order.status?.toLowerCase() === 'accepted' || order.status?.toLowerCase() === 'completed') && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleMarkDelivered(order.id)} 
                                                            className='bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-2 text-sm transition-all font-semibold'
                                                            title="Mark as Delivered"
                                                        >
                                                            Deliver
                                                        </button>
                                                        <button 
                                                            onClick={() => handleCancelOrder(order.id)} 
                                                            className='bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 text-sm transition-all'
                                                            title="Cancel Order"
                                                        >
                                                            <i className='bi bi-x-lg'></i>
                                                        </button>
                                                    </>
                                                )}
                                                {(order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'cancelled') && (
                                                    <span className='text-gray-400 text-sm italic'>Completed</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </FarmerDashboardLayout>
    );
}

export default FarmerOrders;
