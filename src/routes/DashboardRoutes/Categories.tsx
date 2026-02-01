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
                <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 z-50" style={{backdropFilter: 'blur(2px)'}}>
                    <div className="bg-white p-6 rounded shadow-lg w-[400px]">
                        <h2 className='text-xl font-bold mb-4'>Add Category</h2>
                        <form onSubmit={handleAddCategory}>
                            <label className='block mb-2'>Name
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className='w-full p-2 border rounded mb-2' required />
                            </label>
                            <label className='block mb-2'>Description
                                <textarea name="description" value={formData.description} onChange={handleInputChange} className='w-full p-2 border rounded mb-2' />
                            </label>
                            <div className='flex justify-end gap-2 mt-4'>
                                <button className='bg-gray-300 text-black rounded p-2' onClick={()=>setShowAddModal(false)} type="button">Cancel</button>
                                <button className='bg-[#78C726] text-white rounded p-2' type="submit">Add Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 z-50" style={{backdropFilter: 'blur(2px)'}}>
                    <div className="bg-white p-6 rounded shadow-lg w-[400px]">
                        <h2 className='text-xl font-bold mb-4'>Edit Category</h2>
                        <form onSubmit={handleUpdateCategory}>
                            <label className='block mb-2'>Name
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className='w-full p-2 border rounded mb-2' required />
                            </label>
                            <label className='block mb-2'>Description
                                <textarea name="description" value={formData.description} onChange={handleInputChange} className='w-full p-2 border rounded mb-2' />
                            </label>
                            <div className='flex justify-end gap-2 mt-4'>
                                <button className='bg-gray-300 text-black rounded p-2' onClick={()=>setShowEditModal(false)} type="button">Cancel</button>
                                <button className='bg-[#78C726] text-white rounded p-2' type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 z-50" style={{backdropFilter: 'blur(2px)'}}>
                    <div className="bg-white p-6 rounded shadow-lg w-[400px]">
                        <h2 className='text-xl font-bold mb-4'>Delete Category?</h2>
                        <p>This will permanently delete "{selectedCategory?.name || 'this category'}". This action cannot be undone.</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button className='bg-gray-300 text-black rounded p-2' onClick={() => { setDeleteModal(false); setSelectedCategory(null); }}>Cancel</button>
                            <button className='bg-[#DF6B57] text-white rounded p-2' onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default Categories;