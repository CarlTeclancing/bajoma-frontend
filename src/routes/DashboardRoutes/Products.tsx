import React from 'react'
import DashboardLayout from '../../components/general/DashboardLayout'
import axios from 'axios';
import { BACKEND_URL } from '../../global';

const Products = () => {
    const [products, setProducts] = React.useState<any[]>([]);
    const [categories, setCategories] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [showViewModal, setShowViewModal] = React.useState(false);
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        location: '',
        category_id: '',
        image: '',
        status: 'ACTIF'
    });

    React.useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            console.log('Fetching products...');
            const response = await axios.get(`${BACKEND_URL}/product`);
            console.log('Products response:', response.data);
            const data = Array.isArray(response.data.content) ? response.data.content : [];
            setProducts(data);
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${BACKEND_URL}/product`, formData);
            alert('Product added successfully!');
            setShowAddModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        try {
            await axios.put(`${BACKEND_URL}/product/${selectedProduct.id}`, formData);
            alert('Product updated successfully!');
            setShowEditModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            quantity: '',
            location: '',
            category_id: '',
            image: '',
            status: 'ACTIF'
        });
        setSelectedProduct(null);
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
            image: product.image || '',
            status: product.status || 'ACTIF'
        });
        setShowEditModal(true);
    };

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            fetchProducts();
            return;
        }
        const filtered = products.filter(product => 
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProducts(filtered);
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

    // Calculate product stats
    const activeProducts = products.filter(p => p.status === 'ACTIF').length;
    const inactiveProducts = products.filter(p => p.status !== 'ACTIF').length;
    const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * parseInt(p.quantity || 0)), 0);
    const lowStockProducts = products.filter(p => parseInt(p.quantity) < 10).length;

  return (
    <DashboardLayout>
        <h1 className='text-2xl font-bold'>Product Management</h1>
        <p className='text-gray-600'>Review and manage all farmer products</p>

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
                Showing <span className="font-semibold text-[#78C726]">{products.length}</span> products
            </p>
        </div>

        {loading ? (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                <p className='mt-4 text-gray-600'>Loading products...</p>
            </div>
        ) : (
            <div className="bg-white rounded-2xl border-2 border-gray-200 mt-6 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className='w-full'>
                        <thead className='bg-[#E6F2D9]'>
                            <tr>
                                <th className='text-left p-4 font-semibold text-gray-800'>Product</th>
                                <th className='text-left p-4 font-semibold text-gray-800'>Category</th>
                                <th className='text-left p-4 font-semibold text-gray-800'>Price</th>
                                <th className='text-center p-4 font-semibold text-gray-800'>Quantity</th>
                                <th className='text-left p-4 font-semibold text-gray-800'>Location</th>
                                <th className='text-center p-4 font-semibold text-gray-800'>Status</th>
                                <th className='text-center p-4 font-semibold text-gray-800'>Date</th>
                                <th className='text-center p-4 font-semibold text-gray-800'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className='p-12 text-center'>
                                        <i className='bi bi-box-seam text-6xl text-gray-300'></i>
                                        <p className="text-gray-500 text-lg mt-4">No products found</p>
                                        <p className="text-gray-400">Add your first product to get started!</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, index) => (
                                    <tr key={product.id} className={`hover:bg-[#E6F2D9] transition-all ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className='p-4'>
                                            <div className="flex items-center gap-3">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className='w-12 h-12 object-cover rounded-lg' />
                                                ) : (
                                                    <div className='w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center'>
                                                        <i className='bi bi-image text-gray-400'></i>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className='font-semibold text-gray-800'>{product.name}</div>
                                                    <div className='text-sm text-gray-500'>ID: {product.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='p-4 text-gray-700'>{product.category?.name || 'N/A'}</td>
                                        <td className='p-4 font-semibold text-gray-800'>${product.price || '0.00'}</td>
                                        <td className='p-4 text-center'>
                                            <span className={`px-3 py-1 rounded-full font-semibold ${
                                                product.quantity === 0 || !product.quantity ? 'bg-red-100 text-red-700' :
                                                product.quantity < 5 ? 'bg-red-100 text-red-700' :
                                                product.quantity < 10 ? 'bg-amber-100 text-amber-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {product.quantity || 0}
                                            </span>
                                        </td>
                                        <td className='p-4 text-gray-700'>{product.location || 'N/A'}</td>
                                        <td className='p-4 text-center'>
                                            <span className={`px-3 py-1 rounded-full font-semibold ${
                                                product.status === 'ACTIF' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {product.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td className='p-4 text-center text-sm text-gray-700'>
                                            {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className='p-4'>
                                            <div className="flex gap-2 justify-center">
                                                <button 
                                                    onClick={() => { setSelectedProduct(product); setShowViewModal(true); }} 
                                                    className='bg-blue-100 text-blue-700 rounded-lg p-2 hover:bg-blue-200 transition-colors'
                                                    title="View Details"
                                                >
                                                    <i className='bi bi-eye'></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleEditClick(product)} 
                                                    className='bg-[#E6F2D9] text-[#78C726] rounded-lg p-2 hover:bg-[#d4e8c1] transition-colors'
                                                    title="Edit Product"
                                                >
                                                    <i className='bi bi-pencil'></i>
                                                </button>
                                                <button 
                                                    onClick={() => { setSelectedProduct(product); setDeleteModal(true); }} 
                                                    className='bg-red-100 text-red-700 rounded-lg p-2 hover:bg-red-200 transition-colors'
                                                    title="Delete Product"
                                                >
                                                    <i className='bi bi-trash'></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        )}

        {/* edit modal window */}
        <div className={showEditModal?'flex w-full h-screen justify-center overflow-hidden items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <button 
            onClick={()=> { setShowEditModal(false); resetForm(); }}
            className='p-2 border border-[white] bg-white cursor-pointer rounded absolute top-4 right-4'><i className='bi bi-x font-bold text-2xl text-black'></i></button>
            <div className="flex w-[60%] h-auto border border-gray-300 rounded p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Edit Product</h1>
                <p>Make changes to the product details</p>
                <form onSubmit={handleUpdateProduct} className="flex flex-col w-fill p-4">
                    <label htmlFor="name">Product Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder='product name' 
                        className='w-full p-2 border border-gray rounded' 
                        required
                    />
                    <label htmlFor="description">Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description}
                        onChange={handleInputChange}
                        className='w-full h-[100px] p-2 border border-gray rounded'
                    ></textarea>
                    <div className="flex justify-between">
                        <div className='w-[48%] flex flex-col'>
                            <label htmlFor="category_id">Category</label>
                            <select 
                                name="category_id" 
                                value={formData.category_id}
                                onChange={handleInputChange}
                                className='w-full p-2 border border-gray rounded'
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='w-[48%] flex flex-col'>
                            <label htmlFor="price">Price</label>
                            <input 
                                type="number" 
                                name="price" 
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder='price' 
                                className='w-full p-2 border border-gray rounded'
                                step="0.01"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className='w-[48%] flex flex-col'>
                            <label htmlFor="quantity">Quantity</label>
                            <input 
                                type="number" 
                                name="quantity" 
                                value={formData.quantity}
                                onChange={handleInputChange}
                                placeholder='quantity' 
                                className='w-full p-2 border border-gray rounded'
                                required
                            />
                        </div>
                        <div className='w-[48%] flex flex-col'>
                            <label htmlFor="location">Location</label>
                            <input 
                                type="text" 
                                name="location" 
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder='location' 
                                className='w-full p-2 border border-gray rounded'
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className='w-[48%] flex flex-col'>
                            <label htmlFor="status">Status</label>
                            <select 
                                name="status" 
                                value={formData.status}
                                onChange={handleInputChange}
                                className='w-full p-2 border border-gray rounded'
                            >
                                <option value="ACTIF">Active</option>
                                <option value="INACTIF">Inactive</option>
                            </select>
                        </div>
                        <div className='w-[48%] flex flex-col'>
                            <label htmlFor="image">Image URL</label>
                            <input 
                                type="text" 
                                name="image" 
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder='image url' 
                                className='w-full p-2 border border-gray rounded'
                            />
                        </div>
                    </div>
                    <button type="submit" className='bg-[#78C726] text-white rounded p-2 mt-4 float-end'>Update Product</button>
                </form>
            </div>
        </div>

        {/* view modal window */}
        <div className={showViewModal?'flex w-full h-screen justify-center overflow-y-scroll items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <button 
            onClick={()=>setShowViewModal(false)}
            className='p-2 border border-[white] bg-white cursor-pointer rounded absolute top-4 right-4'><i className='bi bi-x font-bold text-2xl text-black'></i></button>
            <div className="flex w-[60%] h-auto border border-gray-300 rounded mt-6 p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Product Details</h1>
                {selectedProduct && (
                    <div className="flex flex-col w-fill p-4">
                        <div className="mb-4">
                            {selectedProduct.image && (
                                <img src={selectedProduct.image} alt={selectedProduct.name} className='w-full h-48 object-cover rounded mb-4' />
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="font-semibold">Product Name:</label>
                            <p className='text-gray-700'>{selectedProduct.name}</p>
                        </div>
                        <div className="mb-3">
                            <label className="font-semibold">Description:</label>
                            <p className='text-gray-700'>{selectedProduct.description || 'N/A'}</p>
                        </div>
                        <div className="flex justify-between mb-3">
                            <div className='w-[48%]'>
                                <label className="font-semibold">Category:</label>
                                <p className='text-gray-700'>{selectedProduct.category?.name || 'N/A'}</p>
                            </div>
                            <div className='w-[48%]'>
                                <label className="font-semibold">Price:</label>
                                <p className='text-gray-700'>${selectedProduct.price || '0.00'}</p>
                            </div>
                        </div>
                        <div className="flex justify-between mb-3">
                            <div className='w-[48%]'>
                                <label className="font-semibold">Quantity:</label>
                                <p className='text-gray-700'>{selectedProduct.quantity || 'N/A'}</p>
                            </div>
                            <div className='w-[48%]'>
                                <label className="font-semibold">Location:</label>
                                <p className='text-gray-700'>{selectedProduct.location || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="font-semibold">Status:</label>
                            <p className='text-gray-700'>
                                <span className={`px-2 py-1 rounded text-sm ${
                                    selectedProduct.status === 'ACTIF' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {selectedProduct.status || 'N/A'}
                                </span>
                            </p>
                        </div>
                        <div className="mb-3">
                            <label className="font-semibold">Created At:</label>
                            <p className='text-gray-700'>{selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleString() : 'N/A'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        {/* add product modal window */}
        <div className={showAddModal ? 'flex w-full h-screen justify-center overflow-y-scroll items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20' : 'hidden overflow-hidden'}>
            <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className='p-2 border border-[white] bg-white cursor-pointer rounded absolute top-4 right-4'>
                <i className='bi bi-x font-bold text-2xl text-black'></i>
            </button>
            <div className="flex w-[60%] h-auto border border-gray-300 rounded mt-6 p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Add New Product</h1>
                <form onSubmit={handleAddProduct} className="flex flex-col w-fill p-4">
                    <label htmlFor="name">Product Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder='product name' 
                        className='w-full p-2 border border-gray rounded'
                        required
                    />
                    <label htmlFor="description">Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description}
                        onChange={handleInputChange}
                        className='w-full h-[100px] p-2 border border-gray rounded'
                    ></textarea>
                    <div className="flex justify-between">
                        <div className='w-[48%] flex flex-col'>
                            <label htmlFor="category_id">Category</label>
                            <select 
                                name="category_id" 
                                value={formData.category_id}
                                onChange={handleInputChange}
                                className='w-full p-2 border border-gray rounded'
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='w-[48%] flex flex-col'>
                            <label htmlFor="price">Price</label>
                            <input 
                                type="number" 
                                name="price" 
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder='price' 
                                className='w-full p-2 border border-gray rounded'
                                step="0.01"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className='w-[48%] flex flex-col'>
                            <label htmlFor="quantity">Quantity</label>
                            <input 
                                type="number" 
                                name="quantity" 
                                value={formData.quantity}
                                onChange={handleInputChange}
                                placeholder='quantity' 
                                className='w-full p-2 border border-gray rounded'
                                required
                            />
                        </div>
                        <div className='w-[48%] flex flex-col'>
                            <label htmlFor="location">Location</label>
                            <input 
                                type="text" 
                                name="location" 
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder='location' 
                                className='w-full p-2 border border-gray rounded'
                            />
                        </div>
                    </div>
                    <label htmlFor="image">Image URL</label>
                    <input 
                        type="text" 
                        name="image" 
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder='image url' 
                        className='w-full p-2 border border-gray rounded'
                    />
                    <button type="submit" className='bg-[#78C726] text-white rounded p-2 mt-4 float-end'>Add Product</button>
                </form>
            </div>
        </div>

        {/* Delete modal window */}
        <div className={deleteModal?'flex w-full h-screen justify-center overflow-hidden items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <div className="flex w-[40%] z-50 h-auto border border-gray-300 rounded p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Delete Product?</h1>
                <p>This will permanently delete "{selectedProduct?.name || 'this product'}". This action cannot be undone.</p>
                <div className="flex">
                    <button onClick={()=> { setDeleteModal(false); setSelectedProduct(null); }} className='bg-none border border-[#78C726] text-[#78C726] rounded p-2 m-2'>No</button>
                    <button onClick={handleDelete} className='bg-[#DF6B57] text-white rounded p-2 m-2'>Yes</button>
                </div>
            </div>
        </div>
    </DashboardLayout>
  )
}

export default Products