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
      <h1 className='text-2xl font-bold'>All Categories</h1>
        <p>Add and manage all categories</p>
        <div className="flex full">
            <div className="flex">
                <input 
                    type="text" 
                    placeholder='Search categories...' 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='border border-gray-300 rounded p-2 m-2 w-64'
                />
                <button onClick={handleSearch} className='bg-[#90C955] text-white rounded p-2 m-2'><i className='bi bi-search m-2'></i>Search</button>
            </div>
            <div className="flex ml-auto">
                <button onClick={() => { resetForm(); setShowAddModal(true); }} className='bg-[#78C726] text-white rounded p-2 m-2'><i className='bi bi-plus-circle m-1'></i>Add New Category</button>
            </div>
        </div>

        {loading ? (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                <p className='mt-4 text-gray-600'>Loading categories...</p>
            </div>
        ) : (
        <div className="flex w-full flex-wrap mt-2 gap-4 p-6 ">
          {filteredCategories.length === 0 ? (
            <div className="w-full text-center py-12 text-gray-500">
                No categories found. Add your first category to get started!
            </div>
          ) : (
            filteredCategories.map(category => (
              <div key={category.id} className="flex flex-col w-[250px] p-4 bg-white rounded-lg shadow-lg">
                <i className='bi bi-folder2-open text-2xl mb-4 text-[#78C726]'></i>
                <h3 className='text-[1rem] mb-2 font-bold'>{category.name}</h3>
                <p className='text-justify line-clamp-4'>{category.description || 'No description available'}</p>
                <div className='border border-gray-300 p-2 flex justify-end w-full rounded-lg mt-4'>
                    <button onClick={() => handleEditClick(category)} className='bg-[#78C726] text-white rounded p-2 m-2'><i className='bi bi-pencil m-2'></i></button>
                    <button onClick={() => { setSelectedCategory(category); setDeleteModal(true); }} className='bg-[#DF6B57] text-white rounded p-2 m-2'><i className='bi bi-trash m-2'></i></button>
                </div>
              </div>
            ))
          )}
        </div>
        )}

        {/* add Category modal window */}
        <div className={showAddModal?'flex w-full h-screen justify-center overflow-y-scroll items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <button 
            onClick={() => { setShowAddModal(false); resetForm(); }}
            className='p-2 border border-[white] bg-white cursor-pointer rounded absolute top-4 right-4'><i className='bi bi-x font-bold text-2xl text-black'></i></button>
            <div className="flex w-[60%] h-auto border border-gray-300 rounded mt-6 p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Add New Category</h1>
                <form onSubmit={handleAddCategory} className="flex flex-col w-fill p-4 mt-12">
                        <label htmlFor="name">Category Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder='category name' 
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
                            
                        <button type="submit" className='bg-[#78C726] text-white rounded p-2 mt-4 float-end'>Create Category</button>
                </form>
            </div>
        </div>
        {/* edit Category modal window */}
        <div className={showEditModal?'flex w-full h-screen justify-center overflow-y-scroll items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <button 
            onClick={() => { setShowEditModal(false); resetForm(); }}
            className='p-2 border border-[white] bg-white cursor-pointer rounded absolute top-4 right-4'><i className='bi bi-x font-bold text-2xl text-black'></i></button>
            <div className="flex w-[60%] h-auto border border-gray-300 rounded mt-6 p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Edit Category</h1>
                <form onSubmit={handleUpdateCategory} className="flex flex-col w-fill p-4 mt-12">
                        <label htmlFor="name">Category Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder='category name' 
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
                            
                        <button type="submit" className='bg-[#78C726] text-white rounded p-2 mt-4 float-end'>Save Changes</button>
                </form>
            </div>
        </div>

        {/* Delete modal window */}
        <div className={deleteModal?'flex w-full h-screen justify-center overflow-hidden items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <div className="flex w-[40%] z-50 h-auto border border-gray-300 rounded p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Delete Category?</h1>
                <p>This will permanently delete "{selectedCategory?.name || 'this category'}". This action cannot be undone.</p>
                <div className="flex">
                    <button onClick={() => { setDeleteModal(false); setSelectedCategory(null); }} className='bg-none border border-[#78C726] text-[#78C726] rounded p-2 m-2'>No</button>
                    <button onClick={handleDelete} className='bg-[#DF6B57] text-white rounded p-2 m-2'>Yes</button>
                </div>
            </div>
        </div>
        
    </DashboardLayout>
  )
}

export default Categories