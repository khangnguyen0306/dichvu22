import { api, handleApiError } from './apiConfig';

export const paymentService = {
    // Initiate payment for a booking
    initiatePayment: async (bookingId) => {
        try {
            const response = await api.post('/bookings/payment', {
                bookingId: bookingId
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể khởi tạo thanh toán');
        }
    },

    // Handle payment return from payment gateway
    handlePaymentReturn: async (code, status, bookingId) => {
        try {
            const response = await api.get(`/bookings/payment/return?code=${code}&status=${status}&bookingId=${bookingId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể xử lý kết quả thanh toán');
        }
    },

    // Get payment status for a booking
    getPaymentStatus: async (bookingId) => {
        try {
            const response = await api.get(`/bookings/${bookingId}/payment-status`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể tải trạng thái thanh toán');
        }
    },

    // Cancel payment
    cancelPayment: async (bookingId) => {
        try {
            const response = await api.put(`/bookings/${bookingId}/payment/cancel`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể hủy thanh toán');
        }
    }
}; 