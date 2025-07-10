import axios from 'axios';

// Base API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors and common responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle authentication errors
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        
        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// Common error handler
export const handleApiError = (error) => {
    if (error.response?.data) {
        return error.response.data;
    }
    return { message: 'An unexpected error occurred' };
};

// Common success handler
export const handleApiSuccess = (response) => {
    return response.data;
};

// File upload helper
export const uploadFile = async (url, file, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
        };
    }

    try {
        const response = await api.post(url, formData, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Download file helper
export const downloadFile = async (url, filename) => {
    try {
        const response = await api.get(url, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        throw handleApiError(error);
    }
};

export default api; 