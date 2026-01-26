import React from 'react';
import DashboardLayout from '../../components/general/DashboardLayout';
import axios from 'axios';
import { BACKEND_URL } from '../../global';

const Orders = () => {
    const [orders, setOrders] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedOrder, setSelectedOrder] = React.useState<any | null>(null);
    const [statusFilter, setStatusFilter] = React.useState('all');

    React.useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/orders`);
            const data = Array.isArray(response.data.content) ? response.data.content : [];
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        try {
            await axios.put(`${BACKEND_URL}/orders/${orderId}`, { status: newStatus });
            alert(`Order ${newStatus.toLowerCase()} successfully!`);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order status');
        }
    };

    const filteredOrders = statusFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status?.toLowerCase() === statusFilter.toLowerCase());

    const orderCounts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        accepted: orders.filter(o => o.status === 'ACCEPTED').length,
        rejected: orders.filter(o => o.status === 'REJECTED').length
    };

    return (
        <DashboardLayout>
            <h1 className='text-2xl font-bold'>Order Management</h1>
            <p>View and manage all orders</p>

            <div className="flex gap-2 mt-4 mb-4">
                <button 
                    onClick={() => setStatusFilter('all')}
                    className={`font-bold rounded p-2 cursor-pointer ${
                        statusFilter === 'all' ? 'bg-[#78C726] text-white' : 'bg-white text-[#78C726] border border-[#78C726]'
                    }`}
                >
                    All Orders ({orderCounts.all})
                </button>
                <button 
                    onClick={() => setStatusFilter('pending')}
                    className={`font-bold rounded p-2 cursor-pointer ${
                        statusFilter === 'pending' ? 'bg-amber-500 text-white' : 'bg-white text-amber-500 border border-amber-500'
                    }`}
                >
                    Pending ({orderCounts.pending})
                </button>
                <button 
                    onClick={() => setStatusFilter('accepted')}
                    className={`font-bold rounded p-2 cursor-pointer ${
                        statusFilter === 'accepted' ? 'bg-green-500 text-white' : 'bg-white text-green-500 border border-green-500'
                    }`}
                >
                    Accepted ({orderCounts.accepted})
                </button>
                <button 
                    onClick={() => setStatusFilter('rejected')}
                    className={`font-bold rounded p-2 cursor-pointer ${
                        statusFilter === 'rejected' ? 'bg-red-500 text-white' : 'bg-white text-red-500 border border-red-500'
                    }`}
                >
                    Rejected ({orderCounts.rejected})
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                    <p className='mt-4 text-gray-600'>Loading orders...</p>
                </div>
            ) : (
            <div className="flex w-full flex-col gap-4 mt-4">
                {filteredOrders.length === 0 ? (
                    <div className="w-full text-center py-12 text-gray-500">
                        No orders found
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="flex w-full flex-col gap-4 bg-[#E6F2D9] p-4 rounded-2xl">
                            <div className="flex w-full bg-[#E6F2D9] p-4 rounded justify-between items-start">
                                <div className="flex flex-col">
                                    <h2 className='text-2xl font-bold'>Order #{order.id}</h2>
                                    <p className='m-2'><span className='font-semibold'>Reference:</span> {order.reference || 'N/A'}</p>
                                    <p className='m-2'><span className='font-semibold'>Customer:</span> {order.user?.name || 'N/A'}</p>
                                    <p className='m-2'><span className='font-semibold'>Email:</span> {order.user?.email || 'N/A'}</p>
                                    <p className='m-2'><span className='font-semibold'>Phone:</span> {order.user?.phone || 'N/A'}</p>
                                    <p className='m-2'><span className='font-semibold'>Date:</span> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                                    <p className='m-2'><span className='font-semibold'>Time:</span> {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'N/A'}</p>
                                </div>
                                <span className={`p-2 px-4 rounded-2xl text-white font-semibold ${
                                    order.status === 'PENDING' ? 'bg-amber-500' :
                                    order.status === 'ACCEPTED' ? 'bg-green-500' :
                                    'bg-red-500'
                                }`}>
                                    {order.status || 'PENDING'}
                                </span>
                            </div>

                            <div className="flex w-full justify-between bg-white p-4 rounded">
                                <h1 className='text-2xl mt-2 font-semibold'>Total Amount</h1>
                                <h1 className='text-2xl font-bold mt-2 text-[#78C726]'>${order.amount?.toFixed(2) || '0.00'}</h1>
                            </div>

                            <div className='p-2 flex justify-end gap-2'>
                                {order.status !== 'ACCEPTED' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(order.id, 'ACCEPTED')}
                                        className='bg-[#78C726] text-white rounded p-2 px-4 hover:bg-[#6ab31f]'
                                    >
                                        <i className='bi bi-check-circle m-2'></i>
                                        <span>Accept Order</span>
                                    </button>
                                )}
                                {order.status !== 'REJECTED' && order.status !== 'ACCEPTED' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(order.id, 'REJECTED')}
                                        className='bg-[#fc3b3b] text-white rounded p-2 px-4 hover:bg-[#e03232]'
                                    >
                                        <i className='bi bi-x-circle m-2'></i>
                                        <span>Reject Order</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            )}
        </DashboardLayout>
    )
}

export default Orders