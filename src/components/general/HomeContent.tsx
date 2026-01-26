import React from 'react'
import { Images } from '../../constants/ImgImports'
import { Link } from 'react-router-dom'
import ProductComponent from './ProductComponent'

const HomeContent = () => {
  return (
    <>
    <div className="flex w-full h-[80vh] md:h-screen justify-center items-center flex-col hero">
        <h1 className='font-bold text-[32px] text-center md:text-[5rem]'>Connecting Farmers <br /> Directly With Buyers</h1>
        <p className='text-center text-[16px] md:text-[20px] w-1/0.5'>Fresh produce from local farms delivered to your doorstep. Support local agriculture while getting the best quality products.</p>
      <div className="flex flex-wrap flex-col md:flex-row justify-center items-center mt-8">
          <button className='font-bold bg-white text-[#78C726] rounded m-4 h-11 p-4 flex justify-center items-center w-[200px]'><Link to={"/products"}>Browse Farm Products</Link></button>
          <button className='font-bold bg-[#78C726] rounded text-white m-4 h-11 p-4 flex justify-center items-center w-[200px]'><Link to={"/register"}>Join as a Farmer</Link></button>
      </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full p-4">
         <h1 className='text-4xl font-black pt-24'>Top Products</h1>
        <div className="flex flex-wrap justify-center sm:justify-between w-full pt-12 items-center">
            {/* Product listings would go here */}
          <ProductComponent />
          <ProductComponent />
          <ProductComponent />
          <ProductComponent />
        </div>
      </div>
      <h1 className="md:text-6xl text-2xl font-black mt-16">Why Choose <span className='text-[#78c726]'>BAJOMA</span></h1>
      <div className='flex h-screen w-[70%] justify-between items-center flex-wrap'>

        <div className="flex w-1full md:w-1/2 h-auto justify-between  flex-col flex-wrap">
            <div className='w-full md:w-[60%] mt-8'>
              <i className="bi bi-leaf text-2xl text-[#78C726]"></i>
              <h2 className='font-bold text-2xl'>From Fresh Farm</h2>
              <p>Get the freshest produce directly from local farmers without middlemen.</p>
            </div>
            <div className='w-full md:w-[60%] mt-8'>
              <i className="bi bi-person-check text-2xl text-[#78C726]"></i>
              <h2 className='font-bold text-2xl'>Support Locals</h2>
              <p>Help local farmers grow their business and strengthen your community.</p>
            </div>
            <div className='w-full md:w-[60%] mt-8'>
              <i className="bi bi-wallet text-2xl text-[#78C726]"></i>
              <h2 className='font-bold text-2xl'>Fair Prices</h2>
              <p>Transparent pricing that benefits both farmers and buyers equally.</p>
            </div>
        </div>
        <img className='md:h-full h-auto md:w-auto w-full mt-6' src={Images.sectionone} alt="section image" />
      </div>
      <div className="flex justify-center items-center text-center flex-col md:w-[60%] w-[90%] h-60 rounded-2xl bg-emerald-400 mt-30 mb-30 sectiontwo">
        <h1 className='text-4xl font-black'>Ready to Get Started?</h1>
        <p>Join thousands of buyers and farmers already using BAJOMA</p>
        <button className='font-bold bg-white text-[#78C726] rounded m-4 h-11 p-4 flex justify-center items-center w-[200px]'><Link to={'/register'}>Create Account Now</Link></button>
      </div>
    </>
  )
}

export default HomeContent