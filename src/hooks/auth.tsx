import { useState, useEffect } from 'react';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { BACKEND_URL } from '../global.ts';
import type { LoginData, RegisterData, ForgotPasswordData } from '../types/types';
import { useNavigate } from "react-router-dom";
import { authStorage, ENABLE_CROSS_TAB_SYNC } from '../config/storage.config';


interface AuthResponse {
  success: boolean;
  message: string;
  // Add other fields as needed, e.g., token, user
}

const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  // Load user from storage on mount only
  useEffect(() => {
    const userStr = authStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Error parsing user data:', error);
        authStorage.removeItem('user');
      }
    }
  }, []); // Empty dependency array - only run on mount

  // Separate effect for storage event listener (only in localStorage mode)
  useEffect(() => {
    if (!ENABLE_CROSS_TAB_SYNC) {
      // Skip cross-tab sync in sessionStorage mode (development)
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' && e.newValue) {
        try {
          const newUser = JSON.parse(e.newValue);
          const currentUserStr = authStorage.getItem('user');
          const prevUser = currentUserStr ? JSON.parse(currentUserStr) : null;
          
          // If another tab logged in with a different user, reload
          if (prevUser && newUser.id !== prevUser.id) {
            console.log('User changed in another tab, reloading...');
            window.location.reload();
          }
        } catch (error) {
          console.error('Error parsing user from storage event:', error);
        }
      } else if (e.key === 'user' && !e.newValue) {
        // User was logged out in another tab
        authStorage.clear();
        window.location.href = '/login';
      } else if (e.key === 'token' && !e.newValue) {
        // Token was removed in another tab
        authStorage.clear();
        window.location.href = '/login';
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array


  const login = async (data: LoginData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response: AxiosResponse<any> = await axios.post(`${BACKEND_URL}/auth/login`, data);
      
      // Store token and user data in storage
      if (response.data.access_token) {
        authStorage.setItem('token', response.data.access_token);
      }
      if (response.data.user) {
        authStorage.setItem('user', JSON.stringify(response.data.user));
        setCurrentUser(response.data.user);
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
      
      // Store token and user data in storage
      if (response.data.access_token) {
        authStorage.setItem('token', response.data.access_token);
      }
      if (response.data.user) {
        authStorage.setItem('user', JSON.stringify(response.data.user));
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
    authStorage.removeItem('token');
    authStorage.removeItem('user');
    authStorage.removeItem('cart');
    setCurrentUser(null);
    navigate('/login');
  };

  const getCurrentUser = () => {
    return currentUser;
  };

  const isAuthenticated = () => {
    return !!authStorage.getItem('token') && !!currentUser;
  };

  return { login, register, forgotPassword, logout, getCurrentUser, isAuthenticated, loading, error, currentUser };
};

export { useAuth };
export default useAuth;
