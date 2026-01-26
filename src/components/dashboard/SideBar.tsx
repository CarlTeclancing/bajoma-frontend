import React from 'react'
import { Images } from '../../constants/ImgImports'
import { Link } from 'react-router-dom'


const SideBar = () => {

  const [change, setChange] = React.useState(0);
  const location = window.location.pathname;
  return (
    <div className='hidden md:flex w-[260px] h-[100vh] p-2 flex-col overflow-y-scroll border-r-1 border-gray-300'>
        <img src={Images.logohfull} alt="" />
        <hr className='w-[90%] mt-4' />
        <div className="flex flex-col mt-4">
            <Link 
              to={'/dashboard'} 
              onClick={()=> setChange(0)}
              className={location==='/dashboard'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-speedometer2"></i><span>Dashboard</span>
                </div>
                <i className="bi bi-chevron-right "></i>
            </Link>
            <Link 
              to={'/dashboard/products'} 
              onClick={()=> setChange(1)}
              className={location==='/dashboard/products'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-box-seam"></i><span>Products</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={'/dashboard/categories'} 
              onClick={()=> setChange(2)}
              className={location==='/dashboard/categories'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-grid-3x3-gap-fill"></i><span>Categories</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={'/dashboard/users'} 
              onClick={()=> setChange(3)}
              className={location==='/dashboard/users'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-people-fill"></i><span>USers</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={'/dashboard/orders'} 
              onClick={()=> setChange(4)}
              className={location==='/dashboard/orders'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-cart-fill"></i><span>Orders</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={'/dashboard/messages'} 
              onClick={()=> setChange(5)}
              className={location==='/dashboard/messages'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-chat-dots-fill"></i><span>Messages</span>
                </div>
              <i className="bi bi-chevron-right"></i>
            </Link>
                
            <Link 
              to={'/dashboard/support'} 
              onClick={()=> setChange(7)}
              className={location==='/dashboard/support'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-headset"></i><span>Support Center</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={'/dashboard/settings'} 
              onClick={()=> setChange(8)}
              className={location==='/dashboard/settings'?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-gear-fill"></i><span>Settings</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <br /><br />
            <hr className='w-[90%]' />
            <Link 
              to={'/logout'} 
              onClick={()=> setChange(9)}
              className={change==9?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-12 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-12 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-box-arrow-right"></i><span>Logout</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
        </div>
    </div>
  )
}

export default SideBar