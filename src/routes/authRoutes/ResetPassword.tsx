import React, { useState } from 'react';
import { Images } from '../../constants/ImgImports';
import useAuth from '../../hooks/auth.tsx';
import type { ForgotPasswordData } from '../../types/types.ts';

const ResetPassword = () => {
  const [formData, setFormData] = useState<ForgotPasswordData>({ email: '' });
  const { forgotPassword, loading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await forgotPassword(formData);
      console.log('Forgot password successful:', result);
      // Handle success, e.g., show message
    } catch (err) {
      console.error('Forgot password error:', err);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white-100 px-6 py-6">
      <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden w-5xl p-12">

        {/* Left Image Section */}
        <div className="md:w-1/2 hidden md:block">
          <img src={Images.loginimg} alt="Login" className="w-full h-full object-cover" />
        </div>

        {/* Right Form Section */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center ">
          <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
          <p className="text-center m-4">Enter your email to get password reset link</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
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

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#78C726] py-3 text-white font-semibold hover:bg-[#78C726] transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
