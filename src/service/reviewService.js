import { api, handleApiError } from './apiConfig';

export const reviewService = {
    // Create a new service review
    createServiceReview: async (bookingId, reviewData) => {
        try {
            const response = await api.post(`/bookings/${bookingId}/review`, reviewData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể tạo đánh giá dịch vụ');
        }
    },

    // Get service reviews with filters
    getServiceReviews: async (serviceId) => {
        try {
            const url = `/bookings/reviews/service/${serviceId}`;
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể tải danh sách đánh giá dịch vụ');
        }
    },

    // Update a service review
    updateServiceReview: async (reviewId, updateData) => {
        try {
            const response = await api.put(`/bookings/reviews/service/${reviewId}`, updateData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể cập nhật đánh giá dịch vụ');
        }
    },

    // Delete a service review
    deleteServiceReview: async (reviewId) => {
        try {
            const response = await api.delete(`/bookings/reviews/service/${reviewId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể xóa đánh giá dịch vụ');
        }
    },
}; 