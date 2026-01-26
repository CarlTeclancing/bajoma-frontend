import React from 'react'
import DashboardLayout from '../../components/general/DashboardLayout'
import axios from 'axios';

const Farms = () => {
    const [farms, setFarms] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [selectedFarm, setSelectedFarm] = React.useState<any | null>(null);
    const [editForm, setEditForm] = React.useState<any>({});
    const [addForm, setAddForm] = React.useState<any>({});

    React.useEffect(() => {
        fetchFarms();
    }, []);

    const fetchFarms = () => {
        axios.get('http://localhost:5000/api/v1/farm')
            .then(res => {
                const data = Array.isArray(res.data.content) ? res.data.content : [];
                setFarms(data);
                setLoading(false);
            })
            .catch(() => {
                setFarms([]);
                setLoading(false);
            });
    };

    const handleEdit = (farm: any) => {
        setSelectedFarm(farm);
        setEditForm({ ...farm });
        setShowEditModal(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSave = () => {
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

    const handleAddSave = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/v1/farm', addForm)
            .then(() => {
                fetchFarms();
                setShowAddModal(false);
                setAddForm({});
            })
            .catch(() => alert('Failed to add farm'));
    };

    return (
        <DashboardLayout>
            <h1 className='font-bold text-2xl'>Farm Management</h1>
            <p>Review and manage all registered farms</p>
            <div className="flex full">
                <div className="flex">
                    <input type="text" placeholder='Search farms...' className='border border-gray-300 rounded p-2 m-2 w-64'/>
                    <button className='bg-[#90C955] text-white rounded p-2 m-2'><i className='bi bi-search m-2'></i>Search</button>
                </div>
                <div className="flex ml-auto">
                    <button onClick={()=>setShowAddModal(true)} className='bg-[#78C726] text-white rounded p-2 m-2'><i className='bi bi-plus-circle m-1'></i>Add New Farm</button>
                </div>
            </div>
            <div className="flex justify-end mt-12 w-full">
                <button className='border border-[#90C955] text-[#90C955] rounded p-2 m-2'> <i className='bi bi-filter'></i> Filter</button>
            </div>
            {loading ? (
                <div className="mt-4">Loading farms...</div>
            ) : (
            <table className='w-full border-collapse border border-gray-300 mt-4'>
                <thead>
                    <tr>
                        <th className='border border-gray-300 p-2'>Farm Name</th>
                        <th className='border border-gray-300 p-2'>Location</th>
                        <th className='border border-gray-300 p-2'>Size (acres)</th>
                        <th className='border border-gray-300 p-2'>Owner</th>
                        <th className='border border-gray-300 p-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {farms.map(farm => (
                        <tr key={farm.id}>
                            <td className='border border-gray-300 p-2'>{farm.name}</td>
                            <td className='border border-gray-300 p-2'>{farm.location}</td>
                            <td className='border border-gray-300 p-2'>{farm.size}</td>
                            <td className='border border-gray-300 p-2'>{farm.user?.name || 'N/A'}</td>
                            <td className='border border-gray-300 p-2'>
                                <div className='flex justify-end gap-2'>
                                    <button onClick={()=>handleEdit(farm)} className='bg-[#78C726] text-white rounded p-2'><i className='bi bi-pencil'></i></button>
                                    <button onClick={()=>handleDelete(farm.id)} className='bg-[#DF6B57] text-white rounded p-2'><i className='bi bi-trash'></i></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
