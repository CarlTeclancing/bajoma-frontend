import React from 'react';
import FarmerDashboardLayout from '../../components/general/FarmerDashboardLayout';
import axios from 'axios';
import { BACKEND_URL } from '../../global';
import { authStorage } from '../../config/storage.config';

interface ChatMessage {
    type: 'user' | 'ai';
    message: string;
    timestamp: Date;
}

const FarmerSales = () => {
    const [salesData, setSalesData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [totalRevenue, setTotalRevenue] = React.useState(0);
    const [totalOrders, setTotalOrders] = React.useState(0);
    const [avgOrderValue, setAvgOrderValue] = React.useState(0);
    const [growthRate, setGrowthRate] = React.useState(0);
    const [marketInsights, setMarketInsights] = React.useState<any[]>([]);
    const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = React.useState('');
    const [showChat, setShowChat] = React.useState(false);

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
            const ordersResponse = await axios.get(`${BACKEND_URL}/orders`);
            const allOrders = Array.isArray(ordersResponse.data.content) ? ordersResponse.data.content : [];
            
            const productsResponse = await axios.get(`${BACKEND_URL}/product`);
            const allProducts = Array.isArray(productsResponse.data.content) ? productsResponse.data.content : [];
            
            const farmerProducts = allProducts.filter((p: any) => p.user_id === currentUser?.id);
            const farmerProductIds = farmerProducts.map((p: any) => p.id);
            
            // Calculate sales statistics
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
                    revenue: revenue,
                    status: product.status,
                    stock: product.quantity
                };
            });

            productSales.sort((a: any, b: any) => b.revenue - a.revenue);

            const totalRev = productSales.reduce((sum: number, item: any) => sum + item.revenue, 0);
            const totalOrd = productSales.reduce((sum: number, item: any) => sum + item.orders_count, 0);
            const avgOrder = totalOrd > 0 ? totalRev / totalOrd : 0;

            // Calculate growth rate (mock calculation based on orders)
            const growth = totalOrd > 0 ? Math.min(100, (totalOrd / farmerProducts.length) * 15) : 0;

            // Market insights - analyze all products to see competition
            const marketAnalysis = allProducts
                .filter((p: any) => !farmerProductIds.includes(p.id))
                .map((product: any) => {
                    const productOrders = allOrders.filter((order: any) => order.product_id === product.id);
                    return {
                        name: product.name,
                        orders: productOrders.length,
                        price: product.price
                    };
                })
                .sort((a, b) => b.orders - a.orders)
                .slice(0, 5);

            setSalesData(productSales);
            setTotalRevenue(totalRev);
            setTotalOrders(totalOrd);
            setAvgOrderValue(avgOrder);
            setGrowthRate(growth);
            setMarketInsights(marketAnalysis);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sales data:', error);
            setLoading(false);
        }
    };

    // AI-driven recommendations
    const getAIRecommendations = () => {
        const recommendations = [];
        
        if (salesData.length === 0) {
            recommendations.push({
                icon: 'bi-plus-circle',
                color: 'blue',
                title: 'Add More Products',
                message: 'Start by adding products to your catalog to begin generating sales.'
            });
        }
        
        if (totalOrders < 5 && salesData.length > 0) {
            recommendations.push({
                icon: 'bi-megaphone',
                color: 'orange',
                title: 'Boost Marketing',
                message: 'Consider promoting your products to increase visibility and attract more customers.'
            });
        }

        const lowStockProducts = salesData.filter(p => p.stock < 5 && p.orders_count > 0);
        if (lowStockProducts.length > 0) {
            recommendations.push({
                icon: 'bi-exclamation-triangle',
                color: 'red',
                title: 'Restock Popular Items',
                message: `${lowStockProducts.length} high-demand product(s) are running low on stock. Restock to avoid missing sales.`
            });
        }

        const topPerformer = salesData[0];
        if (topPerformer && topPerformer.revenue > 0) {
            recommendations.push({
                icon: 'bi-trophy',
                color: 'green',
                title: 'Capitalize on Success',
                message: `"${topPerformer.product_name}" is your top seller! Consider similar products or bundle deals.`
            });
        }

        if (marketInsights.length > 0) {
            recommendations.push({
                icon: 'bi-graph-up',
                color: 'purple',
                title: 'Market Opportunity',
                message: `"${marketInsights[0].name}" is trending in the market. Consider adding similar products.`
            });
        }

        if (avgOrderValue > 0 && avgOrderValue < 50) {
            recommendations.push({
                icon: 'bi-arrow-up-circle',
                color: 'blue',
                title: 'Increase Order Value',
                message: 'Average order value is low. Try product bundling or premium offerings to increase revenue per order.'
            });
        }

        return recommendations;
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;

        const userMessage: ChatMessage = {
            type: 'user',
            message: chatInput,
            timestamp: new Date()
        };
        setChatMessages(prev => [...prev, userMessage]);

        setTimeout(() => {
            let aiResponse = '';
            const input = chatInput.toLowerCase();

            if (input.includes('revenue') || input.includes('sales') || input.includes('earn')) {
                aiResponse = `Based on your current performance, you have generated $${totalRevenue.toFixed(2)} in total revenue from ${totalOrders} orders. Your average order value is $${avgOrderValue.toFixed(2)}, which shows ${avgOrderValue > 50 ? 'strong' : 'moderate'} customer spending. ${avgOrderValue < 50 ? 'Consider bundling products or offering premium options to increase order value.' : 'Keep up the great work!'}`;
            } else if (input.includes('stock') || input.includes('inventory')) {
                const lowStock = salesData.filter(p => p.stock < 5).length;
                const outOfStock = salesData.filter(p => p.stock === 0).length;
                aiResponse = `You currently have ${outOfStock} product(s) out of stock and ${lowStock} with low inventory (below 5 units). ${lowStock > 0 ? 'I recommend restocking your popular items to maintain sales momentum.' : 'Your inventory levels look healthy!'}`;
            } else if (input.includes('grow') || input.includes('improve') || input.includes('increase')) {
                const recommendations = getAIRecommendations();
                if (recommendations.length > 0) {
                    aiResponse = `Here are my top recommendations to grow your business: ${recommendations.slice(0, 2).map(r => r.message).join(' ')}`;
                } else {
                    aiResponse = 'Your business is performing well! Focus on consistent product quality, timely delivery, and customer satisfaction to maintain growth.';
                }
            } else if (input.includes('product') || input.includes('best') || input.includes('top')) {
                if (salesData.length > 0) {
                    const topProduct = salesData[0];
                    aiResponse = `Your best-performing product is "${topProduct.product_name}" with $${topProduct.revenue.toFixed(2)} in revenue from ${topProduct.orders_count} orders. ${topProduct.stock < 10 ? 'Make sure to restock this popular item!' : 'Great stock levels on this winner!'}`;
                } else {
                    aiResponse = 'You don\'t have any sales data yet. Start by promoting your products to get your first orders!';
                }
            } else if (input.includes('market') || input.includes('competitor') || input.includes('trend')) {
                if (marketInsights.length > 0) {
                    aiResponse = `Market analysis shows that "${marketInsights[0].name}" is trending with ${marketInsights[0].orderCount} orders. Consider how you can compete or differentiate your products in this space.`;
                } else {
                    aiResponse = 'I\'m analyzing market trends for you. Focus on quality, competitive pricing, and unique value propositions to stand out.';
                }
            } else if (input.includes('help') || input.includes('what can you do')) {
                aiResponse = 'I can help you with:\n• Analyzing your revenue and sales performance\n• Monitoring inventory and stock levels\n• Identifying growth opportunities\n• Understanding market trends\n• Providing product recommendations\n\nJust ask me anything about your business!';
            } else {
                aiResponse = `I'm analyzing your question. Currently, you have ${salesData.length} products with a ${growthRate.toFixed(1)}% growth rate. Your total revenue is $${totalRevenue.toFixed(2)}. How can I help you improve these metrics?`;
            }

            const aiMessage: ChatMessage = {
                type: 'ai',
                message: aiResponse,
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, aiMessage]);
        }, 500);

        setChatInput('');
    };

    const aiRecommendations = getAIRecommendations();

    if (loading) {
        return (
            <FarmerDashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                    <p className='ml-4'>Analyzing your sales performance...</p>
                </div>
            </FarmerDashboardLayout>
        );
    }

    return (
        <FarmerDashboardLayout>
            <h1 className='text-2xl font-bold'>Sales Analytics</h1>
            <p className='text-gray-600'>Track and analyze your product performance</p>

            {/* Stats Cards - Matching Products Page Style */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                            <i className='bi bi-cash-stack text-2xl text-[#78C726]'></i>
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>Total Revenue</p>
                            <h2 className='text-2xl font-bold text-[#78C726]'>${totalRevenue.toFixed(2)}</h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className='bi bi-cart-check text-2xl text-blue-600'></i>
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>Total Orders</p>
                            <h2 className='text-2xl font-bold text-gray-800'>{totalOrders}</h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i className='bi bi-calculator text-2xl text-purple-600'></i>
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>Avg Order Value</p>
                            <h2 className='text-2xl font-bold text-gray-800'>${avgOrderValue.toFixed(2)}</h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                            <i className='bi bi-graph-up text-2xl text-[#78C726]'></i>
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>Growth Rate</p>
                            <h2 className='text-2xl font-bold text-[#78C726]'>+{growthRate.toFixed(1)}%</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 mt-6">
                <div className='flex-1'></div>
                <button 
                    onClick={fetchSalesData}
                    className='bg-gray-100 text-gray-700 rounded-xl px-6 py-3 flex items-center gap-2 hover:bg-gray-200 border-2 border-gray-200'
                >
                    <i className='bi bi-arrow-clockwise'></i>
                    Refresh
                </button>
                <button 
                    onClick={() => setShowChat(!showChat)}
                    className='bg-[#78C726] text-white rounded-xl px-6 py-3 flex items-center gap-2 hover:bg-[#6ab31f]'
                >
                    <i className='bi bi-robot'></i>
                    AI Growth Advisor
                </button>
            </div>

            {/* AI Chatbot */}
            {showChat && (
                <div className="bg-white rounded-2xl border-2 border-[#90C955] mt-6 overflow-hidden">
                    <div className="p-4 bg-[#E6F2D9] border-b-2 border-[#90C955] flex justify-between items-center">
                        <div className='flex items-center gap-3'>
                            <div className="w-10 h-10 bg-[#78C726] rounded-lg flex items-center justify-center">
                                <i className='bi bi-robot text-xl text-white'></i>
                            </div>
                            <div>
                                <h2 className='text-lg font-bold text-gray-800'>AI Growth Advisor</h2>
                                <p className='text-xs text-gray-600'>Ask me anything about your business</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowChat(false)}
                            className='text-gray-600 hover:text-gray-800'
                        >
                            <i className='bi bi-x-lg text-xl'></i>
                        </button>
                    </div>
                    
                    <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                        {chatMessages.length === 0 ? (
                            <div className="text-center py-12">
                                <i className='bi bi-chat-dots text-5xl text-gray-300'></i>
                                <p className="text-gray-500 mt-4">Start a conversation!</p>
                                <p className="text-sm text-gray-400 mt-2">Ask about revenue, inventory, growth tips, or market trends</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {chatMessages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl p-4 ${
                                            msg.type === 'user' 
                                                ? 'bg-[#78C726] text-white' 
                                                : 'bg-white border-2 border-gray-200 text-gray-800'
                                        }`}>
                                            {msg.type === 'ai' && (
                                                <div className='flex items-center gap-2 mb-2'>
                                                    <i className='bi bi-robot text-[#78C726]'></i>
                                                    <span className='font-semibold text-sm text-[#78C726]'>AI Advisor</span>
                                                </div>
                                            )}
                                            <p className="whitespace-pre-wrap">{msg.message}</p>
                                            <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-green-100' : 'text-gray-400'}`}>
                                                {msg.timestamp.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white border-t-2 border-gray-200">
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask me anything about your business..."
                                className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:border-[#90C955] focus:outline-none"
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="bg-[#78C726] text-white rounded-xl px-6 py-3 hover:bg-[#6ab31f] flex items-center gap-2"
                            >
                                <i className='bi bi-send'></i>
                                Send
                            </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <button onClick={() => { setChatInput('How can I increase my revenue?'); }} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200">💡 Increase revenue</button>
                            <button onClick={() => { setChatInput('What products are running low on stock?'); }} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200">📦 Check inventory</button>
                            <button onClick={() => { setChatInput('What are my best-selling products?'); }} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200">🏆 Top products</button>
                            <button onClick={() => { setChatInput('Show me market trends'); }} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200">📈 Market trends</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Product Performance Chart */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                    <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                        <i className='bi bi-bar-chart-fill text-[#78C726]'></i>
                        Top Performing Products
                    </h2>
                    {salesData.length > 0 ? (
                        <div className="space-y-4">
                            {salesData.slice(0, 5).map((product, index) => {
                                const percentage = (product.revenue / totalRevenue * 100) || 0;
                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-700 truncate">{product.product_name}</span>
                                            <span className="text-sm font-semibold text-[#78C726]">${product.revenue.toFixed(2)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div 
                                                className="bg-[#78C726] h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{product.orders_count} orders</span>
                                            <span>{percentage.toFixed(1)}% of revenue</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <i className='bi bi-bar-chart text-5xl mb-2'></i>
                            <p>No sales data yet</p>
                        </div>
                    )}
                </div>

                {/* Market Trends */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                    <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                        <i className='bi bi-graph-up text-[#78C726]'></i>
                        Market Trends
                    </h2>
                    {marketInsights.length > 0 ? (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 mb-4">Top competing products:</p>
                            {marketInsights.map((product, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-[#E6F2D9] rounded-lg hover:bg-[#d4e8c1] transition-all">
                                    <div className="w-8 h-8 bg-[#78C726] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{product.name}</p>
                                        <p className="text-xs text-gray-600">{product.orderCount} orders in market</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <i className='bi bi-graph-up text-5xl mb-2'></i>
                            <p>No market data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 mt-6 overflow-hidden">
                <div className="p-4 border-b-2 border-gray-200 bg-[#E6F2D9]">
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
                            <thead className='bg-[#E6F2D9]'>
                                <tr>
                                    <th className='text-left p-4 font-semibold text-gray-800'>Product</th>
                                    <th className='text-left p-4 font-semibold text-gray-800'>Price</th>
                                    <th className='text-center p-4 font-semibold text-gray-800'>Stock</th>
                                    <th className='text-center p-4 font-semibold text-gray-800'>Orders</th>
                                    <th className='text-center p-4 font-semibold text-gray-800'>Quantity Sold</th>
                                    <th className='text-right p-4 font-semibold text-gray-800'>Revenue</th>
                                    <th className='text-center p-4 font-semibold text-gray-800'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesData.map((item, index) => {
                                    const stock = item.stock || 0;
                                    const stockColor = stock === 0 ? 'bg-red-100 text-red-700' : 
                                                      stock < 5 ? 'bg-red-100 text-red-700' : 
                                                      stock < 10 ? 'bg-amber-100 text-amber-700' : 
                                                      'bg-green-100 text-green-700';
                                    const stockIcon = stock === 0 ? 'bi-exclamation-triangle-fill' : 
                                                     stock < 5 ? 'bi-exclamation-circle-fill' : 
                                                     stock < 10 ? 'bi-info-circle-fill' : 
                                                     'bi-check-circle-fill';
                                    
                                    return (
                                        <tr key={item.product_id} className={`hover:bg-[#E6F2D9] transition-all ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className='p-4'>
                                                <div className="flex items-center gap-3">
                                                    {item.product_image ? (
                                                        <img 
                                                            src={item.product_image} 
                                                            alt={item.product_name}
                                                            className='w-12 h-12 object-cover rounded-lg'
                                                        />
                                                    ) : (
                                                        <div className='w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center'>
                                                            <i className='bi bi-image text-gray-400'></i>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className='font-semibold text-gray-800'>{item.product_name}</div>
                                                        <div className='text-sm text-gray-500'>ID: {item.product_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='p-4'>
                                                <span className='text-gray-700 font-medium'>${item.product_price}</span>
                                            </td>
                                            <td className='p-4'>
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 ${stockColor}`}>
                                                        <i className={`bi ${stockIcon}`}></i>
                                                        {stock}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='p-4 text-center'>
                                                <span className='bg-[#E6F2D9] text-[#78C726] px-3 py-1 rounded-full font-semibold'>
                                                    {item.orders_count}
                                                </span>
                                        </td>
                                        <td className='p-4 text-center'>
                                            <span className='font-semibold text-gray-700'>{item.total_quantity}</span>
                                        </td>
                                        <td className='p-4 text-right'>
                                            <span className='font-bold text-[#78C726] text-lg'>${item.revenue.toFixed(2)}</span>
                                        </td>
                                        <td className='p-4 text-center'>
                                            <span className={`px-3 py-1 rounded-full font-semibold ${
                                                item.status === 'ACTIF' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {item.status || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className='bg-[#E6F2D9]'>
                                <tr>
                                    <td colSpan={3} className='p-4 font-bold text-lg text-gray-800'>Total</td>
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
