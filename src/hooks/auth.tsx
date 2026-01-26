import { useState } from 'react';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { BACKEND_URL } from '../global.ts';
import type { LoginData, RegisterData, ForgotPasswordData } from '../types/types';
import { useNavigate } from "react-router-dom";


interface AuthResponse {
  success: boolean;
  message: string;
  // Add other fields as needed, e.g., token, user
}

const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();


  const login = async (data: LoginData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response: AxiosResponse<any> = await axios.post(`${BACKEND_URL}/auth/login`, data);
      
      // Store token and user data in localStorage
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Redirect based on user type
      const userType = response.data.user?.account_type?.toUpperCase();
      console.log('User Type:', userType);
      console.log('User Data:', response.data.user);
      if (userType === 'ADMIN') {
        console.log('Redirecting to admin dashboard');
        navigate("/dashboard", { replace: true });
      } else if (userType === 'SELLER' || userType === 'FARMER') {
        // Support both 'SELLER' and legacy 'FARMER'
        console.log('Redirecting to farmer dashboard');
        navigate("/farmer", { replace: true });
      } else if (userType === 'BUYER' || userType === 'CUSTOMER') {
        // Support both 'BUYER' and legacy 'CUSTOMER'
        console.log('Redirecting to shop');
        navigate("/shop", { replace: true });
      } else {
        // Default fallback
        navigate("/shop", { replace: true });
      }
      
      return response.data;
  
    } catch (err) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response: AxiosResponse<any> = await axios.post(`${BACKEND_URL}/auth/register`, data);
      
      // Store token and user data in localStorage
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Redirect to appropriate dashboard
      const userType = response.data.user?.account_type?.toUpperCase();
      console.log('Registration - User Type:', userType);
      if (userType === 'ADMIN') {
        navigate("/dashboard", { replace: true });
      } else if (userType === 'SELLER' || userType === 'FARMER') {
        navigate("/farmer", { replace: true });
      } else if (userType === 'BUYER' || userType === 'CUSTOMER') {
        navigate("/shop", { replace: true });
      } else {
        navigate("/shop", { replace: true });
      }
      
      return response.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
    } else {
      console.log(err);
    }
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Register failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(`${BACKEND_URL}/auth/forgot-password`, data);
      return response.data;
    } catch (err) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Forgot password failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    navigate('/login');
  };

  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return { login, register, forgotPassword, logout, getCurrentUser, isAuthenticated, loading, error };
};

export default useAuth;
