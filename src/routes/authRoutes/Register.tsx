import React, { useState } from "react";
import { Images } from "../../constants/ImgImports";
import { Link } from "react-router-dom";
import useAuth from '../../hooks/auth.tsx';
import type { RegisterData } from '../../types/types.ts';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({ name: '', email: '', phone: '', userType: '', password: '' });
  const { register, loading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await register(formData);
      console.log('Register successful:', result);
      // Handle success
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden w-5xl p-12 items-center justify-center">

        {/* Left Image */}
        <div className="md:w-1/2 hidden md:block">
          <img src={Images.registerimg} alt="Register" className="w-full h-full object-cover" />
        </div>

        {/* Right Form */}
        <div className="md:w-full w-1/2 p-8 flex flex-col justify-center ">
          <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>
          <p className="text-center">Join BOJOMA and start connecting today</p>

       <form onSubmit={handleSubmit} className="w-full mx-auto flex flex-col justify-center items-center">
            {/* Full name */}
            <div className='w-[90%] mt-4 mx-auto'>
              <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#78C726] focus:ring-1 focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className='w-[90%] mt-4 mx-auto'>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#78C726] focus:ring-1 focus:outline-none"
                required
              />
            </div>

            {/* Phone Number */}
            <div className='w-[90%] mt-4 mx-auto'>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#78C726] focus:ring-1 focus:outline-none"
                required
              />
            </div>

            {/* User Type */}
            <div className='w-[90%] mt-4 mx-auto'>
              <label className="block text-sm font-medium text-gray-600 mb-1">User Type</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-blue-500 focus:ring-1 focus:outline-none"
                required
              >
                <option value="">Select user type</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            {/* Password */}
            <div className='w-[90%] mt-4 mx-auto'>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#78C726] focus:ring-1 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <i className="bi bi-eye-slash text-xl"></i>
                  ) : (
                    <i className="bi bi-eye text-xl"></i>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-[90%] mt-8 rounded-lg bg-[#78C726] py-3 text-white font-semibold hover:bg-[#78C726] transition disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Login Redirect */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?
            <Link to="/login" className="text-[#78C726] font-medium hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
