import { api, handleApiError } from './apiConfig';

// User Service for Admin
export const userService = {
    // Get all users (with pagination and filters)
    async getUsers(params = {}) {
        try {
            const response = await api.get('/admin/users', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get user by ID
    async getUserById(id) {
        try {
            const response = await api.get(`/admin/users/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Create new user
    async createUser(userData) {
        try {
            const response = await api.post('/admin/users', userData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update user
    async updateUser(id, userData) {
        try {
            const response = await api.put(`/admin/users/${id}`, userData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Delete user
    async deleteUser(id) {
        try {
            const response = await api.delete(`/admin/users/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update user status (active/inactive)
    async updateUserStatus(id, status) {
        try {
            const response = await api.patch(`/admin/users/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update user role
    async updateUserRole(id, role) {
        try {
            const response = await api.patch(`/admin/users/${id}/role`, { role });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Reset user password
    async resetUserPassword(id, newPassword) {
        try {
            const response = await api.post(`/admin/users/${id}/reset-password`, { newPassword });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get user profile
    async getUserProfile(id) {
        try {
            const response = await api.get(`/admin/users/${id}/profile`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update user profile
    async updateUserProfile(id, profileData) {
        try {
            const response = await api.put(`/admin/users/${id}/profile`, profileData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
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
            throw handleApiError(error);
        }
    },

    // Get users by role
    async getUsersByRole(role, params = {}) {
        try {
            const response = await api.get(`/admin/users/role/${role}`, { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
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
            throw handleApiError(error);
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
            throw handleApiError(error);
        }
    },

    // Bulk update users
    async bulkUpdateUsers(updates) {
        try {
            const response = await api.post('/admin/users/bulk-update', { updates });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Bulk delete users
    async bulkDeleteUsers(userIds) {
        try {
            const response = await api.post('/admin/users/bulk-delete', { userIds });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get user statistics
    async getUserStatistics() {
        try {
            const response = await api.get('/admin/users/statistics');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
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
            throw handleApiError(error);
        }
    },
};

export default userService; 