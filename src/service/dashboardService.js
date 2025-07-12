import { api, handleApiError } from './apiConfig';

export const dashboardService = {
    // Get dashboard overview
    getOverview: async (month, year) => {
        try {
            const response = await api.get(`/dashboard/overview?month=${month}&year=${year}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể tải thông tin tổng quan');
        }
    },

    // Get users statistics
    getUsers: async (month, year, page = 1, limit = 10) => {
        try {
            const response = await api.get(`/dashboard/users?month=${month}&year=${year}&page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể tải thống kê người dùng');
        }
    },

    // Get shops statistics
    getShops: async (month, year) => {
        try {
            const response = await api.get(`/dashboard/shops?month=${month}&year=${year}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể tải thống kê cửa hàng');
        }
    },

    // Get revenue statistics
    getRevenue: async (month, year) => {
        try {
            const response = await api.get(`/dashboard/revenue?month=${month}&year=${year}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể tải thống kê doanh thu');
        }
    }
}; 