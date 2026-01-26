import React, { useState } from 'react';
import { Images } from '../../constants/ImgImports';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/auth.tsx';
import type { LoginData } from '../../types/types.ts';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginData>({ email: '', password: '' });
  const { login, loading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(formData);
      console.log('Login successful:', result);
      // Handle success, e.g., redirect or store token
    } catch (err) {
      console.error('Login error:', err);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-6">
      <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden w-5xl p-12 justify-center items-center">

        {/* Left Image Section */}
        <div className="md:w-1/2 hidden md:block">
          <img src={Images.loginimg} alt="Login" className="w-full h-full object-cover" />
        </div>

        {/* Right Form Section */}
        <div className="md:w-full w-1/2 p-8 flex flex-col justify-center ">
          <h2 className="text-2xl font-semibold text-center mb-6">Welcome Back</h2>
          <p className="text-center m-4">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="w-full mx-auto flex flex-col justify-center items-center">
            {/* Email */}
            <div className='w-[90%] mt-6 mx-auto'>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className='w-[90%] mt-6 mx-auto'>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#78C726] focus:ring-1 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <i className="bi bi-eye-slash text-xl"></i>
                  ) : (
                    <i className="bi bi-eye text-xl"></i>
                  )}
                </button>
              </div>
              <Link to="/reset-password" className="text-[#78C726] font-medium hover:underline text-sm">
                Forgot Password?
              </Link>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-[90%] mt-8 rounded-lg bg-[#78C726] py-3 text-white font-semibold hover:bg-[#78C726] transition disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?
            <Link to="/register" className="text-[#78C726]  font-medium hover:underline ml-1">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
