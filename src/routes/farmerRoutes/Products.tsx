import React from 'react'
import FarmerDashboardLayout from '../../components/general/FarmerDashboardLayout';
import axios from 'axios';
import { BACKEND_URL } from '../../global';

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
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
        }
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/product`);
            const allProducts = Array.isArray(response.data.content) ? response.data.content : [];
            
            // Filter products to show only those created by the logged-in farmer
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const myProducts = allProducts.filter((product: any) => product.user_id === user.id);
                setProducts(myProducts);
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
            setSelectedProduct(null);
            resetForm();
            fetchProducts();
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

  return (
    <FarmerDashboardLayout>
        <h1 className='font-bold text-2xl'>Product Management</h1>
        <p>Review and manage your products</p>
        <div className="flex full">
            <div className="flex">
                <input 
                    type="text" 
                    placeholder='Search products...' 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='border border-gray-300 rounded p-2 m-2 w-64'
                />
                <button className='bg-[#90C955] text-white rounded p-2 m-2'><i className='bi bi-search m-2'></i>Search</button>
            </div>
            <div className="flex ml-auto">
                <button onClick={()=>{ resetForm(); setShowAddModal(true); }} className='bg-[#78C726] text-white rounded p-2 m-2'><i className='bi bi-plus-circle m-1'></i>Add New Product</button>
            </div>
        </div>

        {loading ? (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                <p className='mt-4 text-gray-600'>Loading your products...</p>
            </div>
        ) : (
        <table className='w-full border-collapse border border-gray-300 mt-4'>
            <thead>
                <tr>
                    <th className='border border-gray-300 p-2'>Product Name</th>
                    <th className='border border-gray-300 p-2'>Category</th>
                    <th className='border border-gray-300 p-2'>Price</th>
                    <th className='border border-gray-300 p-2'>Quantity</th>
                    <th className='border border-gray-300 p-2'>Status</th>
                    <th className='border border-gray-300 p-2'>Date Added</th>
                    <th className='border border-gray-300 p-2'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredProducts.length === 0 ? (
                    <tr>
                        <td colSpan={7} className='border border-gray-300 p-8 text-center text-gray-500'>
                            No products found. Click "Add New Product" to get started!
                        </td>
                    </tr>
                ) : (
                    filteredProducts.map(product => (
                        <tr key={product.id}>
                            <td className='border border-gray-300 p-2'>{product.name}</td>
                            <td className='border border-gray-300 p-2'>{product.category?.name || 'N/A'}</td>
                            <td className='border border-gray-300 p-2'>${product.price}</td>
                            <td className='border border-gray-300 p-2'>{product.quantity}</td>
                            <td className='border border-gray-300 p-2'>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    product.status === 'ACTIF' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {product.status}
                                </span>
                            </td>
                            <td className='border border-gray-300 p-2'>
                                {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className='border border-gray-300 p-2'>
                                <div className="flex gap-2 justify-center">
                                    <button onClick={()=>handleViewClick(product)} className='bg-[#78C726] text-white rounded p-2 hover:bg-[#6ab31f] transition-colors'>
                                        <i className='bi bi-eye'></i>
                                    </button>
                                    <button onClick={()=>handleEditClick(product)} className='bg-[#90C955] text-white rounded p-2 hover:bg-[#7ab845] transition-colors'>
                                        <i className='bi bi-pencil'></i>
                                    </button>
                                    <button onClick={()=>{ setSelectedProduct(product); setDeleteModal(true); }} className='bg-[#DF6B57] text-white rounded p-2 hover:bg-[#c85a47] transition-colors'>
                                        <i className='bi bi-trash'></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
        )}

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