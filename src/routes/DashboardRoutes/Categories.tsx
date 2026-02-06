import React from 'react'
import DashboardLayout from '../../components/general/DashboardLayout'
import axios from 'axios';
import { BACKEND_URL } from '../../global';

const Categories = () => {
    const [categories, setCategories] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState<any | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [formData, setFormData] = React.useState({
        name: '',
        description: ''
    });

    React.useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/categories`);
            const data = Array.isArray(response.data.content) ? response.data.content : [];
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${BACKEND_URL}/categories`, formData);
            alert('Category added successfully!');
            setShowAddModal(false);
            resetForm();
            fetchCategories();
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category');
        }
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategory) return;
        try {
            await axios.put(`${BACKEND_URL}/categories/${selectedCategory.id}`, formData);
            alert('Category updated successfully!');
            setShowEditModal(false);
            resetForm();
            fetchCategories();
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Failed to update category');
        }
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;
        try {
            await axios.delete(`${BACKEND_URL}/categories/${selectedCategory.id}`);
            alert('Category deleted successfully!');
            setDeleteModal(false);
            setSelectedCategory(null);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    };

    const handleEditClick = (category: any) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name || '',
            description: category.description || ''
        });
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({ name: '', description: '' });
        setSelectedCategory(null);
    };

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            fetchCategories();
            return;
        }
        const filtered = categories.filter(cat => 
            cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCategories(filtered);
    };

    const filteredCategories = searchTerm 
        ? categories.filter(cat => cat.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        : categories;
    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className='font-bold text-2xl'>Category Management</h1>
                    <p className='text-gray-600'>Review and manage all categories</p>
                </div>
                <button onClick={() => { resetForm(); setShowAddModal(true); }} className='bg-[#78C726] text-white rounded-lg px-4 py-2 flex items-center gap-2'>
                    <i className='bi bi-plus-circle'></i>
                    Add New Category
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <input type="text" placeholder='Search categories...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='flex-1 border border-gray-300 rounded-lg p-3'/>
                <button onClick={handleSearch} className='bg-[#90C955] text-white rounded-lg px-6 py-3'>
                    <i className='bi bi-search mr-2'></i>Search
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                    <p className='ml-4'>Loading categories...</p>
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                    <i className='bi bi-folder2-open text-6xl text-gray-300'></i>
                    <p className="text-gray-500 text-lg mt-4">No categories found</p>
                    <p className="text-gray-400">Click "Add New Category" to create one</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map(category => (
                        <div key={category.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-[#90C955] transition-all hover:shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#E6F2D9] rounded-full flex items-center justify-center">
                                        <i className='bi bi-folder2-open text-2xl text-[#78C726]'></i>
                                    </div>
                                    <div>
                                        <h3 className='font-bold text-lg text-gray-800'>{category.name}</h3>
                                        <p className='text-sm text-gray-500'>Category ID: #{category.id}</p>
                                    </div>
                                </div>
                                <span className='bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-semibold'>
                                    Active
                                </span>
                            </div>
                            <div className="space-y-3 mb-4">
                                <div className="flex items-start gap-2">
                                    <i className='bi bi-info-circle-fill text-[#78C726] mt-1'></i>
                                    <div>
                                        <p className='text-xs text-gray-500'>Description</p>
                                        <p className='text-sm text-gray-700'>{category.description || 'No description available'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex gap-2 pt-4 border-t border-gray-200'>
                                <button 
                                    onClick={() => handleEditClick(category)} 
                                    className='flex-1 bg-[#78C726] text-white rounded-lg py-2 hover:bg-[#6ab31f] transition-colors flex items-center justify-center gap-2'
                                >
                                    <i className='bi bi-pencil'></i>
                                    Edit
                                </button>
                                <button 
                                    onClick={() => { setSelectedCategory(category); setDeleteModal(true); }} 
                                    className='flex-1 bg-[#DF6B57] text-white rounded-lg py-2 hover:bg-[#c95d4a] transition-colors flex items-center justify-center gap-2'
                                >
                                    <i className='bi bi-trash'></i>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slideUp">
                        <div className="bg-gradient-to-r from-[#78C726] to-[#90C955] p-6 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                                    <i className='bi bi-plus-circle'></i>
                                    Add Category
                                </h2>
                                <button onClick={()=>setShowAddModal(false)} type="button" className='text-white hover:bg-white/20 rounded-full p-2 transition-all'>
                                    <i className='bi bi-x-lg text-xl'></i>
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleAddCategory}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Category Name *</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleInputChange} 
                                        className='w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#90C955] focus:outline-none transition-all' 
                                        placeholder="Enter category name"
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Description (Optional)</label>
                                    <textarea 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleInputChange} 
                                        className='w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#90C955] focus:outline-none transition-all resize-none' 
                                        rows={3}
                                        placeholder="Add category description..."
                                    />
                                </div>
                            </div>
                            <div className='flex gap-3 p-6 bg-gray-50 rounded-b-2xl'>
                                <button 
                                    type="button"
                                    onClick={()=>setShowAddModal(false)} 
                                    className='flex-1 border-2 border-gray-300 text-gray-700 rounded-xl px-6 py-3 hover:bg-gray-100 transition-all font-semibold'
                                >
                                    <i className='bi bi-x-circle mr-2'></i>
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className='flex-1 bg-[#78C726] text-white rounded-xl px-6 py-3 hover:bg-[#6ab31f] transition-all font-semibold shadow-lg'
                                >
                                    <i className='bi bi-check-circle mr-2'></i>
                                    Add Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slideUp">
                        <div className="bg-gradient-to-r from-[#78C726] to-[#90C955] p-6 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                                    <i className='bi bi-pencil-square'></i>
                                    Edit Category
                                </h2>
                                <button onClick={()=>setShowEditModal(false)} type="button" className='text-white hover:bg-white/20 rounded-full p-2 transition-all'>
                                    <i className='bi bi-x-lg text-xl'></i>
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleUpdateCategory}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Category Name *</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleInputChange} 
                                        className='w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#90C955] focus:outline-none transition-all' 
                                        placeholder="Enter category name"
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Description (Optional)</label>
                                    <textarea 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleInputChange} 
                                        className='w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#90C955] focus:outline-none transition-all resize-none' 
                                        rows={3}
                                        placeholder="Add category description..."
                                    />
                                </div>
                            </div>
                            <div className='flex gap-3 p-6 bg-gray-50 rounded-b-2xl'>
                                <button 
                                    type="button"
                                    onClick={()=>setShowEditModal(false)} 
                                    className='flex-1 border-2 border-gray-300 text-gray-700 rounded-xl px-6 py-3 hover:bg-gray-100 transition-all font-semibold'
                                >
                                    <i className='bi bi-x-circle mr-2'></i>
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className='flex-1 bg-[#78C726] text-white rounded-xl px-6 py-3 hover:bg-[#6ab31f] transition-all font-semibold shadow-lg'
                                >
                                    <i className='bi bi-check-circle mr-2'></i>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slideUp">
                        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                                    <i className='bi bi-exclamation-triangle'></i>
                                    Delete Category
                                </h2>
                                <button onClick={() => { setDeleteModal(false); setSelectedCategory(null); }} className='text-white hover:bg-white/20 rounded-full p-2 transition-all'>
                                    <i className='bi bi-x-lg text-xl'></i>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
                                <p className="text-gray-800 font-semibold mb-2">Are you sure you want to delete this category?</p>
                                <p className="text-gray-600 text-sm">Category: <span className="font-semibold text-red-600">"{selectedCategory?.name || 'this category'}"</span></p>
                                <p className="text-gray-600 text-sm mt-2">This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl">
                            <button 
                                onClick={() => { setDeleteModal(false); setSelectedCategory(null); }} 
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
            )}
        </DashboardLayout>
    );
}

export default Categories;