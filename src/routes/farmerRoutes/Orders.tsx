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

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/orders`);
            const data = Array.isArray(response.data.content) ? response.data.content : [];
            
            // Filter orders that contain products belonging to this farmer
            const farmerOrders = data.filter((order: any) => {
                // Check if the product in this order belongs to the current farmer
                return order.Product && order.Product.user_id === currentUser?.id;
            });
            
            setOrders(farmerOrders);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-500';
            case 'confirmed': return 'bg-blue-500';
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

    const handleMarkDelivered = async (orderId: number) => {
        try {
            await axios.put(`${BACKEND_URL}/orders/${orderId}`, { status: 'delivered' });
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleCancelOrder = async (orderId: number) => {
        try {
            await axios.put(`${BACKEND_URL}/orders/${orderId}`, { status: 'cancelled' });
            fetchOrders();
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    if (loading) {
        return (
            <FarmerDashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <p>Loading orders...</p>
                </div>
            </FarmerDashboardLayout>
        );
    }

    return (
        <FarmerDashboardLayout>
            <div className='flex justify-between items-center mb-6'>
                <div>
                    <h1 className='text-2xl font-bold'>Order Management</h1>
                    <p className='text-gray-600'>Orders for your products • Auto-refreshes every 30s</p>
                </div>
                <div className='flex gap-4 items-center'>
                    {pendingOrders.length > 0 && (
                        <div className='bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold animate-pulse'>
                            <i className='bi bi-bell-fill mr-2'></i>
                            {pendingOrders.length} New Order{pendingOrders.length !== 1 ? 's' : ''}
                        </div>
                    )}
                    <button 
                        onClick={handleRefresh}
                        className='bg-[#90C955] text-white px-4 py-2 rounded-lg hover:bg-[#7ab043] flex items-center gap-2'
                        disabled={loading}
                    >
                        <i className={`bi bi-arrow-clockwise ${loading ? 'animate-spin' : ''}`}></i>
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>
            </div>
            
            <div className="flex w-full flex-col gap-4">
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No orders yet</p>
                        <p className="text-gray-400">Orders for your products will appear here</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="flex w-full flex-col gap-4 mt-4 bg-[#E6F2D9] p-4 rounded-2xl">
                            <div className="flex w-full bg-[#E6F2D9] p-4 rounded justify-between items-start">
                                <div className="flex flex-col">
                                    <h2 className='text-2xl font-bold'>Order #{order.id}</h2>
                                    <p className='m-2'>Customer: {order.User?.name || 'N/A'}</p>
                                    <p className='m-2'>Email: {order.User?.email || 'N/A'}</p>
                                    <p className='m-2'>Phone: {order.User?.phone || 'N/A'}</p>
                                    <p className='m-2'>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p className='m-2'>Time: {new Date(order.createdAt).toLocaleTimeString()}</p>
                                </div>
                                <span className={`p-2 rounded-2xl text-white ${getStatusColor(order.status)}`}>
                                    {order.status || 'Pending'}
                                </span>
                            </div>
                            <table className='w-full border-collapse border bg-white border-gray-300 mt-4'>
                                <thead>
                                    <tr className='border border-gray-300 text-left'>
                                        <th className='p-2'>Product</th>
                                        <th className='p-2'>Unit Price</th>
                                        <th className='p-2'>Quantity</th>
                                        <th className='p-2'>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='p-2'>{order.Product?.name || 'N/A'}</td>
                                        <td className='p-2'>${order.Product?.price || 0}</td>
                                        <td className='p-2'>{order.quantity}</td>
                                        <td className='p-2'>${order.total_price}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="flex w-full justify-between">
                                <h1 className='text-2xl mt-2'>Total</h1>
                                <h1 className='text-2xl font-bold mt-2'>${order.total_price}</h1>
                            </div>
                            <div className='p-2 flex justify-end'>
                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                    <>
                                        <button 
                                            onClick={() => handleMarkDelivered(order.id)} 
                                            className='bg-[#78C726] text-white rounded p-2 m-2'
                                        >
                                            <i className='bi bi-check m-2'></i>
                                            <span>Mark Delivered</span>
                                        </button>
                                        <button 
                                            onClick={() => handleCancelOrder(order.id)} 
                                            className='bg-[#fc3b3b] text-white rounded p-2 m-2'
                                        >
                                            <i className='bi bi-x m-2'></i>
                                            <span>Cancel</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </FarmerDashboardLayout>
    );
}

export default FarmerOrders;
