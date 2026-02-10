    // Handle messaging the seller (placeholder)
    const handleMessageSeller = (seller: any) => {
        // You can replace this with a modal or navigation to a messaging page
        alert(`Start a message to seller: ${seller.name} (ID: ${seller.id})`);
    };
import React from 'react';
import DashboardLayout from '../../components/general/DashboardLayout';
import axios from 'axios';
import { BACKEND_URL } from '../../global';
import useAuth from '../../hooks/auth';

const Orders = () => {
    const [orders, setOrders] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [refreshKey, setRefreshKey] = React.useState(0);

    // Get current user using the auth hook
    const { getCurrentUser } = useAuth();
    const currentUser = getCurrentUser();
    const isAdmin = currentUser?.account_type?.toLowerCase() === 'admin';
    const isBuyer = currentUser?.account_type?.toLowerCase() === 'buyer' || currentUser?.account_type?.toLowerCase() === 'user';

    React.useEffect(() => {
        fetchOrders();
        const interval = setInterval(() => {
            fetchOrders();
        }, 30000);
        return () => clearInterval(interval);
    }, [refreshKey]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/orders`);
            const data = Array.isArray(response.data.content) ? response.data.content : [];
            
            console.log('All orders from API:', data);
            console.log('Current user:', currentUser);
            console.log('Is buyer:', isBuyer);
            
            // Debug: Log the structure of the first order if any exist
            if (data && data.length > 0) {
                console.log('First order structure:', JSON.stringify(data[0], null, 2));
                console.log('First order keys:', Object.keys(data[0]));
                console.log('First order User:', data[0].User);
                console.log('First order Product:', data[0].Product);
                if (data[0].Product) {
                    console.log('First order Product keys:', Object.keys(data[0].Product));
                    console.log('First order Product.user:', data[0].Product.user);
                }
            }
            
            // For buyers, only show their own orders
            let filteredOrders = data;
            if (isBuyer && currentUser && currentUser.id) {
                console.log('Filtering orders for user_id:', currentUser.id);
                filteredOrders = data.filter((order: any) => {
                    console.log(`Order ${order.id}: user_id = ${order.user_id}, matches = ${order.user_id === currentUser.id}`);
                    return order.user_id === currentUser.id;
                });
                console.log('Filtered orders:', filteredOrders);
            }
            // Admin sees all orders
            
            setOrders(filteredOrders);
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

    const handleAcceptOrder = async (orderId: number) => {
        try {
            await axios.put(`${BACKEND_URL}/orders/${orderId}`, { status: 'accepted' });
            alert('Order accepted successfully!');
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
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
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
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                    <p className='ml-4 text-gray-600'>Loading orders...</p>
                </div>
            </DashboardLayout>
        );
    }

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status?.toLowerCase() === 'pending').length,
        accepted: orders.filter(o => o.status?.toLowerCase() === 'accepted').length,
        delivered: orders.filter(o => o.status?.toLowerCase() === 'delivered').length,
        cancelled: orders.filter(o => o.status?.toLowerCase() === 'cancelled').length,
        totalSpent: orders.reduce((sum, order) => {
            const price = parseFloat(order.total_price || order.amount || 0);
            return sum + price;
        }, 0)
    };

    return (
        <DashboardLayout>
            <div className='flex justify-between items-center mb-6'>
                <div>
                    <h1 className='text-2xl font-bold'>{isBuyer ? 'My Orders' : 'Order Management'}</h1>
                    <p className='text-gray-600'>
                        {isBuyer 
                            ? 'View your order history and track your purchases' 
                            : 'Manage orders for your products • Auto-refreshes every 30s'
                        }
                    </p>
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
                
                {/* Show Total Spent for Buyers */}
                {isBuyer && (
                    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i className='bi bi-cash-stack text-2xl text-purple-600'></i>
                            </div>
                            <div>
                                <p className='text-sm text-gray-600'>Total Spent</p>
                                <h2 className='text-xl font-bold text-purple-600'>${stats.totalSpent.toFixed(2)}</h2>
                            </div>
                        </div>
                    </div>
                )}

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
                                    <th className='text-left p-4 font-semibold text-gray-800'>Seller</th>
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
                                        {/* Customer Info */}
                                        <td className='p-4'>
                                            <div className='flex items-center gap-2'>
                                                {(order.User?.profileimg || order.user?.profileimg) && (
                                                    <img
                                                        src={
                                                            (order.User?.profileimg || order.user?.profileimg)?.startsWith('http') 
                                                                ? (order.User?.profileimg || order.user?.profileimg)
                                                                : `http://localhost:5000${order.User?.profileimg || order.user?.profileimg}`
                                                        }
                                                        alt="Customer"
                                                        className="w-8 h-8 rounded-full object-cover border"
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                    />
                                                )}
                                                <div>
                                                    <p className='font-semibold text-gray-800'>
                                                        {order.User?.name || order.user?.name || order.customer_name || 'Customer'}
                                                        <span className='ml-2 text-xs text-gray-500'>ID: {order.User?.id || order.user?.id || order.user_id}</span>
                                                    </p>
                                                    <p className='text-sm text-gray-500'>{order.User?.email || order.user?.email || ''}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Seller Info */}
                                        <td className='p-4'>
                                            <div className='flex items-center gap-2'>
                                                {(order.Product?.user?.profileimg || order.product?.user?.profileimg) && (
                                                    <img
                                                        src={
                                                            (order.Product?.user?.profileimg || order.product?.user?.profileimg)?.startsWith('http')
                                                                ? (order.Product?.user?.profileimg || order.product?.user?.profileimg)
                                                                : `http://localhost:5000${order.Product?.user?.profileimg || order.product?.user?.profileimg}`
                                                        }
                                                        alt="Seller"
                                                        className="w-8 h-8 rounded-full object-cover border"
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                    />
                                                )}
                                                <div>
                                                    <p className='font-semibold text-gray-800'>
                                                        {order.Product?.user?.name || order.product?.user?.name || order.seller_name || 'Seller'}
                                                        <span className='ml-2 text-xs text-gray-500'>ID: {order.Product?.user?.id || order.product?.user?.id}</span>
                                                    </p>
                                                    <p className='text-sm text-gray-500'>{order.Product?.user?.email || order.product?.user?.email || ''}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Product Info */}
                                        <td className='p-4'>
                                            <div className='flex items-center gap-2'>
                                                {(order.Product?.image || order.product?.image || order.Product?.img || order.product?.img) && (
                                                    <img
                                                        src={
                                                            (order.Product?.image || order.product?.image || order.Product?.img || order.product?.img)?.startsWith('http')
                                                                ? (order.Product?.image || order.product?.image || order.Product?.img || order.product?.img)
                                                                : `http://localhost:5000${order.Product?.image || order.product?.image || order.Product?.img || order.product?.img}`
                                                        }
                                                        alt="Product"
                                                        className="w-8 h-8 rounded object-cover border"
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                    />
                                                )}
                                                <div>
                                                    <div className='font-semibold text-gray-700'>
                                                        {order.Product?.name || order.product?.name || order.product_name || 'Product'}
                                                    </div>
                                                    <div className='text-sm text-gray-500'>
                                                        ${order.Product?.price || order.product?.price || 0} per unit
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='p-4 text-center'>
                                            <span className='bg-[#E6F2D9] px-3 py-1 rounded-full font-semibold text-[#78C726]'>
                                                {order.quantity}
                                            </span>
                                        </td>
                                        <td className='p-4 text-right'>
                                            <span className='text-lg font-bold text-[#78C726]'>${order.total_price || order.amount?.toFixed(2) || '0.00'}</span>
                                        </td>
                                        <td className='p-4 text-center'>
                                            <span className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${getStatusColor(order.status)}`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className='p-4 text-center text-sm text-gray-600'>
                                            <div>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</div>
                                            <div className='text-xs text-gray-500'>{order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'N/A'}</div>
                                        </td>
                                        <td className='p-4'>
                                            <div className='flex justify-center gap-2'>
                                                {/* Only show action buttons for admin/farmer, not for buyers */}
                                                {!isBuyer && (
                                                    <>
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
                                                        {order.status?.toLowerCase() === 'delivered' && (
                                                            <span className='text-green-600 text-sm'>
                                                                <i className='bi bi-check-circle-fill'></i> Delivered
                                                            </span>
                                                        )}
                                                        {order.status?.toLowerCase() === 'cancelled' && (
                                                            <span className='text-red-600 text-sm'>
                                                                <i className='bi bi-x-circle-fill'></i> Cancelled
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                                {/* For buyers, show view details or status info */}
                                                {isBuyer && (
                                                    <span className='text-gray-600 text-sm'>
                                                        {order.status?.toLowerCase() === 'pending' && '⏳ Processing...'}
                                                        {order.status?.toLowerCase() === 'accepted' && '📦 Preparing...'}
                                                        {order.status?.toLowerCase() === 'delivered' && '✅ Delivered'}
                                                        {order.status?.toLowerCase() === 'cancelled' && '❌ Cancelled'}
                                                    </span>
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
        </DashboardLayout>
    );
}

export default Orders;