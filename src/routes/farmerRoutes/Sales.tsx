import React from 'react';
import FarmerDashboardLayout from '../../components/general/FarmerDashboardLayout';
import axios from 'axios';
import { BACKEND_URL } from '../../global';
import { authStorage } from '../../config/storage.config';

const FarmerSales = () => {
    const [salesData, setSalesData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [totalRevenue, setTotalRevenue] = React.useState(0);
    const [totalOrders, setTotalOrders] = React.useState(0);

    // Get current user from storage
    const getCurrentUser = () => {
        const userStr = authStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    };

    const currentUser = getCurrentUser();

    React.useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            // Fetch all orders
            const ordersResponse = await axios.get(`${BACKEND_URL}/orders`);
            const allOrders = Array.isArray(ordersResponse.data.content) ? ordersResponse.data.content : [];
            
            // Fetch farmer's products
            const productsResponse = await axios.get(`${BACKEND_URL}/products`);
            const allProducts = Array.isArray(productsResponse.data.content) ? productsResponse.data.content : [];
            const farmerProducts = allProducts.filter((p: any) => p.user_id === currentUser?.id);
            
            // Calculate sales statistics for each product
            const productSales = farmerProducts.map((product: any) => {
                const productOrders = allOrders.filter((order: any) => order.product_id === product.id);
                const ordersCount = productOrders.length;
                const totalQuantity = productOrders.reduce((sum: number, order: any) => sum + (order.quantity || 0), 0);
                const revenue = productOrders.reduce((sum: number, order: any) => {
                    const price = parseFloat(order.total_price || 0);
                    return sum + price;
                }, 0);

                return {
                    product_id: product.id,
                    product_name: product.name,
                    product_image: product.image,
                    product_price: product.price,
                    orders_count: ordersCount,
                    total_quantity: totalQuantity,
                    revenue: revenue.toFixed(2),
                    status: product.status
                };
            });

            // Sort by revenue (highest first)
            productSales.sort((a: any, b: any) => parseFloat(b.revenue) - parseFloat(a.revenue));

            // Calculate totals
            const totalRev = productSales.reduce((sum: number, item: any) => sum + parseFloat(item.revenue), 0);
            const totalOrd = productSales.reduce((sum: number, item: any) => sum + item.orders_count, 0);

            setSalesData(productSales);
            setTotalRevenue(totalRev);
            setTotalOrders(totalOrd);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sales data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <FarmerDashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                    <p className='ml-4'>Loading sales data...</p>
                </div>
            </FarmerDashboardLayout>
        );
    }

    return (
        <FarmerDashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className='text-2xl font-bold'>Sales Analytics</h1>
                    <p className='text-gray-600'>Track orders and revenue for your products</p>
                </div>
                <button 
                    onClick={fetchSalesData}
                    className='bg-[#78C726] text-white rounded px-4 py-2 flex items-center gap-2'
                >
                    <i className='bi bi-arrow-clockwise'></i>
                    Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#E6F2D9] rounded-2xl p-6 border-2 border-[#90C955]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className='text-gray-600 text-sm font-medium'>Total Products</p>
                            <h2 className='text-3xl font-bold mt-1 text-gray-800'>{salesData.length}</h2>
                        </div>
                        <div className='w-14 h-14 bg-[#90C955] rounded-lg flex items-center justify-center'>
                            <i className='bi bi-box-seam text-2xl text-white'></i>
                        </div>
                    </div>
                </div>
                <div className="bg-[#E6F2D9] rounded-2xl p-6 border-2 border-[#90C955]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className='text-gray-600 text-sm font-medium'>Total Orders</p>
                            <h2 className='text-3xl font-bold mt-1 text-gray-800'>{totalOrders}</h2>
                        </div>
                        <div className='w-14 h-14 bg-[#78C726] rounded-lg flex items-center justify-center'>
                            <i className='bi bi-cart-fill text-2xl text-white'></i>
                        </div>
                    </div>
                </div>
                <div className="bg-[#E6F2D9] rounded-2xl p-6 border-2 border-[#90C955]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className='text-gray-600 text-sm font-medium'>Total Revenue</p>
                            <h2 className='text-3xl font-bold mt-1 text-[#78C726]'>${totalRevenue.toFixed(2)}</h2>
                        </div>
                        <div className='w-14 h-14 bg-[#78C726] rounded-lg flex items-center justify-center'>
                            <i className='bi bi-cash-stack text-2xl text-white'></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-2xl border-2 border-[#90C955]">
                <div className="p-4 border-b-2 border-[#E6F2D9] bg-[#E6F2D9]">
                    <h2 className='text-xl font-bold text-gray-800'>Product Sales Performance</h2>
                </div>
                
                {salesData.length === 0 ? (
                    <div className="text-center py-12">
                        <i className='bi bi-graph-down text-6xl text-gray-300'></i>
                        <p className="text-gray-500 text-lg mt-4">No sales data yet</p>
                        <p className="text-gray-400">Orders for your products will appear here</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className='w-full'>
                            <thead className='bg-[#E6F2D9] border-b-2 border-[#90C955]'>
                                <tr>
                                    <th className='text-left p-4 font-semibold text-gray-800'>Product</th>
                                    <th className='text-left p-4 font-semibold text-gray-800'>Price</th>
                                    <th className='text-center p-4 font-semibold text-gray-800'>Orders</th>
                                    <th className='text-center p-4 font-semibold text-gray-800'>Quantity Sold</th>
                                    <th className='text-right p-4 font-semibold text-gray-800'>Revenue</th>
                                    <th className='text-center p-4 font-semibold text-gray-800'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesData.map((item, index) => (
                                    <tr key={item.product_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className='p-4'>
                                            <div className="flex items-center gap-3">
                                                {item.product_image ? (
                                                    <img 
                                                        src={item.product_image} 
                                                        alt={item.product_name}
                                                        className='w-12 h-12 object-cover rounded'
                                                    />
                                                ) : (
                                                    <div className='w-12 h-12 bg-gray-200 rounded flex items-center justify-center'>
                                                        <i className='bi bi-image text-gray-400'></i>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className='font-semibold'>{item.product_name}</div>
                                                    <div className='text-sm text-gray-500'>ID: {item.product_id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <span className='text-gray-700'>${item.product_price}</span>
                                        </td>
                                        <td className='p-4 text-center'>
                                            <span className='bg-[#E6F2D9] text-[#78C726] px-3 py-1 rounded-full font-semibold border border-[#90C955]'>
                                                {item.orders_count}
                                            </span>
                                        </td>
                                        <td className='p-4 text-center'>
                                            <span className='font-semibold text-gray-700'>{item.total_quantity}</span>
                                        </td>
                                        <td className='p-4 text-right'>
                                            <span className='font-bold text-[#78C726] text-lg'>${item.revenue}</span>
                                        </td>
                                        <td className='p-4 text-center'>
                                            <span className={`px-3 py-1 rounded-full text-sm ${
                                                item.status === 'ACTIF' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {item.status || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className='bg-[#E6F2D9] border-t-2 border-[#90C955]'>
                                <tr>
                                    <td colSpan={2} className='p-4 font-bold text-lg text-gray-800'>Total</td>
                                    <td className='p-4 text-center'>
                                        <span className='bg-[#78C726] text-white px-3 py-1 rounded-full font-bold'>
                                            {totalOrders}
                                        </span>
                                    </td>
                                    <td className='p-4 text-center font-bold text-gray-800'>
                                        {salesData.reduce((sum, item) => sum + item.total_quantity, 0)}
                                    </td>
                                    <td className='p-4 text-right font-bold text-[#78C726] text-xl'>
                                        ${totalRevenue.toFixed(2)}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </FarmerDashboardLayout>
    );
}

export default FarmerSales;
