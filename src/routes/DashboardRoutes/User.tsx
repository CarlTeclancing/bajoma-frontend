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
    const [selectedUser, setSelectedUser] = React.useState<any | null>(null);
    const [editForm, setEditForm] = React.useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        account_type: ''
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
    <DashboardLayout>
        <h1 className='text-2xl'>User Management</h1>
        <p>View and manage all users</p>
        <div className="flex w-full flex-col gap-2 mt-4">
            <div className="flex w-auto gap-2">
                <button 
                    onClick={() => setFilter('all')}
                    className={`outline-2 outline-[#78C726] font-bold rounded p-2 cursor-pointer ${
                        filter === 'all' ? 'bg-[#78C726] text-white' : 'bg-white text-[#78C726]'
                    }`}
                >
                    All Users ({userCounts.all})
                </button>
                <button 
                    onClick={() => setFilter('farmer')}
                    className={`outline-2 outline-[#78C726] font-bold rounded p-2 cursor-pointer ${
                        filter === 'farmer' ? 'bg-[#78C726] text-white' : 'bg-white text-[#78C726]'
                    }`}
                >
                    Farmers ({userCounts.farmer})
                </button>
                <button 
                    onClick={() => setFilter('buyer')}
                    className={`outline-2 outline-[#78C726] font-bold rounded p-2 cursor-pointer ${
                        filter === 'buyer' ? 'bg-[#78C726] text-white' : 'bg-white text-[#78C726]'
                    }`}
                >
                    Buyers ({userCounts.buyer})
                </button>
                <button 
                    onClick={() => setFilter('admin')}
                    className={`outline-2 outline-[#78C726] font-bold rounded p-2 cursor-pointer ${
                        filter === 'admin' ? 'bg-[#78C726] text-white' : 'bg-white text-[#78C726]'
                    }`}
                >
                    Admins ({userCounts.admin})
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                    <p className='mt-4 text-gray-600'>Loading users...</p>
                </div>
            ) : (
        <table className='border rounded-2xl border-gray-300 mt-4 w-full'>
            <thead>
                <tr>
                    <th className='p-2 text-left'>Name</th>
                    <th className='p-2 text-left'>Phone</th>
                    <th className='p-2 text-left'>Email</th>
                    <th className='p-2 text-left'>Role</th>
                    <th className='p-2 text-left'>Address</th>
                    <th className='p-2 text-left'>Joined</th>
                    <th className='p-2 text-left'>Total Orders</th>
                    <th className='p-2 text-left'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredUsers.length === 0 ? (
                    <tr>
                        <td colSpan={8} className='p-8 text-center text-gray-500'>
                            No users found
                        </td>
                    </tr>
                ) : (
                    filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td className='p-2'>{user.name || 'N/A'}</td>
                            <td className='p-2'>{user.phone || 'N/A'}</td>
                            <td className='p-2'>{user.email || 'N/A'}</td>
                            <td className='p-2'>
                                <span className={`px-3 py-1 rounded text-xs font-semibold ${
                                    user.account_type?.toLowerCase() === 'admin' ? 'bg-[#FF9A00]' : 
                                    (user.account_type?.toLowerCase() === 'seller' || user.account_type?.toLowerCase() === 'farmer') ? 'bg-[#78C726]' : 
                                    (user.account_type?.toLowerCase() === 'buyer' || user.account_type?.toLowerCase() === 'user') ? 'bg-[#90C955]' : 
                                    'bg-gray-400'
                                } text-white uppercase`}>
                                    {user.account_type ? (
                                        user.account_type.toLowerCase() === 'seller' ? 'FARMER' : 
                                        user.account_type.toLowerCase() === 'farmer' ? 'FARMER' :
                                        user.account_type.toLowerCase() === 'buyer' ? 'USER' : 
                                        user.account_type.toLowerCase() === 'user' ? 'USER' :
                                        user.account_type.toUpperCase()
                                    ) : 'N/A'}
                                </span>
                            </td>
                            <td className='p-2'>{user.address || 'N/A'}</td>
                            <td className='p-2'>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                            <td className='p-2'>{user.ordersCount || 0}</td>
                            <td className='p-2'>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleViewClick(user)}
                                        className='bg-[#78C726] text-white rounded p-2 hover:bg-[#6ab31f] transition-colors'>
                                        <i className='bi bi-eye'></i>
                                    </button>
                                    <button 
                                        onClick={() => handleEditClick(user)}
                                        className='bg-[#90C955] text-white rounded p-2 hover:bg-[#7ab845] transition-colors'>
                                        <i className='bi bi-pencil'></i>
                                    </button>
                                    <button 
                                        onClick={() => { setSelectedUser(user); setDeleteModal(true); }}
                                        className='bg-[#DF6B57] text-white rounded p-2 hover:bg-[#c85a47] transition-colors'>
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
        </div>

        {/* View User Modal */}
        <div className={viewModal?'flex w-full h-screen justify-center overflow-hidden items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <div className="flex w-[50%] z-50 h-auto border border-gray-300 rounded-lg p-6 m-2 flex-col bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h1 className='text-2xl font-bold'>User Details</h1>
                    <button onClick={() => { setViewModal(false); setSelectedUser(null); }} className='text-gray-500 hover:text-gray-700'>
                        <i className='bi bi-x-lg text-xl'></i>
                    </button>
                </div>
                {selectedUser && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Name</p>
                                <p className="text-lg">{selectedUser.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Email</p>
                                <p className="text-lg">{selectedUser.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Phone</p>
                                <p className="text-lg">{selectedUser.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Role</p>
                                <p className="text-lg capitalize">{selectedUser.account_type || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Address</p>
                                <p className="text-lg">{selectedUser.address || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Total Orders</p>
                                <p className="text-lg">{selectedUser.ordersCount || 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">Joined Date</p>
                                <p className="text-lg">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">User ID</p>
                                <p className="text-lg">{selectedUser.id}</p>
                            </div>
                        </div>
                        <button onClick={() => { setViewModal(false); setSelectedUser(null); }} className='bg-[#78C726] text-white rounded p-2 mt-4 w-full hover:bg-[#6ab31f] transition-colors'>
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Edit User Modal */}
        <div className={editModal?'flex w-full h-screen justify-center overflow-hidden items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <div className="flex w-[50%] z-50 h-auto border border-gray-300 rounded-lg p-6 m-2 flex-col bg-white max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className='text-2xl font-bold'>Edit User</h1>
                    <button onClick={() => { setEditModal(false); setSelectedUser(null); }} className='text-gray-500 hover:text-gray-700'>
                        <i className='bi bi-x-lg text-xl'></i>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block font-semibold mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={editForm.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block font-semibold mb-2">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block font-semibold mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={editForm.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="account_type" className="block font-semibold mb-2">Role</label>
                        <select
                            name="account_type"
                            value={editForm.account_type}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="seller">Farmer</option>
                            <option value="buyer">Buyer</option>
                        </select>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <button onClick={() => { setEditModal(false); setSelectedUser(null); }} className='flex-1 bg-none border border-[#78C726] text-[#78C726] rounded p-2 hover:bg-gray-50 transition-colors'>
                            Cancel
                        </button>
                        <button onClick={handleUpdate} className='flex-1 bg-[#78C726] text-white rounded p-2 hover:bg-[#6ab31f] transition-colors'>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Delete modal window */}
        <div className={deleteModal?'flex w-full h-screen justify-center overflow-hidden items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <div className="flex w-[40%] z-50 h-auto border border-gray-300 rounded p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Delete User?</h1>
                <p>This will permanently delete "{selectedUser?.name || 'this user'}". This action cannot be undone.</p>
                <div className="flex gap-2 mt-4">
                    <button onClick={() => { setDeleteModal(false); setSelectedUser(null); }} className='flex-1 bg-none border border-[#78C726] text-[#78C726] rounded p-2'>Cancel</button>
                    <button onClick={handleDelete} className='flex-1 bg-[#DF6B57] text-white rounded p-2'>Delete</button>
                </div>
            </div>
        </div>
    </DashboardLayout>
  )
}

export default User