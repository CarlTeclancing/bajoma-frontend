import FarmerDashboardLayout from '../../components/general/FarmerDashboardLayout';

const FarmerDashboard = () => {
  return (
    <FarmerDashboardLayout>
      <h1 className='text-2xl font-bold mt-4'>Farmer Dashboard</h1>
      <p>Overview of your BAJOMA platform</p>

      <div className='flex flex-wrap w-[100%] md:h-[200px] h-auto rounded p-6 mt-4 bg-[#FFFFFF] border-gray-300 border-2 justify-between items-center'>

        <div className="flex justify-center items-center mt-4 md:mt-0">
          <i className='bi bi-box text-4xl text-[#58AC01]'></i>
          <div className="flex flex-col p-2 ">
            <p className='text-2xl'>Total Products</p>
            <h2 className='text-2xl font-bold'>105</h2>
          </div>
        </div>

        <div className="w-[100%] md:w-[2px] bg-gray-300 h-[1px] md:h-full mt-2"></div>

        <div className="flex justify-center items-center mt-4 md:mt-0">
          <i className='bi bi-basket text-4xl text-[#58AC01]'></i>
          <div className="flex flex-col p-2 ">
            <p className='text-2xl'>Total Orders</p>
            <h2 className='text-2xl font-bold'>105</h2>
          </div>
        </div>

        <div className="w-[100%] md:w-[2px] bg-gray-300 h-[1px] md:h-full mt-2"></div>

        <div className="flex justify-center items-center mt-4 md:mt-0">
          <i className='bi bi-circle-check text-4xl text-[#58AC01]'></i>
          <div className="flex flex-col p-2 ">
            <p className='text-2xl'>Pending</p>
            <h2 className='text-2xl font-bold'>1</h2>
          </div>
        </div>

        <div className="w-[100%] md:w-[2px] bg-gray-300 h-[1px] md:h-full mt-2"></div>

        <div className="flex justify-center items-center mt-4 md:mt-0">
          <i className='bi bi-wallet text-4xl text-[#58AC01]'></i>
          <div className="flex flex-col p-2 ">
            <p className='text-2xl'>Approved</p>
            <h2 className='text-2xl font-bold'>105</h2>
          </div>
        </div>
      </div>

      {/*Platform activities */}
      <h1 className='text-2xl font-bold mt-12'>Platform Activities</h1>
      <div className="flex w-full flex-col md:flex-row md:h-auto h-auto md:justify-between items-center pt-6">
        <div className=" w-full md:w-[49%] flex-col bg-white h-auto rounded md:p-6 p-0" >
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Manage Orders</h1>
            <p>0 Pending orders to process</p>
          </div>
        
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Manage New Categories</h1>
            <p>Publish new category listings easily</p>
          </div>
        
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>View Messages</h1>
            <p>2 unread inquiries from buyers</p>
          </div>
        
        </div>
        <div className=" w-full md:w-[49%] flex-col bg-white h-auto rounded md:p-6 p-0" >
          
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Active Products</h1>
            <p>105</p>
          </div>
        
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Registered Users</h1>
            <p>344</p>
          </div>
        
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Support</h1>
            <p>12</p>
          </div>
        
        </div>
      </div>

      <div className="flex w-full flex-col md:flex-row md:h-auto h-auto md:justify-between items-center pt-6">
        <div className=" w-full md:w-auto flex-col bg-white h-auto rounded md:p-6 p-0" >
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Manage Orders</h1>
            <p>0 Pending orders to process</p>
          </div>
        </div>
        <div className=" w-full md:w-auto flex-col bg-white h-auto rounded md:p-6 p-0" >
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>Manage New Categories</h1>
            <p>Publish new category listings easily</p>
          </div>
        </div>
        <div className=" w-full md:w-auto flex-col bg-white h-auto rounded md:p-6 p-0" >
          <div className="flex flex-col w-full m-2 p-2 border border-[#78C726] rounded">
            <h1 className='text-xl font-bold'>View Messages</h1>
            <p>2 unread inquiries from buyers</p>
          </div>
        </div>

      </div>

    </FarmerDashboardLayout>
  )
}

export default FarmerDashboard;