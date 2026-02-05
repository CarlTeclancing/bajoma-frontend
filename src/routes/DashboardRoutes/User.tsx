import React from 'react'
import DashboardLayout from '../../components/general/DashboardLayout'
import axios from 'axios';
import { BACKEND_URL } from '../../global';

const User = () => {
    const [users, setUsers] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState('all');
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [viewModal, setViewModal] = React.useState(false);
    const [editModal, setEditModal] = React.useState(false);
    const [addModal, setAddModal] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<any | null>(null);
    const [editForm, setEditForm] = React.useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        account_type: ''
    });
    const [addForm, setAddForm] = React.useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        account_type: '',
        password: ''
    });
    const [showQuickStats, setShowQuickStats] = React.useState(() => {
        const saved = localStorage.getItem('showQuickStats');
        return saved !== null ? JSON.parse(saved) : true;
    });

    React.useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/users`);
            const data = Array.isArray(response.data) ? response.data : [];
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            await axios.delete(`${BACKEND_URL}/users/${selectedUser.id}`);
            alert('User deleted successfully!');
            setDeleteModal(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setEditForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            account_type: user.account_type || ''
        });
        setEditModal(true);
    };

    const handleViewClick = (user: any) => {
        setSelectedUser(user);
        setViewModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!selectedUser) return;
        try {
            await axios.put(`${BACKEND_URL}/users/${selectedUser.id}`, editForm);
            alert('User updated successfully!');
            setEditModal(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddUser = async () => {
        if (!addForm.name || !addForm.email || !addForm.password || !addForm.account_type) {
            alert('Please fill in all required fields');
            return;
        }
        try {
            await axios.post(`${BACKEND_URL}/register`, addForm);
            alert('User added successfully!');
            setAddModal(false);
            setAddForm({ name: '', email: '', phone: '', address: '', account_type: '', password: '' });
            fetchUsers();
        } catch (error: any) {
            console.error('Error adding user:', error);
            alert(error.response?.data?.message || 'Failed to add user');
        }
    };

    const toggleQuickStats = () => {
        const newValue = !showQuickStats;
        setShowQuickStats(newValue);
        localStorage.setItem('showQuickStats', JSON.stringify(newValue));
    };

    const filteredUsers = filter === 'all' 
        ? users 
        : filter === 'farmer'
        ? users.filter(user => user.account_type?.toLowerCase() === 'seller' || user.account_type?.toLowerCase() === 'farmer')
        : filter === 'buyer'
        ? users.filter(user => user.account_type?.toLowerCase() === 'buyer' || user.account_type?.toLowerCase() === 'user')
        : users.filter(user => user.account_type?.toLowerCase() === filter.toLowerCase());

    const userCounts = {
        all: users.length,
        farmer: users.filter(u => u.account_type?.toLowerCase() === 'seller' || u.account_type?.toLowerCase() === 'farmer').length,
        buyer: users.filter(u => u.account_type?.toLowerCase() === 'buyer' || u.account_type?.toLowerCase() === 'user').length,
        admin: users.filter(u => u.account_type?.toLowerCase() === 'admin').length
    };

  return (
    <DashboardLayout
        showQuickStatsToggle={true}
        onToggleQuickStats={toggleQuickStats}
        quickStatsVisible={showQuickStats}
    >
        <div className="flex justify-between items-start mb-4">
            <div>
                <h1 className='text-2xl font-bold'>User Management</h1>
                <p className='text-gray-600'>View and manage all platform users</p>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={toggleQuickStats}
                    className='bg-gray-100 text-gray-700 rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-gray-200 border-2 border-gray-200 transition-all'
                >
                    <i className={`bi bi-${showQuickStats ? 'eye-slash' : 'eye'}`}></i>
                    {showQuickStats ? 'Hide' : 'Show'} Stats
                </button>
                <button
                    onClick={() => setAddModal(true)}
                    className='bg-[#78C726] text-white rounded-xl px-6 py-2 flex items-center gap-2 hover:bg-[#5fa51f] transition-all shadow-lg font-semibold'
                >
                    <i className='bi bi-plus-circle'></i>
                    Add User
                </button>
            </div>
        </div>

        {/* Stats Cards */}
        {showQuickStats && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                        <i className='bi bi-people text-2xl text-[#78C726]'></i>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>Total Users</p>
                        <h2 className='text-2xl font-bold text-gray-800'>{userCounts.all}</h2>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#E6F2D9] rounded-lg flex items-center justify-center">
                        <i className='bi bi-person-badge text-2xl text-[#78C726]'></i>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>Farmers</p>
                        <h2 className='text-2xl font-bold text-gray-800'>{userCounts.farmer}</h2>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#90C955] transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className='bi bi-cart text-2xl text-blue-600'></i>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>Buyers</p>
                        <h2 className='text-2xl font-bold text-gray-800'>{userCounts.buyer}</h2>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-amber-400 transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <i className='bi bi-shield-check text-2xl text-amber-600'></i>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>Admins</p>
                        <h2 className='text-2xl font-bold text-gray-800'>{userCounts.admin}</h2>
                    </div>
                </div>
            </div>
        </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
            <button 
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    filter === 'all' 
                        ? 'bg-[#78C726] text-white' 
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#90C955]'
                }`}
            >
                All Users ({userCounts.all})
            </button>
            <button 
                onClick={() => setFilter('farmer')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    filter === 'farmer' 
                        ? 'bg-[#78C726] text-white' 
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#90C955]'
                }`}
            >
                Farmers ({userCounts.farmer})
            </button>
            <button 
                onClick={() => setFilter('buyer')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    filter === 'buyer' 
                        ? 'bg-[#78C726] text-white' 
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#90C955]'
                }`}
            >
                Buyers ({userCounts.buyer})
            </button>
            <button 
                onClick={() => setFilter('admin')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    filter === 'admin' 
                        ? 'bg-[#78C726] text-white' 
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#90C955]'
                }`}
            >
                Admins ({userCounts.admin})
            </button>
            <button 
                onClick={fetchUsers}
                className='ml-auto bg-gray-100 text-gray-700 rounded-xl px-6 py-3 flex items-center gap-2 hover:bg-gray-200 border-2 border-gray-200'
            >
                <i className='bi bi-arrow-clockwise'></i>
                Refresh
            </button>
        </div>

        {/* Users Count */}
        <div className="mt-4">
            <p className='text-sm text-gray-600'>
                Showing <span className="font-semibold text-[#78C726]">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users
            </p>
        </div>

        {loading ? (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                <p className='mt-4 text-gray-600'>Loading users...</p>
            </div>
        ) : (
            <div className="bg-white rounded-2xl border-2 border-gray-200 mt-6 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className='w-full'>
                        <thead className='bg-[#E6F2D9]'>
                            <tr>
                                <th className='text-left p-4 font-semibold text-gray-800'>Name</th>
                                <th className='text-left p-4 font-semibold text-gray-800'>Contact</th>
                                <th className='text-left p-4 font-semibold text-gray-800'>Role</th>
                                <th className='text-left p-4 font-semibold text-gray-800'>Address</th>
                                <th className='text-center p-4 font-semibold text-gray-800'>Joined</th>
                                <th className='text-center p-4 font-semibold text-gray-800'>Orders</th>
                                <th className='text-center p-4 font-semibold text-gray-800'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className='p-12 text-center'>
                                        <i className='bi bi-people text-6xl text-gray-300'></i>
                                        <p className="text-gray-500 text-lg mt-4">No users found</p>
                                        <p className="text-gray-400">Try adjusting your filters</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr key={user.id} className={`hover:bg-[#E6F2D9] transition-all ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className='p-4'>
                                            <div className="flex items-center gap-3">
                                                {user.profileimg ? (
                                                    <img 
                                                        src={user.profileimg.startsWith('http') ? user.profileimg : `http://localhost:5000${user.profileimg}`} 
                                                        alt={user.name}
                                                        className='w-10 h-10 rounded-full object-cover border-2 border-[#78C726]'
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`w-10 h-10 bg-[#E6F2D9] rounded-full flex items-center justify-center ${user.profileimg ? 'hidden' : ''}`}>
                                                    <i className='bi bi-person text-[#78C726]'></i>
                                                </div>
                                                <div>
                                                    <div className='font-semibold text-gray-800'>{user.name || 'N/A'}</div>
                                                    <div className='text-sm text-gray-500'>ID: {user.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div>
                                                <div className='text-sm text-gray-800'>{user.email || 'N/A'}</div>
                                                <div className='text-sm text-gray-500'>{user.phone || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                user.account_type?.toLowerCase() === 'admin' ? 'bg-amber-100 text-amber-700' : 
                                                (user.account_type?.toLowerCase() === 'seller' || user.account_type?.toLowerCase() === 'farmer') ? 'bg-[#E6F2D9] text-[#78C726]' : 
                                                (user.account_type?.toLowerCase() === 'buyer' || user.account_type?.toLowerCase() === 'user') ? 'bg-blue-100 text-blue-700' : 
                                                'bg-gray-100 text-gray-700'
                                            } uppercase`}>
                                                {user.account_type ? (
                                                    user.account_type.toLowerCase() === 'seller' ? 'FARMER' : 
                                                    user.account_type.toLowerCase() === 'farmer' ? 'FARMER' :
                                                    user.account_type.toLowerCase() === 'buyer' ? 'BUYER' : 
                                                    user.account_type.toLowerCase() === 'user' ? 'BUYER' :
                                                    user.account_type.toUpperCase()
                                                ) : 'N/A'}
                                            </span>
                                        </td>
                                        <td className='p-4 text-sm text-gray-700'>{user.address || 'N/A'}</td>
                                        <td className='p-4 text-center text-sm text-gray-700'>
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className='p-4 text-center'>
                                            <span className='bg-[#E6F2D9] text-[#78C726] px-3 py-1 rounded-full font-semibold'>
                                                {user.ordersCount || 0}
                                            </span>
                                        </td>
                                        <td className='p-4'>
                                            <div className="flex gap-2 justify-center">
                                                <button 
                                                    onClick={() => handleViewClick(user)}
                                                    className='bg-blue-100 text-blue-700 rounded-lg p-2 hover:bg-blue-200 transition-colors'
                                                    title="View Details"
                                                >
                                                    <i className='bi bi-eye'></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleEditClick(user)}
                                                    className='bg-[#E6F2D9] text-[#78C726] rounded-lg p-2 hover:bg-[#d4e8c1] transition-colors'
                                                    title="Edit User"
                                                >
                                                    <i className='bi bi-pencil'></i>
                                                </button>
                                                <button 
                                                    onClick={() => { setSelectedUser(user); setDeleteModal(true); }}
                                                    className='bg-red-100 text-red-700 rounded-lg p-2 hover:bg-red-200 transition-colors'
                                                    title="Delete User"
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

        {/* View User Modal */}
        <div className={viewModal?'flex w-full h-screen justify-center overflow-y-auto items-center fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn':'hidden overflow-hidden'}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-8 animate-slideUp">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                            <i className='bi bi-eye'></i>
                            User Details
                        </h2>
                        <button onClick={() => { setViewModal(false); setSelectedUser(null); }} className='text-white hover:bg-white/20 rounded-full p-2 transition-all'>
                            <i className='bi bi-x-lg text-xl'></i>
                        </button>
                    </div>
                </div>
                {selectedUser && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Name</label>
                                <p className='text-gray-800 font-medium mt-1'>{selectedUser.name || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                                <p className='text-gray-800 font-medium mt-1'>{selectedUser.email || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                                <p className='text-gray-800 font-medium mt-1'>{selectedUser.phone || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Role</label>
                                <p className='text-gray-800 font-medium mt-1 capitalize'>{selectedUser.account_type || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Address</label>
                                <p className='text-gray-800 font-medium mt-1'>{selectedUser.address || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Orders</label>
                                <p className='text-gray-800 font-medium mt-1'>{selectedUser.ordersCount || 0}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Joined Date</label>
                                <p className='text-gray-800 font-medium mt-1'>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">User ID</label>
                                <p className='text-gray-800 font-medium mt-1'>{selectedUser.id}</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="p-6 bg-gray-50 rounded-b-2xl">
                    <button onClick={() => { setViewModal(false); setSelectedUser(null); }} className='w-full bg-gray-600 text-white rounded-xl px-6 py-3 hover:bg-gray-700 transition-all font-semibold shadow-lg'>
                        <i className='bi bi-x-circle mr-2'></i>
                        Close
                    </button>
                </div>
            </div>
        </div>

        {/* Edit User Modal */}
        <div className={editModal?'flex w-full h-screen justify-center overflow-y-auto items-center fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn':'hidden overflow-hidden'}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-8 animate-slideUp">
                <div className="bg-gradient-to-r from-[#78C726] to-[#5fa51f] p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                            <i className='bi bi-pencil-square'></i>
                            Edit User
                        </h2>
                        <button onClick={() => { setEditModal(false); setSelectedUser(null); }} className='text-white hover:bg-white/20 rounded-full p-2 transition-all'>
                            <i className='bi bi-x-lg text-xl'></i>
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className='block text-sm font-semibold text-gray-700 mb-2'>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className='block text-sm font-semibold text-gray-700 mb-2'>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={editForm.email}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className='block text-sm font-semibold text-gray-700 mb-2'>Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className='block text-sm font-semibold text-gray-700 mb-2'>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={editForm.address}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                        />
                    </div>
                    <div>
                        <label htmlFor="account_type" className='block text-sm font-semibold text-gray-700 mb-2'>Role</label>
                        <select
                            name="account_type"
                            value={editForm.account_type}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="seller">Farmer</option>
                            <option value="buyer">Buyer</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button onClick={() => { setEditModal(false); setSelectedUser(null); }} className='flex-1 border-2 border-gray-300 text-gray-700 rounded-xl px-6 py-3 hover:bg-gray-100 transition-all font-semibold'>
                            <i className='bi bi-x-circle mr-2'></i>
                            Cancel
                        </button>
                        <button onClick={handleUpdate} className='flex-1 bg-[#78C726] text-white rounded-xl px-6 py-3 hover:bg-[#5fa51f] transition-all font-semibold shadow-lg'>
                            <i className='bi bi-check-circle mr-2'></i>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Delete modal window */}
        <div className={deleteModal?'flex w-full h-screen justify-center overflow-hidden items-center fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn':'hidden overflow-hidden'}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slideUp">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                            <i className='bi bi-exclamation-triangle'></i>
                            Delete User
                        </h2>
                        <button onClick={() => { setDeleteModal(false); setSelectedUser(null); }} className='text-white hover:bg-white/20 rounded-full p-2 transition-all'>
                            <i className='bi bi-x-lg text-xl'></i>
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
                        <p className="text-gray-800 font-semibold mb-2">Are you sure you want to delete this user?</p>
                        <p className="text-gray-600 text-sm">User: <span className="font-semibold text-red-600">"{selectedUser?.name || 'this user'}"</span></p>
                        <p className="text-gray-600 text-sm mt-2">This action cannot be undone.</p>
                    </div>
                </div>
                <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl">
                    <button onClick={() => { setDeleteModal(false); setSelectedUser(null); }} className='flex-1 border-2 border-gray-300 text-gray-700 rounded-xl px-6 py-3 hover:bg-gray-100 transition-all font-semibold'>
                        <i className='bi bi-x-circle mr-2'></i>
                        Cancel
                    </button>
                    <button onClick={handleDelete} className='flex-1 bg-red-500 text-white rounded-xl px-6 py-3 hover:bg-red-600 transition-all font-semibold shadow-lg'>
                        <i className='bi bi-trash mr-2'></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>

        {/* Add User Modal */}
        <div className={addModal?'flex w-full h-screen justify-center overflow-y-auto items-center fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn':'hidden overflow-hidden'}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-8 animate-slideUp">
                <div className="bg-gradient-to-r from-[#78C726] to-[#5fa51f] p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                            <i className='bi bi-person-plus-fill'></i>
                            Add New User
                        </h2>
                        <button onClick={() => { setAddModal(false); setAddForm({ name: '', email: '', phone: '', address: '', account_type: '', password: '' }); }} className='text-white hover:bg-white/20 rounded-full p-2 transition-all'>
                            <i className='bi bi-x-lg text-xl'></i>
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className='block text-sm font-semibold text-gray-700 mb-2'>Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={addForm.name}
                            onChange={handleAddInputChange}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                            placeholder="Enter user's full name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className='block text-sm font-semibold text-gray-700 mb-2'>Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            name="email"
                            value={addForm.email}
                            onChange={handleAddInputChange}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                            placeholder="user@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className='block text-sm font-semibold text-gray-700 mb-2'>Password <span className="text-red-500">*</span></label>
                        <input
                            type="password"
                            name="password"
                            value={addForm.password}
                            onChange={handleAddInputChange}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                            placeholder="Enter a secure password"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className='block text-sm font-semibold text-gray-700 mb-2'>Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={addForm.phone}
                            onChange={handleAddInputChange}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                            placeholder="+1234567890"
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className='block text-sm font-semibold text-gray-700 mb-2'>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={addForm.address}
                            onChange={handleAddInputChange}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                            placeholder="Enter user's address"
                        />
                    </div>
                    <div>
                        <label htmlFor="account_type" className='block text-sm font-semibold text-gray-700 mb-2'>Role <span className="text-red-500">*</span></label>
                        <select
                            name="account_type"
                            value={addForm.account_type}
                            onChange={handleAddInputChange}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#78C726] focus:outline-none transition-all'
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="seller">Farmer</option>
                            <option value="buyer">Buyer</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button onClick={() => { setAddModal(false); setAddForm({ name: '', email: '', phone: '', address: '', account_type: '', password: '' }); }} className='flex-1 border-2 border-gray-300 text-gray-700 rounded-xl px-6 py-3 hover:bg-gray-100 transition-all font-semibold'>
                            <i className='bi bi-x-circle mr-2'></i>
                            Cancel
                        </button>
                        <button onClick={handleAddUser} className='flex-1 bg-[#78C726] text-white rounded-xl px-6 py-3 hover:bg-[#5fa51f] transition-all font-semibold shadow-lg'>
                            <i className='bi bi-check-circle mr-2'></i>
                            Add User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
  )
}

export default User