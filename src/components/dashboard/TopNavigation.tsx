import React from 'react'
import { Images } from '../../constants/ImgImports'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../global';

const TopNavigation = () => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [change, setChange] = React.useState(0);
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);
  return (

    <>
    
        <div className="hidden md:flex justify-between items-center mb-4 border-b-2 border-gray-300 pb-2">
            <h1 className='text-2 font-bold'>Welcome to BAJOMA Admin Dashboard</h1>
            <div className='flex items-center'>
              <Link to={'/dashboard/notifications'}>
                <button className='border border-[#90C955] rounded'><i className='bi bi-bell text-2xl text-[#90C955] m-2'></i></button>
              </Link>
                <img src={Images.profileimg} alt="profile" className='w-10 h-10 rounded-full ml-4'/>
                <div className='flex flex-col ml-2'>
                    <span className='font-semibold'>{user?.name || 'Admin'}</span>
                    <span className='text-xs text-gray-500'>{user?.email || ''}</span>
                </div>
            </div>
            
        </div>
        {/* mobile menu bar */}
        <nav className='flex w-full justify-between items-center mobile-navigation'>
          
              <button className='bg-none outline-2 text-[#78C726] outline-[#78C726] rounded m-4 h-11 p-4 flex justify-center items-center w-auto'
              onClick={() => setMenuOpen(prev => !prev)}
              >
                <i className={menuOpen?"bi bi-x text-4xl":"bi bi-list text-4xl"}></i>
              </button>
          
            <div className='flex items-center'>
              <Link to={'/dashboard/notifications'}>
                <button className='border border-[#90C955] rounded'><i className='bi bi-bell text-2xl text-[#90C955] m-2'></i></button>
              </Link>
                <img src={Images.profileimg} alt="profile" className='w-10 h-10 rounded-full ml-4'/>
            </div>
        </nav>

        {/* Mobile Dashboard sidebar menu */}
        <div className={menuOpen?'flex md:hidden w-full h-[100vh] p-2 flex-col overflow-y-scroll bg-white border-r-1 border-gray-300 fixed l-0 t-0 z-10':'hidden'}>

        <div className="flex flex-col mt-4">
            <Link 
              to={''} 
              onClick={()=> setChange(0)}
              className={change==0?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-speedometer2"></i><span>Dashboard</span>
                </div>
                <i className="bi bi-chevron-right "></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(1)}
              className={change==1?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-box-seam"></i><span>Products</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(2)}
              className={change==2?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-grid-3x3-gap-fill"></i><span>Categories</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(3)}
              className={change==3?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-people-fill"></i><span>USers</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(4)}
              className={change==4?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-cart-fill"></i><span>Orders</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(5)}
              className={change==5?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-chat-dots-fill"></i><span>Messages</span>
                </div>
              <i className="bi bi-chevron-right"></i>
            </Link>
                
            <Link 
              to={''} 
              onClick={()=> setChange(6)}
              className={change==6?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-gear-fill"></i><span>Settings</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(7)}
              className={change==7?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-headset"></i><span>Support Center</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
            <Link 
              to={''} 
              onClick={()=> setChange(8)}
              className={change==8?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-gear-fill"></i><span>Settings</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>

            <Link 
              to={''} 
              onClick={()=> setChange(9)}
              className={change==9?'w-[90%] h-12 text-white bg-[#90C955] p-4 mt-4 flex items-center justify-between rounded':'w-[90%] h-12 text-black p-4 mt-4 flex items-center justify-between rounded'}>
                <div>
                <i className="bi m-2 bi-box-arrow-right"></i><span>Logout</span>
                </div>
                <i className="bi bi-chevron-right"></i>
            </Link>
        </div>
    </div>

    </>
  )
}

export default TopNavigation