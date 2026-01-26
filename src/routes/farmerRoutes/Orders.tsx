import React from 'react';
import FarmerDashboardLayout from '../../components/general/FarmerDashboardLayout'
const FarmerOrders = () => {

    const [showViewModal, setShowViewModal] = React.useState(false);
    const [showEditModal, setShowEditModal] = React.useState(false);

    return (

        <FarmerDashboardLayout>
            <h1 className='text-2xl'>Order Management</h1>
            <p>View and manage all orders</p>
            <div className="flex w-full">
                {/* Order list and details would go here */}
                <div className="flex w-full flex-col gap-4 mt-4 bg-[#E6F2D9] p-4 rounded-2xl">
                    <div className="flex w-full bg-[#E6F2D9] p-4 rounded justify-between items-start">
                        <div className="flex flex-col">
                            <h2 className='text-2xl font-bold '>Oder1124kbb22</h2>
                            <p className='m-2'>Name: </p>
                            <p className='m-2'>Email: </p>
                            <p className='m-2'>Tell: </p>
                            <p className='m-2'>Date: </p>
                            <p className='m-2'>Time: </p>

                        </div>
                        <span className='p-2 rounded-2xl bg-amber-500'>Pending</span>
                    </div>
                    <table className='w-full border-collapse border bg-white border-gray-300 mt-4 w-full'>
                        <thead>

                            <tr className='border border-gray-300 text-left'>
                                <th className='p-2'>Item</th>
                                <th className='p-2'>Category</th>
                                <th className='p-2'>Farmer</th>
                                <th className='p-2'>Unit Price</th>
                                <th className='p-2'>Quantity</th>
                                <th className='p-2'>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Product rows will go here */}
                            <tr className=''>
                                <td className='p-2 mt-4'>Tomatoes</td>
                                <td className='p-2 mt-4'>Vegetables</td>
                                <td className='p-2 mt-4'>John Doe</td>
                                <td className='p-2 mt-4'>$200</td>
                                <td className='p-2 mt-4'>55</td>
                                <td className='p-2 mt-4'>$200</td>
                                {/*<td className='border border-gray-300 p-2 flex'>
                        <button className='bg-[#78C726] text-white rounded p-2 m-2 flex'><i className='bi bi-check'></i>Approve</button>
                        <button className='bg-red-600 text-white rounded p-2 m-2 flex'><i className='bi bi-x'></i>Reject</button>
                    </td>*/}

                            </tr>
                        </tbody>
                    </table>
                    {/* Total and action buttons */}
                    <div className="flex w-full justify-between">
                        <h1 className='text-2xl mt-2'>Final Total</h1>
                        <h1 className='text-2xl font-bold mt-2'>$200.00</h1>
                    </div>
                    <td className='p-2 flex justify-end'>
                        <button onClick={() => setShowViewModal(true)} className='bg-[#78C726] text-white rounded p-2 m-2'><i className='bi bi-eye m-2'></i><span>Mark Delivered</span></button>
                        <button onClick={() => setShowEditModal(true)} className='bg-[#fc3b3b] text-white rounded p-2 m-2'><i className='bi bi-x m-2'></i><span>Cancel</span></button>
                    </td>
                </div>
            </div>
        </FarmerDashboardLayout>
    )
}

export default FarmerOrders