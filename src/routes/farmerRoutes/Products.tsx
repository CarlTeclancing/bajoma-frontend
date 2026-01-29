import React from 'react'
import FarmerDashboardLayout from '../../components/general/FarmerDashboardLayout';
import axios from 'axios';
import { BACKEND_URL } from '../../global';
import { authStorage } from '../../config/storage.config';

const FarmerProducts = () => {
    const [products, setProducts] = React.useState<any[]>([]);
    const [categories, setCategories] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [showViewModal, setShowViewModal] = React.useState(false);
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [currentUser, setCurrentUser] = React.useState<any>(null);
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        location: '',
        category_id: '',
        status: 'ACTIF'
    });

    React.useEffect(() => {
        const storedUser = authStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            console.log('Logged in user:', user);
        }
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/product`);
            const allProducts = Array.isArray(response.data.content) ? response.data.content : [];
            
            console.log('All products from API:', allProducts.length);
            
            // Filter products to show only those created by the logged-in farmer
            const storedUser = authStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                console.log('Current user ID:', user.id);
                
                const myProducts = allProducts.filter((product: any) => {
                    console.log(`Product ${product.id}: user_id=${product.user_id}, matches=${product.user_id === user.id}`);
                    return product.user_id === user.id;
                });
                
                console.log('My products count:', myProducts.length);
                setProducts(myProducts);
            } else {
                console.log('No user logged in');
                setProducts([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/categories`);
            const data = Array.isArray(response.data.content) ? response.data.content : [];
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentUser) {
            alert('User not logged in');
            return;
        }

        try {
            // Include user_id when creating product
            const productData = {
                ...formData,
                user_id: currentUser.id
            };
            
            console.log('Creating product with data:', productData);
            
            const response = await axios.post(`${BACKEND_URL}/product`, productData);
            console.log('Product created:', response.data);
            
            alert('Product added successfully!');
            setShowAddModal(false);
            resetForm();
            
            // Refetch products to update the list
            await fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        
        try {
            // Ensure user_id is preserved when updating
            const updateData = {
                ...formData,
                user_id: selectedProduct.user_id || currentUser?.id
            };
            
            console.log('Updating product with data:', updateData);
            
            await axios.put(`${BACKEND_URL}/product/${selectedProduct.id}`, updateData);
            alert('Product updated successfully!');
            setShowEditModal(false);
            setSelectedProduct(null);
            resetForm();
            
            // Refetch products to update the list
            await fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;
        try {
            await axios.delete(`${BACKEND_URL}/product/${selectedProduct.id}`);
            alert('Product deleted successfully!');
            setDeleteModal(false);
            setSelectedProduct(null);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const handleEditClick = (product: any) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            quantity: product.quantity || '',
            location: product.location || '',
            category_id: product.category_id || '',
            status: product.status || 'ACTIF'
        });
        setShowEditModal(true);
    };

    const handleViewClick = (product: any) => {
        setSelectedProduct(product);
        setShowViewModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            quantity: '',
            location: '',
            category_id: '',
            status: 'ACTIF'
        });
    };

    const filteredProducts = searchTerm
        ? products.filter(product =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : products;

    // Calculate product stats
    const activeProducts = products.filter(p => p.status === 'ACTIF').length;
    const lowStockProducts = products.filter(p => parseInt(p.quantity) < 10).length;
    const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * parseInt(p.quantity || 0)), 0);

  return (
    <FarmerDashboardLayout>
        <h1 className='text-2xl font-bold'>Product Management</h1>
        <p className='text-gray-600'>Review and manage your agricultural products</p>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                        <i className='bi bi-box-seam text-2xl text-[#78C726]'></i>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>Total Products</p>
                        <h2 className='text-2xl font-bold text-gray-800'>{products.length}</h2>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <i className='bi bi-check-circle text-2xl text-green-600'></i>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>Active Products</p>
                        <h2 className='text-2xl font-bold text-gray-800'>{activeProducts}</h2>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-amber-400 transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <i className='bi bi-exclamation-triangle text-2xl text-amber-600'></i>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>Low Stock</p>
                        <h2 className='text-2xl font-bold text-gray-800'>{lowStockProducts}</h2>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                        <i className='bi bi-cash-stack text-2xl text-[#78C726]'></i>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>Inventory Value</p>
                        <h2 className='text-2xl font-bold text-[#78C726]'>${totalValue.toFixed(2)}</h2>
                    </div>
                </div>
            </div>
        </div>

        {/* Actions and Search */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
            <input 
                type="text" 
                placeholder='Search products by name or description...' 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='flex-1 border-2 border-gray-200 rounded-xl p-3 focus:border-[#90C955] focus:outline-none'
            />
            <button 
                onClick={fetchProducts}
                className='bg-gray-100 text-gray-700 rounded-xl px-6 py-3 flex items-center gap-2 hover:bg-gray-200 border-2 border-gray-200'
            >
                <i className='bi bi-arrow-clockwise'></i>
                Refresh
            </button>
            <button 
                onClick={() => { resetForm(); setShowAddModal(true); }} 
                className='bg-[#78C726] text-white rounded-xl px-6 py-3 flex items-center gap-2 hover:bg-[#6ab31f]'
            >
                <i className='bi bi-plus-circle'></i>
                Add Product
            </button>
        </div>

        {/* Products Count */}
        <div className="mt-4">
            <p className='text-sm text-gray-600'>
                Showing <span className="font-semibold text-[#78C726]">{filteredProducts.length}</span> of <span className="font-semibold">{products.length}</span> products
            </p>
        </div>

        {loading ? (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                <p className='mt-4 text-gray-600'>Loading your products...</p>
            </div>
        ) : (
        <div className="bg-white rounded-2xl border-2 border-gray-200 mt-6 overflow-hidden">
        <div className="overflow-x-auto">
        <table className='w-full'>
            <thead className='bg-[#E6F2D9]'>
                <tr>
                    <th className='p-4 text-left font-semibold text-gray-700'>Product Name</th>
                    <th className='p-4 text-left font-semibold text-gray-700'>Category</th>
                    <th className='p-4 text-left font-semibold text-gray-700'>Price</th>
                    <th className='p-4 text-left font-semibold text-gray-700'>Quantity</th>
                    <th className='p-4 text-left font-semibold text-gray-700'>Status</th>
                    <th className='p-4 text-left font-semibold text-gray-700'>Date Added</th>
                    <th className='p-4 text-center font-semibold text-gray-700'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredProducts.length === 0 ? (
                    <tr>
                        <td colSpan={7} className='p-8 text-center text-gray-500'>
                            <div className="py-8">
                                <i className="bi bi-inbox text-5xl text-gray-300 mb-3"></i>
                                <p className="text-lg">No products found</p>
                                <p className="text-sm">Click "Add Product" to get started!</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    filteredProducts.map(product => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className='p-4'>
                                <div className="font-medium text-gray-800">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.location || 'N/A'}</div>
                            </td>
                            <td className='p-4'>
                                <span className="inline-flex items-center px-2 py-1 rounded-lg bg-gray-100 text-gray-700">
                                    <i className="bi bi-tag-fill text-xs mr-1"></i>
                                    {product.category?.name || 'N/A'}
                                </span>
                            </td>
                            <td className='p-4'>
                                <span className="font-semibold text-[#78C726]">${parseFloat(product.price).toFixed(2)}</span>
                            </td>
                            <td className='p-4'>
                                <span className={`font-medium ${parseInt(product.quantity) < 10 ? 'text-amber-600' : 'text-gray-700'}`}>
                                    {product.quantity} units
                                </span>
                            </td>
                            <td className='p-4'>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    product.status === 'ACTIF' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {product.status}
                                </span>
                            </td>
                            <td className='p-4 text-gray-600'>
                                {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className='p-4'>
                                <div className="flex gap-2 justify-center">
                                    <button onClick={()=>handleViewClick(product)} className='bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition-colors' title="View">
                                        <i className='bi bi-eye'></i>
                                    </button>
                                    <button onClick={()=>handleEditClick(product)} className='bg-[#78C726] text-white rounded-lg p-2 hover:bg-[#6ab31f] transition-colors' title="Edit">
                                        <i className='bi bi-pencil'></i>
                                    </button>
                                    <button onClick={()=>{ setSelectedProduct(product); setDeleteModal(true); }} className='bg-red-500 text-white rounded-lg p-2 hover:bg-red-600 transition-colors' title="Delete">
                                        <i className='bi bi-trash'></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
        </div>        </div>        )}

        {/* Edit modal window */}
        <div className={showEditModal?'flex w-full h-screen justify-center overflow-y-scroll items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <div className="flex w-[60%] h-auto border border-gray-300 rounded mt-6 p-6 m-2 flex-col justify-center bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h1 className='text-2xl font-bold'>Edit Product</h1>
                    <button onClick={()=>setShowEditModal(false)} className='text-gray-500 hover:text-gray-700'>
                        <i className='bi bi-x-lg text-xl'></i>
                    </button>
                </div>
                <form onSubmit={handleUpdateProduct} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="name" className="block font-semibold mb-2">Product Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder='Product name' 
                            className='w-full p-2 border border-gray-300 rounded' 
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block font-semibold mb-2">Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description}
                            onChange={handleInputChange}
                            className='w-full h-[100px] p-2 border border-gray-300 rounded'
                        ></textarea>
                    </div>
                    <div className="flex gap-4">
                        <div className='flex-1'>
                            <label htmlFor="category_id" className="block font-semibold mb-2">Category</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                className='w-full p-2 border border-gray-300 rounded'
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex-1'>
                            <label htmlFor="price" className="block font-semibold mb-2">Price ($)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                name="price" 
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder='Price' 
                                className='w-full p-2 border border-gray-300 rounded'
                                required
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className='flex-1'>
                            <label htmlFor="quantity" className="block font-semibold mb-2">Quantity</label>
                            <input 
                                type="number" 
                                name="quantity" 
                                value={formData.quantity}
                                onChange={handleInputChange}
                                placeholder='Quantity' 
                                className='w-full p-2 border border-gray-300 rounded'
                                required
                            />
                        </div>
                        <div className='flex-1'>
                            <label htmlFor="location" className="block font-semibold mb-2">Location</label>
                            <input 
                                type="text" 
                                name="location" 
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder='Location' 
                                className='w-full p-2 border border-gray-300 rounded'
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <button type="button" onClick={()=>setShowEditModal(false)} className='flex-1 border border-[#78C726] text-[#78C726] rounded p-2 hover:bg-gray-50 transition-colors'>
                            Cancel
                        </button>
                        <button type="submit" className='flex-1 bg-[#78C726] text-white rounded p-2 hover:bg-[#6ab31f] transition-colors'>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* View modal window */}
        <div className={showViewModal?'flex w-full h-screen justify-center overflow-y-scroll items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <div className="flex w-[60%] h-auto border border-gray-300 rounded mt-6 p-6 m-2 flex-col bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h1 className='text-2xl font-bold'>Product Details</h1>
                    <button onClick={()=>setShowViewModal(false)} className='text-gray-500 hover:text-gray-700'>
                        <i className='bi bi-x-lg text-xl'></i>
                    </button>
                </div>
                {selectedProduct && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Product Name</p>
                                <p className="text-lg">{selectedProduct.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Category</p>
                                <p className="text-lg">{selectedProduct.category?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Price</p>
                                <p className="text-lg">${selectedProduct.price}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Quantity</p>
                                <p className="text-lg">{selectedProduct.quantity}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Location</p>
                                <p className="text-lg">{selectedProduct.location || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Status</p>
                                <p className="text-lg">{selectedProduct.status}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-gray-500 font-semibold">Description</p>
                                <p className="text-lg">{selectedProduct.description || 'No description'}</p>
                            </div>
                        </div>
                        <button onClick={()=>setShowViewModal(false)} className='bg-[#78C726] text-white rounded p-2 mt-4 w-full hover:bg-[#6ab31f] transition-colors'>
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
        
        {/* Add product modal window */}
        <div className={showAddModal?'flex w-full h-screen justify-center overflow-y-scroll items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <div className="flex w-[60%] h-auto border border-gray-300 rounded mt-6 p-6 m-2 flex-col justify-center bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h1 className='text-2xl font-bold'>Add New Product</h1>
                    <button onClick={()=>setShowAddModal(false)} className='text-gray-500 hover:text-gray-700'>
                        <i className='bi bi-x-lg text-xl'></i>
                    </button>
                </div>
                <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="name" className="block font-semibold mb-2">Product Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder='Product name' 
                            className='w-full p-2 border border-gray-300 rounded' 
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block font-semibold mb-2">Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description}
                            onChange={handleInputChange}
                            className='w-full h-[100px] p-2 border border-gray-300 rounded'
                        ></textarea>
                    </div>
                    <div className="flex gap-4">
                        <div className='flex-1'>
                            <label htmlFor="category_id" className="block font-semibold mb-2">Category</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                className='w-full p-2 border border-gray-300 rounded'
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex-1'>
                            <label htmlFor="price" className="block font-semibold mb-2">Price ($)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                name="price" 
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder='Price' 
                                className='w-full p-2 border border-gray-300 rounded'
                                required
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className='flex-1'>
                            <label htmlFor="quantity" className="block font-semibold mb-2">Quantity</label>
                            <input 
                                type="number" 
                                name="quantity" 
                                value={formData.quantity}
                                onChange={handleInputChange}
                                placeholder='Quantity' 
                                className='w-full p-2 border border-gray-300 rounded'
                                required
                            />
                        </div>
                        <div className='flex-1'>
                            <label htmlFor="location" className="block font-semibold mb-2">Location</label>
                            <input 
                                type="text" 
                                name="location" 
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder='Location' 
                                className='w-full p-2 border border-gray-300 rounded'
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <button type="button" onClick={()=>setShowAddModal(false)} className='flex-1 border border-[#78C726] text-[#78C726] rounded p-2 hover:bg-gray-50 transition-colors'>
                            Cancel
                        </button>
                        <button type="submit" className='flex-1 bg-[#78C726] text-white rounded p-2 hover:bg-[#6ab31f] transition-colors'>
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Delete modal window */}
        <div className={deleteModal?'flex w-full h-screen justify-center overflow-hidden items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <div className="flex w-[40%] z-50 h-auto border border-gray-300 rounded p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Delete Product?</h1>
                <p>This will permanently delete "{selectedProduct?.name || 'this product'}". This action cannot be undone.</p>
                <div className="flex gap-2 mt-4">
                    <button onClick={()=>setDeleteModal(false)} className='flex-1 border border-[#78C726] text-[#78C726] rounded p-2'>Cancel</button>
                    <button onClick={handleDelete} className='flex-1 bg-[#DF6B57] text-white rounded p-2'>Delete</button>
                </div>
            </div>
        </div>
    </FarmerDashboardLayout>
  )
}

export default FarmerProducts