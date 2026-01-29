import React from 'react'
import { Images } from '../../constants/ImgImports'
import { Link, useNavigate } from 'react-router-dom'


const SideBarFarmer = () => {
  const navigate = useNavigate();
  const [change, setChange] = React.useState(0);
  const location = window.location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div className='hidden md:flex w-[260px] h-[100vh] p-2 flex-col overflow-y-scroll border-r-1 border-gray-300'>
        <img src={Images.logohfull} alt="" />
        <hr className='w-[90%] mt-4' />
        <span>{change}</span>
        <div className="flex flex-col mt-4">
            <Link 
              to={'/farmer'} 
              onClick={()=> setChange(0)}
              className={location==='/farmer'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-speedometer2"></i><span>Dashboard</span>
                </div>
                <i className="bi bi-chevron-right "></i>
            </Link>
            <Link 
              to={'/farmer/products'} 
              onClick={()=> setChange(1)}
              className={location==='/farmer/products'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-box-seam"></i><span>Products</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>

            <Link 
              to={'/farmer/orders'} 
              onClick={()=> setChange(4)}
              className={location==='/farmer/orders'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-cart-fill"></i><span>Orders</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={'/farmer/sales'} 
              onClick={()=> setChange(10)}
              className={location==='/farmer/sales'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-graph-up"></i><span>Sales</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={'/farmer/messages'} 
              onClick={()=> setChange(5)}
              className={location==='/farmer/messages'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-chat-dots-fill"></i><span>Messages</span>
                </div>
              <i className="bi bi-chevron-right"></i>
            </Link>
                
            <Link 
              to={'/farmer/support'} 
              onClick={()=> setChange(7)}
              className={location==='/farmer/support'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-headset"></i><span>Support Center</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={'/farmer/settings'} 
              onClick={()=> setChange(8)}
              className={location==='/farmer/settings'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-gear-fill"></i><span>Settings</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <br /><br />
            <hr className='w-[90%]' />
            <button 
              onClick={handleLogout}
              className='w-[90%] h-12 text-white bg-[#DF6B57] p-4 mt-12 flex items-center justify-between rounded hover:bg-[#c85a47] cursor-pointer'>
                <div>
                <i className="bi m-2 bi-box-arrow-right"></i><span>Logout</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </button>
        </div>
    </div>
  )
}

export default SideBarFarmer
