import React from 'react'
import DashboardLayout from '../../components/general/DashboardLayout'
import axios from 'axios';
import type { Farm, FarmCreateInput } from '../../types/types.tsx';


//interface FarmUpdateInput extends Partial<FarmCreateInput> {}

const Farms = () => {
    const [farms, setFarms] = React.useState<Farm[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
    const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
    const [selectedFarm, setSelectedFarm] = React.useState<Farm | null>(null);
    const [editForm, setEditForm] = React.useState<FarmCreateInput>({ name: '', location: '', size: '' });
    const [addForm, setAddForm] = React.useState<FarmCreateInput>({ name: '', location: '', size: '' });



    const fetchFarms = () => {
        axios.get('http://localhost:5000/api/v1/farm')
            .then(res => {
                const data = Array.isArray(res.data.content) ? (res.data.content as Farm[]) : [];
                setFarms(data);
                setLoading(false);
            })
            .catch(() => {
                setFarms([]);
                setLoading(false);
            });
    };

        React.useEffect(() => {
        fetchFarms();
    }, []);


    const handleEdit = (farm: Farm) => {
        setSelectedFarm(farm);
        // Only copy editable fields
        setEditForm({ name: farm.name, location: farm.location, size: farm.size });
        setShowEditModal(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSave = () => {
        if (!selectedFarm) return;
        axios.put(`http://localhost:5000/api/v1/farm/${selectedFarm.id}`, editForm)
            .then(() => {
                fetchFarms();
                setShowEditModal(false);
                setSelectedFarm(null);
            })
            .catch(() => alert('Failed to update farm'));
    };

    const handleDelete = (id: number) => {
        if (!window.confirm('Are you sure you want to delete this farm?')) return;
        axios.delete(`http://localhost:5000/api/v1/farm/${id}`)
            .then(() => fetchFarms())
            .catch(() => alert('Failed to delete farm'));
    };

    const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAddForm({ ...addForm, [e.target.name]: e.target.value });
    };

    const handleAddSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/v1/farm', addForm)
            .then(() => {
                fetchFarms();
                setShowAddModal(false);
                setAddForm({ name: '', location: '', size: '' });
            })
            .catch(() => alert('Failed to add farm'));
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className='font-bold text-2xl'>Farm Management</h1>
                    <p className='text-gray-600'>Review and manage all registered farms</p>
                </div>
                <button onClick={()=>setShowAddModal(true)} className='bg-[#78C726] text-white rounded-lg px-4 py-2 flex items-center gap-2'>
                    <i className='bi bi-plus-circle'></i>
                    Add New Farm
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <input type="text" placeholder='Search farms...' className='flex-1 border border-gray-300 rounded-lg p-3'/>
                <button className='bg-[#90C955] text-white rounded-lg px-6 py-3'>
                    <i className='bi bi-search mr-2'></i>Search
                </button>
                <button className='border border-[#90C955] text-[#90C955] rounded-lg px-6 py-3'>
                    <i className='bi bi-filter mr-2'></i>Filter
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                    <p className='ml-4'>Loading farms...</p>
                </div>
            ) : farms.length === 0 ? (
                <div className="text-center py-12">
                    <i className='bi bi-house-door text-6xl text-gray-300'></i>
                    <p className="text-gray-500 text-lg mt-4">No farms registered yet</p>
                    <p className="text-gray-400">Click "Add New Farm" to register a farm</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {farms.map(farm => (
                        <div key={farm.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-[#90C955] transition-all hover:shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#E6F2D9] rounded-full flex items-center justify-center">
                                        <i className='bi bi-house-door text-2xl text-[#78C726]'></i>
                                    </div>
                                    <div>
                                        <h3 className='font-bold text-lg text-gray-800'>{farm.name}</h3>
                                        <p className='text-sm text-gray-500'>Farm ID: #{farm.id}</p>
                                    </div>
                                </div>
                                <span className='bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-semibold'>
                                    Active
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-start gap-2">
                                    <i className='bi bi-geo-alt-fill text-[#78C726] mt-1'></i>
                                    <div>
                                        <p className='text-xs text-gray-500'>Location</p>
                                        <p className='text-sm font-semibold text-gray-700'>{farm.location || 'Not specified'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <i className='bi bi-rulers text-[#78C726] mt-1'></i>
                                    <div>
                                        <p className='text-xs text-gray-500'>Farm Size</p>
                                        <p className='text-sm font-semibold text-gray-700'>{farm.size ? `${farm.size} acres` : 'Not specified'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <i className='bi bi-person-fill text-[#78C726] mt-1'></i>
                                    <div>
                                        <p className='text-xs text-gray-500'>Owner</p>
                                        <p className='text-sm font-semibold text-gray-700'>{farm.user?.name || 'Not assigned'}</p>
                                        {farm.user?.email && (
                                            <p className='text-xs text-gray-500'>{farm.user.email}</p>
                                        )}
                                    </div>
                                </div>

                                {farm.user?.phone && (
                                    <div className="flex items-start gap-2">
                                        <i className='bi bi-telephone-fill text-[#78C726] mt-1'></i>
                                        <div>
                                            <p className='text-xs text-gray-500'>Contact</p>
                                            <p className='text-sm font-semibold text-gray-700'>{farm.user.phone}</p>
                                        </div>
                                    </div>
                                )}

                                {farm.description && (
                                    <div className="flex items-start gap-2">
                                        <i className='bi bi-info-circle-fill text-[#78C726] mt-1'></i>
                                        <div>
                                            <p className='text-xs text-gray-500'>Description</p>
                                            <p className='text-sm text-gray-700'>{farm.description}</p>
                                        </div>
                                    </div>
                                )}

                                {farm.createdAt && (
                                    <div className="flex items-start gap-2">
                                        <i className='bi bi-calendar-check text-[#78C726] mt-1'></i>
                                        <div>
                                            <p className='text-xs text-gray-500'>Registered</p>
                                            <p className='text-sm text-gray-700'>
                                                {new Date(farm.createdAt).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='flex gap-2 pt-4 border-t border-gray-200'>
                                <button 
                                    onClick={()=>handleEdit(farm)} 
                                    className='flex-1 bg-[#78C726] text-white rounded-lg py-2 hover:bg-[#6ab31f] transition-colors flex items-center justify-center gap-2'
                                >
                                    <i className='bi bi-pencil'></i>
                                    Edit
                                </button>
                                <button 
                                    onClick={()=>handleDelete(farm.id)} 
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

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 z-50" style={{backdropFilter: 'blur(2px)'}}>
                    <div className="bg-white p-6 rounded shadow-lg w-[400px]">
                        <h2 className='text-xl font-bold mb-4'>Edit Farm</h2>
                        <label className='block mb-2'>Name
                            <input type="text" name="name" value={editForm.name || ''} onChange={handleEditChange} className='w-full p-2 border rounded mb-2' />
                        </label>
                        <label className='block mb-2'>Location
                            <input type="text" name="location" value={editForm.location || ''} onChange={handleEditChange} className='w-full p-2 border rounded mb-2' />
                        </label>
                        <label className='block mb-2'>Size (acres)
                            <input type="number" name="size" value={editForm.size || ''} onChange={handleEditChange} className='w-full p-2 border rounded mb-2' />
                        </label>
                        <div className='flex justify-end gap-2 mt-4'>
                            <button className='bg-gray-300 text-black rounded p-2' onClick={()=>setShowEditModal(false)}>Cancel</button>
                            <button className='bg-[#78C726] text-white rounded p-2' onClick={handleEditSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 z-50" style={{backdropFilter: 'blur(2px)'}}>
                    <div className="bg-white p-6 rounded shadow-lg w-[400px]">
                        <h2 className='text-xl font-bold mb-4'>Add Farm</h2>
                        <form onSubmit={handleAddSave}>
                            <label className='block mb-2'>Name
                                <input type="text" name="name" value={addForm.name || ''} onChange={handleAddChange} className='w-full p-2 border rounded mb-2' required />
                            </label>
                            <label className='block mb-2'>Location
                                <input type="text" name="location" value={addForm.location || ''} onChange={handleAddChange} className='w-full p-2 border rounded mb-2' required />
                            </label>
                            <label className='block mb-2'>Size (acres)
                                <input type="number" name="size" value={addForm.size || ''} onChange={handleAddChange} className='w-full p-2 border rounded mb-2' required />
                            </label>
                            <div className='flex justify-end gap-2 mt-4'>
                                <button className='bg-gray-300 text-black rounded p-2' onClick={()=>setShowAddModal(false)} type="button">Cancel</button>
                                <button className='bg-[#78C726] text-white rounded p-2' type="submit">Add Farm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default Farms
