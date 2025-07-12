import { api, handleApiError } from './apiConfig';

export const bookingService = {
    // Create a new booking
    createBooking: async (bookingData) => {
        try {
            const response = await api.post('/bookings', bookingData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể tạo đơn đặt lịch');
        }
    },

    // Get user's bookings with filters
    getUserBookings: async (customerEmail, params = {}) => {
        try {
            const { status, paymentStatus, search, page = 1, limit = 10 } = params;
            const queryParams = new URLSearchParams();
            
            if (status) queryParams.append('status', status);
            if (paymentStatus) queryParams.append('paymentStatus', paymentStatus);
            if (search) queryParams.append('search', search);
            if (page) queryParams.append('page', page);
            if (limit) queryParams.append('limit', limit);
            
            const queryString = queryParams.toString();
            const url = `/bookings/customer/${encodeURIComponent(customerEmail)}${queryString ? `?${queryString}` : ''}`;
            
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể tải danh sách đặt lịch');
        }
    },

    // Get booking by ID
    getBookingById: async (bookingId) => {
        try {
            const response = await api.get(`/bookings/${bookingId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể tải thông tin đặt lịch');
        }
    },

    // Cancel booking
    cancelBooking: async (bookingId) => {
        try {
            const response = await api.put(`/bookings/${bookingId}/cancel`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể hủy đặt lịch');
        }
    },

    // Update booking
    updateBooking: async (bookingId, updateData) => {
        try {
            const response = await api.put(`/bookings/${bookingId}`, updateData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể cập nhật đặt lịch');
        }
    },

    // Get shop bookings with filters
    getShopBookings: async (shopId, params = {}) => {
        try {
            const { status, paymentStatus, search, page = 1, limit = 10 } = params;
            const queryParams = new URLSearchParams();
            
            queryParams.append('shopId', shopId);
            if (status) queryParams.append('status', status);
            if (paymentStatus) queryParams.append('paymentStatus', paymentStatus);
            if (search) queryParams.append('search', search);
            if (page) queryParams.append('page', page);
            if (limit) queryParams.append('limit', limit);
            
            const queryString = queryParams.toString();
            const url = `/bookings${queryString ? `?${queryString}` : ''}`;
            
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể tải danh sách đặt lịch của shop');
        }
    },

    // Update booking status (accept/reject)
    updateBookingStatus: async (bookingId, status) => {
        try {
            const response = await api.put(`/bookings/${bookingId}`, { status });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể cập nhật trạng thái đặt lịch');
        }
    }
}; 