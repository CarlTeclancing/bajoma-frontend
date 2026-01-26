import React from 'react'
import DashboardLayout from '../../components/general/DashboardLayout'
import axios from 'axios';
import { BACKEND_URL } from '../../global';

const User = () => {
    const [users, setUsers] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState('all');
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<any | null>(null);

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

    const filteredUsers = filter === 'all' 
        ? users 
        : users.filter(user => user.role?.toLowerCase() === filter.toLowerCase());

    const userCounts = {
        all: users.length,
        farmer: users.filter(u => u.role?.toLowerCase() === 'farmer').length,
        buyer: users.filter(u => u.role?.toLowerCase() === 'buyer').length
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
                                <span className={`p-2 rounded ${
                                    user.role === 'admin' ? 'bg-[#FF9A00]' : 
                                    user.role === 'farmer' ? 'bg-[#78C726]' : 
                                    'bg-[#90C955]'
                                } text-white`}>
                                    {user.role || 'User'}
                                </span>
                            </td>
                            <td className='p-2'>{user.address || 'N/A'}</td>
                            <td className='p-2'>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                            <td className='p-2'>{user.ordersCount || 0}</td>
                            <td className='p-2 flex justify-end'>
                                <button 
                                    onClick={() => { setSelectedUser(user); setDeleteModal(true); }}
                                    className='bg-[#DF6B57] text-white rounded p-2 m-2'>
                                    <i className='bi bi-trash m-2'></i>
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
            )}
        </div>

        {/* Delete modal window */}
        <div className={deleteModal?'flex w-full h-screen justify-center overflow-hidden items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <div className="flex w-[40%] z-50 h-auto border border-gray-300 rounded p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Delete User?</h1>
                <p>This will permanently delete "{selectedUser?.name || 'this user'}". This action cannot be undone.</p>
                <div className="flex">
                    <button onClick={() => { setDeleteModal(false); setSelectedUser(null); }} className='bg-none border border-[#78C726] text-[#78C726] rounded p-2 m-2'>No</button>
                    <button onClick={handleDelete} className='bg-[#DF6B57] text-white rounded p-2 m-2'>Yes</button>
                </div>
            </div>
        </div>
    </DashboardLayout>
  )
}

export default User