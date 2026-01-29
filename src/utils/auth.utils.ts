// Utility function to get current user from storage
// Use this instead of manually calling localStorage.getItem('user')
import { authStorage } from '../config/storage.config';

export const getCurrentUser = () => {
    const userStr = authStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user from storage:', error);
            return null;
        }
    }
    return null;
};

export const getUserToken = () => {
    return authStorage.getItem('token');
};

export const clearAuthData = () => {
    authStorage.removeItem('token');
    authStorage.removeItem('user');
};
