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

// Shop Service
export const shopService = {
    // Get pending shops for approval
    async getPendingShops(params = {}) {
        try {
            const response = await api.get('/shops/pending', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get pending shops failed' };
        }
    },

    // Approve a shop
    async approveShop(shopId) {
        try {
            const response = await api.patch(`/shops/${shopId}/approve`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Approve shop failed' };
        }
    },

    // Reject a shop
    async rejectShop(shopId, reason = '') {
        try {
            const response = await api.patch(`/shops/${shopId}/reject`, { reason });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Reject shop failed' };
        }
    },

    // Get shop details for approval review
    async getShopDetails(shopId) {
        try {
            const response = await api.get(`/shops/${shopId}/details`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get shop details failed' };
        }
    },

    // Get all shops (approved/rejected/pending)
    async getAllShops(params = {}) {
        try {
            const response = await api.get('/shops', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get all shops failed' };
        }
    },

    // Update shop status
    async updateShopStatus(shopId, status) {
        try {
            const response = await api.patch(`/shops/${shopId}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Update shop status failed' };
        }
    },

    // Get shop profile
    async getShopProfile(shopId) {
        try {
            const response = await api.get(`/shops/${shopId}/profile`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get shop profile failed' };
        }
    },

    // Update shop profile
    async updateShopProfile(shopId, profileData) {
        try {
            const response = await api.put(`/shops/${shopId}/profile`, profileData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Update shop profile failed' };
        }
    },

    // Get shop services
    async getShopServices(shopId, params = {}) {
        try {
            const response = await api.get(`/shops/${shopId}/services`, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get shop services failed' };
        }
    },

    // Create shop service
    async createShopService(shopId, serviceData) {
        try {
            const response = await api.post(`/shops/${shopId}/services`, serviceData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Create shop service failed' };
        }
    },

    // Update shop service
    async updateShopService(shopId, serviceId, serviceData) {
        try {
            const response = await api.put(`/shops/${shopId}/services/${serviceId}`, serviceData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Update shop service failed' };
        }
    },

    // Delete shop service
    async deleteShopService(shopId, serviceId) {
        try {
            const response = await api.delete(`/shops/${shopId}/services/${serviceId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Delete shop service failed' };
        }
    },

    // Get shop orders
    async getShopOrders(shopId, params = {}) {
        try {
            const response = await api.get(`/shops/${shopId}/orders`, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get shop orders failed' };
        }
    },

    // Update order status
    async updateOrderStatus(shopId, orderId, status) {
        try {
            const response = await api.patch(`/shops/${shopId}/orders/${orderId}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Update order status failed' };
        }
    },

    // Get shop statistics
    async getShopStatistics(shopId, period = 'month') {
        try {
            const response = await api.get(`/shops/${shopId}/statistics`, {
                params: { period }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Get shop statistics failed' };
        }
    },

    // Upload shop logo
    async uploadShopLogo(shopId, image) {
        try {
            const formData = new FormData();
            formData.append('logo', image);

            const response = await api.post(`/shops/${shopId}/logo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Upload shop logo failed' };
        }
    },

    // Search shops
    async searchShops(query, filters = {}) {
        try {
            const response = await api.get('/shops/search', {
                params: { q: query, ...filters }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Search shops failed' };
        }
    },
};

export default shopService; 