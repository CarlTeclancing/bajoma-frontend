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
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string>('');
    const [uploading, setUploading] = React.useState(false);
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
            let imageUrl = formData.image || '';
            
            // Upload image first if selected
            if (imageFile) {
                setUploading(true);
                const imageFormData = new FormData();
                imageFormData.append('productImage', imageFile);
                
                console.log('Uploading product image...');
                const uploadResponse = await axios.post(`${BACKEND_URL}/product/upload-image`, imageFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                imageUrl = uploadResponse.data.imageUrl;
                console.log('Image uploaded successfully:', imageUrl);
            }
            
            // Include user_id and image when creating product
            const productData = {
                ...formData,
                image: imageUrl,
                user_id: currentUser.id
            };
            
            console.log('Creating product with data:', productData);
            
            const response = await axios.post(`${BACKEND_URL}/product`, productData);
            console.log('Product created:', response.data);
            
            alert('Product added successfully!');
            setShowAddModal(false);
            resetForm();
            setImageFile(null);
            setImagePreview(null);
            
            // Refetch products to update the list with new image
            await fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        
        try {
            let imageUrl = formData.image || selectedProduct.image;
            
            // Upload image first if a new one is selected
            if (imageFile) {
                setUploading(true);
                const imageFormData = new FormData();
                imageFormData.append('productImage', imageFile);
                
                console.log('Uploading new product image...');
                const uploadResponse = await axios.post(`${BACKEND_URL}/product/upload-image`, imageFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                imageUrl = uploadResponse.data.imageUrl;
                console.log('Image uploaded successfully:', imageUrl);
            }
            
            // Ensure user_id is preserved and image URL is included
            const updateData = {
                ...formData,
                image: imageUrl,
                user_id: selectedProduct.user_id || currentUser?.id
            };
            
            console.log('Updating product with data:', updateData);
            
            const response = await axios.put(`${BACKEND_URL}/product/${selectedProduct.id}`, updateData);
            console.log('Product updated:', response.data);
            
            alert('Product updated successfully!');
            setShowEditModal(false);
            setSelectedProduct(null);
            resetForm();
            setImageFile(null);
            setImagePreview(null);
            
            // Refetch products to update the list with new image
            await fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        } finally {
            setUploading(false);
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
            image: product.image || '',
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
            image: '',
            status: 'ACTIF'
        });
        setSelectedProduct(null);
        setImageFile(null);
        setImagePreview('');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
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
                    filteredProducts.map(product => {
                        const imageUrl = product.image 
                            ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`)
                            : null;
                        console.log('Product:', product.name, 'Image URL:', imageUrl, 'Raw image:', product.image);
                        
                        return (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className='p-4'>
                                <div className="flex items-center gap-3">
                                    {imageUrl ? (
                                        <img 
                                            src={imageUrl} 
                                            alt={product.name} 
                                            className='w-12 h-12 object-cover rounded-lg border-2 border-gray-200'
                                            onError={(e) => {
                                                console.error('Failed to load image:', imageUrl);
                                                e.currentTarget.style.display = 'none';
                                                const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                                                if (placeholder) placeholder.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
                                        <i className='bi bi-image text-gray-400'></i>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">{product.name}</div>
                                        <div className="text-sm text-gray-500">{product.location || 'N/A'}</div>
                                    </div>
                                </div>
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
                        );
                    })
                )}
                )}
            </tbody>
        </table>
        </div>        </div>        )}

        {/* Edit modal window */}
        <div className={showEditModal?'flex w-full h-screen justify-center overflow-y-auto items-center fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn':'hidden overflow-hidden'}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-8 animate-slideUp">
                <div className="bg-gradient-to-r from-[#78C726] to-[#5fa51f] p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                            <i className='bi bi-pencil-square'></i>
                            Edit Product
                        </h2>
                        <button onClick={()=>setShowEditModal(false)} className='text-white hover:bg-white/20 rounded-full p-2 transition-all'>
                            <i className='bi bi-x-lg text-xl'></i>
                        </button>
                    </div>
                    <p className="text-white/90 mt-2">Make changes to the product details</p>
                </div>
                <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className='block text-sm font-semibold text-gray-700 mb-2'>Product Name *</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder='Enter product name' 
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all' 
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className='block text-sm font-semibold text-gray-700 mb-2'>Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder='Enter product description'
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all resize-none'
                            rows={4}
                        ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category_id" className='block text-sm font-semibold text-gray-700 mb-2'>Category *</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="price" className='block text-sm font-semibold text-gray-700 mb-2'>Price *</label>
                            <input 
                                type="number" 
                                step="0.01"
                                name="price" 
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder='0.00' 
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="quantity" className='block text-sm font-semibold text-gray-700 mb-2'>Quantity *</label>
                            <input 
                                type="number" 
                                name="quantity" 
                                value={formData.quantity}
                                onChange={handleInputChange}
                                placeholder='Enter quantity' 
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className='block text-sm font-semibold text-gray-700 mb-2'>Location</label>
                            <input 
                                type="text" 
                                name="location" 
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder='Enter location' 
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="status" className='block text-sm font-semibold text-gray-700 mb-2'>Status</label>
                            <select 
                                name="status" 
                                value={formData.status}
                                onChange={handleInputChange}
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                            >
                                <option value="ACTIF">Active</option>
                                <option value="INACTIF">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="image" className='block text-sm font-semibold text-gray-700 mb-2'>Product Image</label>
                        <div className="space-y-3">
                            {(imagePreview || formData.image) && (
                                <div className="relative w-32 h-32 mx-auto">
                                    <img 
                                        src={imagePreview || formData.image} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover rounded-xl border-2 border-[#78C726]" 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { setImageFile(null); setImagePreview(''); setFormData({...formData, image: ''}); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                    >
                                        <i className="bi bi-x text-sm"></i>
                                    </button>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <label className="flex-1 cursor-pointer">
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#78C726] transition-all">
                                        <i className="bi bi-cloud-upload text-2xl text-gray-400"></i>
                                        <p className="text-sm text-gray-600 mt-2">Click to upload new image</p>
                                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="text-center text-sm text-gray-500">OR</div>
                            <input 
                                type="text" 
                                name="image" 
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder='Enter image URL' 
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button" 
                            onClick={()=> { setShowEditModal(false); resetForm(); }} 
                            className='flex-1 border-2 border-gray-300 text-gray-700 rounded-xl px-6 py-3 hover:bg-gray-100 transition-all font-semibold'
                        >
                            <i className='bi bi-x-circle mr-2'></i>
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={uploading}
                            className='flex-1 bg-[#78C726] text-white rounded-xl px-6 py-3 hover:bg-[#5fa51f] transition-all font-semibold shadow-lg disabled:bg-gray-400'
                        >
                            <i className={`bi ${uploading ? 'bi-hourglass-split' : 'bi-check-circle'} mr-2`}></i>
                            {uploading ? 'Uploading...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* View modal window */}
        <div className={showViewModal?'flex w-full h-screen justify-center overflow-y-auto items-center fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn':'hidden overflow-hidden'}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-8 animate-slideUp">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                            <i className='bi bi-eye'></i>
                            Product Details
                        </h2>
                        <button onClick={()=>setShowViewModal(false)} className='text-white hover:bg-white/20 rounded-full p-2 transition-all'>
                            <i className='bi bi-x-lg text-xl'></i>
                        </button>
                    </div>
                </div>
                {selectedProduct && (
                    <div className="p-6 space-y-4">
                        {selectedProduct.image && (
                            <div className="bg-gray-50 p-4 rounded-xl mb-4">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Product Image</label>
                                <img 
                                    src={selectedProduct.image.startsWith('http') ? selectedProduct.image : `http://localhost:5000${selectedProduct.image}`}
                                    alt={selectedProduct.name}
                                    className="w-full max-h-64 object-contain rounded-lg border-2 border-gray-200"
                                    onError={(e) => {
                                        console.error('Failed to load product image in modal:', selectedProduct.image);
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Product Name</label>
                                <p className='text-gray-800 font-medium mt-1'>{selectedProduct.name}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Category</label>
                                <p className='text-gray-800 font-medium mt-1'>{selectedProduct.category?.name || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Price</label>
                                <p className='text-green-600 font-bold text-lg mt-1'>${selectedProduct.price || '0.00'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Quantity</label>
                                <p className='text-gray-800 font-medium mt-1'>{selectedProduct.quantity || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Location</label>
                                <p className='text-gray-800 font-medium mt-1'>{selectedProduct.location || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                                <p className='mt-1'>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        selectedProduct.status === 'ACTIF' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {selectedProduct.status || 'N/A'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                            <p className='text-gray-800 mt-2 leading-relaxed'>{selectedProduct.description || 'No description'}</p>
                        </div>
                    </div>
                )}
                <div className="p-6 bg-gray-50 rounded-b-2xl">
                    <button 
                        onClick={()=>setShowViewModal(false)} 
                        className='w-full bg-gray-600 text-white rounded-xl px-6 py-3 hover:bg-gray-700 transition-all font-semibold shadow-lg'
                    >
                        <i className='bi bi-x-circle mr-2'></i>
                        Close
                    </button>
                </div>
            </div>
        </div>
        
        {/* Add product modal window */}
        <div className={showAddModal?'flex w-full h-screen justify-center overflow-y-auto items-center fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn':'hidden overflow-hidden'}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-8 animate-slideUp">
                <div className="bg-gradient-to-r from-[#78C726] to-[#5fa51f] p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                            <i className='bi bi-plus-circle'></i>
                            Add New Product
                        </h2>
                        <button onClick={() => { setShowAddModal(false); resetForm(); }} className='text-white hover:bg-white/20 rounded-full p-2 transition-all'>
                            <i className='bi bi-x-lg text-xl'></i>
                        </button>
                    </div>
                </div>
                <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className='block text-sm font-semibold text-gray-700 mb-2'>Product Name *</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder='Enter product name' 
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all' 
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className='block text-sm font-semibold text-gray-700 mb-2'>Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder='Enter product description'
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all resize-none'
                            rows={4}
                        ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category_id" className='block text-sm font-semibold text-gray-700 mb-2'>Category *</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="price" className='block text-sm font-semibold text-gray-700 mb-2'>Price *</label>
                            <input 
                                type="number" 
                                step="0.01"
                                name="price" 
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder='0.00' 
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="quantity" className='block text-sm font-semibold text-gray-700 mb-2'>Quantity *</label>
                            <input 
                                type="number" 
                                name="quantity" 
                                value={formData.quantity}
                                onChange={handleInputChange}
                                placeholder='Enter quantity' 
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className='block text-sm font-semibold text-gray-700 mb-2'>Location</label>
                            <input 
                                type="text" 
                                name="location" 
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder='Enter location' 
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="image" className='block text-sm font-semibold text-gray-700 mb-2'>Product Image</label>
                        <div className="space-y-3">
                            {imagePreview && (
                                <div className="relative w-32 h-32 mx-auto">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl border-2 border-[#78C726]" />
                                    <button
                                        type="button"
                                        onClick={() => { setImageFile(null); setImagePreview(''); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                    >
                                        <i className="bi bi-x text-sm"></i>
                                    </button>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <label className="flex-1 cursor-pointer">
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#78C726] transition-all">
                                        <i className="bi bi-cloud-upload text-2xl text-gray-400"></i>
                                        <p className="text-sm text-gray-600 mt-2">Click to upload image</p>
                                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="text-center text-sm text-gray-500">OR</div>
                            <input 
                                type="text" 
                                name="image" 
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder='Enter image URL' 
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button" 
                            onClick={() => { setShowAddModal(false); resetForm(); }}
                            className='flex-1 border-2 border-gray-300 text-gray-700 rounded-xl px-6 py-3 hover:bg-gray-100 transition-all font-semibold'
                        >
                            <i className='bi bi-x-circle mr-2'></i>
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={uploading}
                            className='flex-1 bg-[#78C726] text-white rounded-xl px-6 py-3 hover:bg-[#5fa51f] transition-all font-semibold shadow-lg disabled:bg-gray-400'
                        >
                            <i className={`bi ${uploading ? 'bi-hourglass-split' : 'bi-plus-circle'} mr-2`}></i>
                            {uploading ? 'Uploading...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Delete modal window */}
        <div className={deleteModal?'flex w-full h-screen justify-center overflow-hidden items-center fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn':'hidden overflow-hidden'}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slideUp">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                            <i className='bi bi-exclamation-triangle'></i>
                            Delete Product
                        </h2>
                        <button onClick={()=>setDeleteModal(false)} className='text-white hover:bg-white/20 rounded-full p-2 transition-all'>
                            <i className='bi bi-x-lg text-xl'></i>
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
                        <p className="text-gray-800 font-semibold mb-2">Are you sure you want to delete this product?</p>
                        <p className="text-gray-600 text-sm">Product: <span className="font-semibold text-red-600">"{selectedProduct?.name || 'this product'}"</span></p>
                        <p className="text-gray-600 text-sm mt-2">This action cannot be undone.</p>
                    </div>
                </div>
                <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl">
                    <button 
                        onClick={()=>setDeleteModal(false)} 
                        className='flex-1 border-2 border-gray-300 text-gray-700 rounded-xl px-6 py-3 hover:bg-gray-100 transition-all font-semibold'
                    >
                        <i className='bi bi-x-circle mr-2'></i>
                        Cancel
                    </button>
                    <button 
                        onClick={handleDelete} 
                        className='flex-1 bg-red-500 text-white rounded-xl px-6 py-3 hover:bg-red-600 transition-all font-semibold shadow-lg'
                    >
                        <i className='bi bi-trash mr-2'></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </FarmerDashboardLayout>
  )
}

export default FarmerProducts