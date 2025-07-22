import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        // Lấy user từ localStorage và parse ra object
        const userStr = localStorage.getItem('user');
        let token = null;
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                token = user.token;
            } catch (e) {
                // Nếu parse lỗi thì bỏ qua
            }
        }
        // Nếu không có token trong user, thử lấy trực tiếp từ localStorage (nếu bạn có lưu riêng)
        if (!token) {
            token = localStorage.getItem('token');
        }
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Hàm xử lý lỗi chung (nếu muốn)
export function handleApiError(error) {
    return error.response?.data || { message: 'Request failed' };
}

// User Service for Admin
export const userService = {
    // Get all users (with pagination and filters)
    async getUsers(params = {}) {
        try {
            const response = await api.get('/users', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get users failed' };
        }
    },

    // Get user by ID
    async getUserById(id) {
        try {
            const response = await api.get(`/admin/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get user by id failed' };
        }
    },

    // Create new user
    async createUser(userData) {
        try {
            const response = await api.post('/admin/users', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Create user failed' };
        }
    },

    // Update user
    async updateUser(id, userData) {
        try {
            const response = await api.put(`/admin/users/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Update user failed' };
        }
    },

    // Delete user
    async deleteUser(id) {
        try {
            const response = await api.delete(`/admin/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Delete user failed' };
        }
    },

    // Update user status (active/inactive)
    async updateUserStatus(id, status) {
        try {
            const response = await api.patch(`/admin/users/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Update user status failed' };
        }
    },

    // Update user role
    async updateUserRole(id, role) {
        try {
            const response = await api.patch(`/admin/users/${id}/role`, { role });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Update user role failed' };
        }
    },

    // Reset user password
    async resetUserPassword(id, newPassword) {
        try {
            const response = await api.post(`/admin/users/${id}/reset-password`, { newPassword });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Reset user password failed' };
        }
    },

    // Get user profile
    async getUserProfile(id) {
        try {
            const response = await api.get(`/admin/users/${id}/profile`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get user profile failed' };
        }
    },

    // Update user profile
    async updateUserProfile(id, profileData) {
        try {
            const response = await api.put(`/admin/users/${id}/profile`, profileData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Update user profile failed' };
        }
    },

    // Upload user avatar
    async uploadUserAvatar(userId, image) {
        try {
            const formData = new FormData();
            formData.append('avatar', image);

            const response = await api.post(`/admin/users/${userId}/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Upload user avatar failed' };
        }
    },

    // Get users by role
    async getUsersByRole(role, params = {}) {
        try {
            const response = await api.get(`/admin/users/role/${role}`, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get users by role failed' };
        }
    },

    // Search users
    async searchUsers(query, filters = {}) {
        try {
            const response = await api.get('/admin/users/search', {
                params: { q: query, ...filters }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Search users failed' };
        }
    },

    // Get user analytics
    async getUserAnalytics(userId, period = 'month') {
        try {
            const response = await api.get(`/admin/users/${userId}/analytics`, {
                params: { period }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get user analytics failed' };
        }
    },

    // Bulk update users
    async bulkUpdateUsers(updates) {
        try {
            const response = await api.post('/admin/users/bulk-update', { updates });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Bulk update users failed' };
        }
    },

    // Bulk delete users
    async bulkDeleteUsers(userIds) {
        try {
            const response = await api.post('/admin/users/bulk-delete', { userIds });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Bulk delete users failed' };
        }
    },

    // Get user statistics
    async getUserStatistics() {
        try {
            const response = await api.get('/admin/users/statistics');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get user statistics failed' };
        }
    },

    // Export users
    async exportUsers(format = 'csv', filters = {}) {
        try {
            const response = await api.get('/admin/users/export', {
                params: { format, ...filters },
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
                throw error.response?.data || { message: 'Export users failed' };
        }
    },

    // Update current user's profile (non-admin)
    async updateProfile(profileData) {
        try {
            const response = await api.put('/users/update-profile', profileData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Update profile failed' };
        }
    },

    // Get current user's profile (non-admin)
    async getProfile() {
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get profile failed' };
        }
    },

    // Change current user's password
    async changePassword(passwordData) {
        try {
            const response = await api.put('/users/change-password', passwordData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Change password failed' };
        }
    },
};

export default userService; 