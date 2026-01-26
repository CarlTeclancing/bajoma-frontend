import React from 'react'
import FarmerDashboardLayout from '../../components/general/FarmerDashboardLayout';

const FarmerProducts = () => {

    const [showEditModal, setShowEditModal] = React.useState(false);
    const [showViewModal, setShowViewModal] = React.useState(false);
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [showAddModal, setShowAddModal] = React.useState(false);

  return (
    <FarmerDashboardLayout>
        <h1 className='font-bold text-2xl'>Product Managment</h1>
        <p>Review and manage all farmer products</p>
        <div className="flex full">
            <div className="flex">
                <input type="text" placeholder='Search products...' className='border border-gray-300 rounded p-2 m-2 w-64'/>
                <button className='bg-[#90C955] text-white rounded p-2 m-2'><i className='bi bi-search m-2'></i>Search</button>
            </div>
            <div className="flex ml-auto">
                <button onClick={()=>setShowAddModal(true)} className='bg-[#78C726] text-white rounded p-2 m-2'><i className='bi bi-plus-circle m-1'></i>Add New Product</button>
            </div>
        </div>
        <div className="flex justify-end mt-12 w-full">
            
            <button className='border border-[#90C955] text-[#90C955] rounded p-2 m-2'> <i className='bi bi-filter'></i> Filter</button>

        </div>
        <table className='w-full border-collapse border border-gray-300 mt-4 w-full'>
            <thead>

                <tr>
                    <th className='border border-gray-300 p-2'>Product</th>
                    <th className='border border-gray-300 p-2'>Category</th>
                    <th className='border border-gray-300 p-2'>Price</th>
                    <th className='border border-gray-300 p-2'>Name</th>
                    <th className='border border-gray-300 p-2'>Status</th>
                    <th className='border border-gray-300 p-2'>Date</th>
                    {/*<th className='border border-gray-300 p-2'></th>*/}
                    <th className='border border-gray-300 p-2'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {/* Product rows will go here */}
                <tr>
                    <td className='border border-gray-300 p-2'>Tomatoes</td>
                    <td className='border border-gray-300 p-2'>Vegetables</td>
                    <td className='border border-gray-300 p-2'>$2.00/kg</td>
                    <td className='border border-gray-300 p-2'>John Doe</td>
                    <td className='border border-gray-300 p-2'>Available</td>
                    <td className='border border-gray-300 p-2'>2024-06-01</td>
                    {/*<td className='border border-gray-300 p-2 flex'>
                        <button className='bg-[#78C726] text-white rounded p-2 m-2 flex'><i className='bi bi-check'></i>Approve</button>
                        <button className='bg-red-600 text-white rounded p-2 m-2 flex'><i className='bi bi-x'></i>Reject</button>
                    </td>*/}
                    <td className='border border-gray-300 p-2 flex justify-end'>
                        <button onClick={()=>setShowViewModal(true)} className='bg-[#78C726] text-white rounded p-2 m-2 flex'><i className='bi bi-eye m-2'></i></button>
                        <button onClick={()=>setShowEditModal(true)} className='bg-[#78C726] text-white rounded p-2 m-2'><i className='bi bi-pencil m-2'></i></button>
                        <button onClick={()=>setDeleteModal(true)} className='bg-[#DF6B57] text-white rounded p-2 m-2'><i className='bi bi-trash m-2'></i></button>
                    </td>
                </tr>
            </tbody>
        </table>

        {/* edit modal window */}
        <div className={showEditModal?'flex w-full h-screen justify-center overflow-hidden items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <button 
            onClick={()=>setShowEditModal(false)}
            className='p-2 border border-[white] bg-white cursor-pointer rounded absolute top-4 right-4'><i className='bi bi-x font-bold text-2xl text-black'></i></button>
            <div className="flex w-[60%] h-auto border border-gray-300 rounded p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Edit Product</h1>
                <p>Make changes to the product details</p>
            </div>
        </div>

        {/* view modal window */}
        <div className={showViewModal?'flex w-full h-screen justify-center overflow-y-scroll items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <button 
            onClick={()=>setShowViewModal(false)}
            className='p-2 border border-[white] bg-white cursor-pointer rounded absolute top-4 right-4'><i className='bi bi-x font-bold text-2xl text-black'></i></button>
            <div className="flex w-[60%] h-auto border border-gray-300 rounded mt-6 p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Product Details</h1>
                <form action="flex flex-col w-fill p-4">
                        <label htmlFor="name">Product Name</label>
                        <input type="text" name="name" id="" placeholder='product name' className='w-full p-2 border border-gray rounded' />
                        <label htmlFor="description">Description</label>
                        <textarea name="description" className='w-full h-[100px] p-2 border border-gray rounded' id=""></textarea>
                        <div className="flex justify-between">
                            <div className='w-[48%] flex flex-col'>
                                <label htmlFor="category">Category</label>
                                <input type="text" name="category" id="" placeholder='category' className='w-full p-2 border border-gray rounded' />
                            </div>

                            <div className='w-[48%] flex flex-col'>
                                <label htmlFor="price">Price</label>
                                <input type="text" name="price" id="" placeholder='price' className='w-full p-2 border border-gray rounded' />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className='w-[48%] flex flex-col'>
                                <label htmlFor="quantity">Quantity</label>
                                <input type="text" name="quantity" id="" placeholder='quantity' className='w-full p-2 border border-gray rounded' />
                            </div>

                            <div className='w-[48%] flex flex-col'>
                                <label htmlFor="location">Location</label>
                                <input type="text" name="location" id="" placeholder='location' className='w-full p-2 border border-gray rounded' />
                            </div>
                        </div>
                        <label htmlFor="file">Upload Product Image</label>
                        <input type="file" name="file" id="" className='w-full p-2 border border-gray rounded bi bi-file h-12 ' />

                        <button className='bg-[#78C726] text-white rounded p-2 mt-4 float-end'>Save Changes</button>
                </form>
            </div>
        </div>
        
        {/* add product modal window */}
        <div className={showAddModal?'flex w-full h-screen justify-center overflow-y-scroll items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            <button 
            onClick={()=>setShowAddModal(false)}
            className='p-2 border border-[white] bg-white cursor-pointer rounded absolute top-4 right-4'><i className='bi bi-x font-bold text-2xl text-black'></i></button>
            <div className="flex w-[60%] h-auto border border-gray-300 rounded mt-6 p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Product Details</h1>
                <form action="flex flex-col w-fill p-4">
                        <label htmlFor="name">Product Name</label>
                        <input type="text" name="name" id="" placeholder='product name' className='w-full p-2 border border-gray rounded' />
                        <label htmlFor="description">Description</label>
                        <textarea name="description" className='w-full h-[100px] p-2 border border-gray rounded' id=""></textarea>
                        <div className="flex justify-between">
                            <div className='w-[48%] flex flex-col'>
                                <label htmlFor="category">Category</label>
                                <input type="text" name="category" id="" placeholder='category' className='w-full p-2 border border-gray rounded' />
                            </div>

                            <div className='w-[48%] flex flex-col'>
                                <label htmlFor="price">Price</label>
                                <input type="text" name="price" id="" placeholder='price' className='w-full p-2 border border-gray rounded' />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className='w-[48%] flex flex-col'>
                                <label htmlFor="quantity">Quantity</label>
                                <input type="text" name="quantity" id="" placeholder='quantity' className='w-full p-2 border border-gray rounded' />
                            </div>

                            <div className='w-[48%] flex flex-col'>
                                <label htmlFor="location">Location</label>
                                <input type="text" name="location" id="" placeholder='location' className='w-full p-2 border border-gray rounded' />
                            </div>
                        </div>
                        <label htmlFor="file">Upload Product Image</label>
                        <input type="file" name="file" id="" className='w-full p-2 border border-gray rounded bi bi-file h-12 ' />

                        <button className='bg-[#78C726] text-white rounded p-2 mt-4 float-end'>Save Changes</button>
                </form>
            </div>
        </div>

        {/* Delete modal window */}
        <div className={deleteModal?'flex w-full h-screen justify-center overflow-hidden items-center fixed top-0 left-0 bg-black/50 bg-opacity-50 z-20':'hidden overflow-hidden'}>
            
            <div className="flex w-[40%] z-50 h-auto border border-gray-300 rounded p-4 m-2 flex-col justify-center bg-white">
                <h1 className='text-2xl font-bold'>Delete Product?</h1>
                <p>This will permanently delete "Fresh Tomatoes". This action cannot be undone.</p>
                <div className="flex">
                    <button onClick={()=>setDeleteModal(false)} className='bg-none border border-[#78C726] text-[#78C726] rounded p-2 m-2'>No</button>
                    <button className='bg-[#DF6B57] text-white rounded p-2 m-2'>Yes</button>
                </div>
            </div>
        </div>
    </FarmerDashboardLayout>
  )
}

export default FarmerProducts