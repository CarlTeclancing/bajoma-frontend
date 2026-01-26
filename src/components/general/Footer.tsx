import React from 'react'
import { Images } from '../../constants/ImgImports'

const Footer = () => {
  return (
    <div className='flex bg-[#B4DD8A] w-full md:h-[300px] h-auto justify-center items-center flex-col p-12'>
        <div className="flex w-[90%] justify-between items-center flex-wrap h-auto">
            <div className='md:w-[20%] w-[90%] m-4'>
                <img className='h-12' src={Images.logohorizontal} alt="bajoma" />
                <p>Connecting farmers with buyers for a sustainable future.</p>
            </div>
            <div className='md:w-[20%] w-[90%] m-4'>
                <h5 className='text-2xl font-bold'>Quick Links</h5>
                <ul>
                    <li>About Us</li>
                    <li>FAQ</li>
                    <li>Terms & Conditions</li>
                </ul>
            </div>
            <div className='md:w-[20%] w-[90%] m-4'>
                <h5 className='text-2xl font-bold'>Support</h5>
                <ul>
                    <li>Contact Us</li>
                    <li>Help Center</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className='md:w-[20%] w-[90%] m-4'>
                <h5 className='text-2xl font-bold'>Contact</h5>
                <ul>
                    <li>support@farmconnect.com</li>
                    <li>+237 123 456 789</li>
                    <li>Yaoundé, Cameroon</li>
                </ul>
            </div>
        </div>
        <p className='text-4 mt-12 text-center'>© 2025 BAJOMA. Connecting communities through agriculture.</p>
    </div>
  )
}

export default Footer