import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Authentication Service
export const authService = {
    // Login user
    async login(email, password) {
        try {
            const response = await api.post('/users/login', {
                usernameOrEmail : email,
                password,
            });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    // Register new user
    async register(userData) {
        try {
            const response = await api.post('/users/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    // Forgot password
    async forgotPassword(email) {
        try {
            const response = await api.post('/users/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Forgot password request failed' };
        }
    },

    // Reset password
    async resetPassword(token, newPassword) {
        try {
            const response = await api.post('/users/reset-password', {
                token,
                newPassword,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Password reset failed' };
        }
    },

    // Verify email
    async verifyEmail(token) {
        try {
            const response = await api.post('/users/verify-email', { token });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Email verification failed' };
        }
    },

    // Resend verification email
    async resendVerificationEmail(email) {
        try {
            const response = await api.post('/users/resend-verification', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Resend verification failed' };
        }
    },

    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    // Get auth token
    getToken() {
        return localStorage.getItem('token');
    },
};

export default authService; 