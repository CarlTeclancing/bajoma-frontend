import HomeLayout from '../components/general/HomeLayout'
import ProductComponent from '../components/general/ProductComponent'
import { Link } from 'react-router-dom'

const ProductsPage = () => {
  return (
    <HomeLayout>
        <h1 className='font-bold text-2xl m-12'>Products Page</h1>
        <div className="flex">
          <input type="text" placeholder='Search products...' className='border border-gray-300 rounded p-2 m-2 w-64'/>
          <button className='bg-[#90C955] text-white rounded p-2 m-2'><i className='bi bi-search m-2'></i>Search</button>
        </div>
        <div className="flex justify-between w-[90%] pt-16">
          <div className="flex flex-wrap gap-4 justify-between w-[90%] items-center">
              {/* Product listings would go here */}
            <ProductComponent />
            <ProductComponent />
            <ProductComponent />
            <ProductComponent />
          </div>
          <div className="div border border-gray-300 rounded p-2 m-2 w-[20%] h-auto">
            {/* Sidebar or additional filters can go here */}
            <button className='border border-[#90C955] text-[#90C955] rounded p-2 m-2'> <i className='bi bi-filter'></i>Products</button>
            
              <Link to={'/'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Category 1</Link>
              <Link to={'/'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Category 2</Link>
              <Link to={'/'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Category 3</Link>
            
            <button className='border border-[#90C955] text-[#90C955] rounded p-2 m-2'> <i className='bi bi-filter'></i>Farms</button>
              <Link to={'/'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Farms c1</Link>
              <Link to={'/'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Farms c2</Link>
              <Link to={'/'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Farms c3</Link>
          </div>
        </div>
    </HomeLayout>
  )
}

export default ProductsPage