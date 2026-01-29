import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Images } from '../../constants/ImgImports'
import useAuth from '../../hooks/auth'

export default function Navigation() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { getCurrentUser, isAuthenticated, logout } = useAuth();
  const currentUser = getCurrentUser();
  const isLoggedIn = isAuthenticated();

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  
  return (
    <>
      <nav className='w-full flex justify-between items-center p-4 desktop-navigation'>
          <img className='h-10 cursor-pointer' src={Images.logohorizontal} alt="logo" />
          <ul className='flex w-[40%] justify-between items-center'>
              <li className='font-bold cursor-pointer nav-element'><Link to={"/"}>Home</Link></li>
              <li className='font-bold cursor-pointer nav-element'><Link to={"/about"}>About</Link></li>
              <li className='font-bold cursor-pointer nav-element'><Link to={"/shop"}>Shop</Link></li>
              <li className='font-bold cursor-pointer nav-element'><Link to={"/products"}>Farms</Link></li>
              <li className='font-bold cursor-pointer nav-element'><Link to={"/contact"}>Contact</Link></li>
          </ul>

          <div className="flex items-center gap-4">
              {/* Cart Icon */}
              <Link to="/cart" className='relative'>
                <i className='bi bi-cart3 text-2xl text-[#78C726]'></i>
                {cartCount > 0 && (
                  <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu or Login Buttons */}
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link to="/account" className='flex items-center gap-2 text-[#78C726] hover:underline'>
                    <i className='bi bi-person-circle text-2xl'></i>
                    <span className='font-semibold'>{currentUser?.name || 'Account'}</span>
                  </Link>
                  <button onClick={logout} className='bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600'>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex">
                  <button className='bg-none outline-2 text-[#78C726] outline-[#78C726] rounded m-4 h-11 p-4 flex justify-center items-center w-auto'><Link to={"/login"}>LogIn</Link></button>
                  <button className='bg-[#78C726] rounded text-white m-4 h-11 p-4 flex justify-center items-center w-auto'><Link to={"/register"}>Sign Up</Link></button>
                </div>
              )}
          </div>
      </nav>

      {/* mobile menu bar */}
      <nav className='flex w-full p-4 justify-between items-center mobile-navigation'>
          <img className='h-10 cursor-pointer' src={Images.logohorizontal} alt="logo" />
          <button className='bg-none outline-2 text-[#78C726] outline-[#78C726] rounded m-4 h-11 p-4 flex justify-center items-center w-auto'
          onClick={()=>setMenuOpen(true)}
          >
            <i className="bi bi-list text-2xl"></i>
          </button>
      </nav>

      {/* mobile menu overlay */}
      <div className={menuOpen ? "flex mobile-overlay w-full h-screen justify-center items-center flex-col fixed top-0 z-10 bg-white" : "hidden"}>
          <button className='bg-none outline-2 text-[#78C726] outline-[#78C726] rounded m-4 h-11 p-4 flex justify-center items-center w-auto absolute top-4 right-4'
          onClick={()=>setMenuOpen(false)}
          >
            <i className="bi bi-x-lg text-2xl"></i>
          </button>
          <ul className='flex flex-col w-[90%] justify-between items-center'>
              <li className='text-[1.5rem] m-2 text-center font-bold cursor-pointer nav-element'><Link to={"/"} onClick={()=>setMenuOpen(false)}>Home</Link></li>
              <li className='text-[1.5rem] m-2 text-center font-bold cursor-pointer nav-element'><Link to={"/about"} onClick={()=>setMenuOpen(false)}>About</Link></li>
              <li className='text-[1.5rem] m-2 text-center font-bold cursor-pointer nav-element'><Link to={"/shop"} onClick={()=>setMenuOpen(false)}>Shop</Link></li>
              <li className='text-[1.5rem] m-2 text-center font-bold cursor-pointer nav-element'><Link to={"/products"} onClick={()=>setMenuOpen(false)}>Farms</Link></li>
              <li className='text-[1.5rem] m-2 text-center font-bold cursor-pointer nav-element'><Link to={"/cart"} onClick={()=>setMenuOpen(false)}>
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link></li>
              <li className='text-[1.5rem] m-2 text-center font-bold cursor-pointer nav-element'><Link to={"/contact"} onClick={()=>setMenuOpen(false)}>Contact</Link></li>
          </ul>

          <div className="flex flex-col flex-wrap justify-center items-center mt-8">
              {isLoggedIn ? (
                <>
                  <Link to="/account" className='outline-2 outline-[#78C726] font-bold bg-white text-[#78C726] rounded m-4 h-11 p-4 flex justify-center items-center w-[200px]' onClick={()=>setMenuOpen(false)}>
                    {currentUser?.name || 'My Account'}
                  </Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className='font-bold bg-red-500 rounded text-white m-4 h-11 p-4 flex justify-center items-center w-[200px]'>Logout</button>
                </>
              ) : (
                <>
                  <button className='outline-2 outline-[#78C726] font-bold bg-white text-[#78C726] rounded m-4 h-11 p-4 flex justify-center items-center w-[200px]'><Link to={"/login"} onClick={()=>setMenuOpen(false)}>LogIn</Link></button>
                  <button className='font-bold bg-[#78C726] rounded text-white m-4 h-11 p-4 flex justify-center items-center w-[200px]'><Link to={"/register"} onClick={()=>setMenuOpen(false)}>Sign Up</Link></button>
                </>
              )}
          </div>
      </div>
    </>
  )
}
