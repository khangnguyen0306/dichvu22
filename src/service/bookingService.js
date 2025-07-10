import { api, handleApiError } from './apiConfig';

// Booking Service
export const bookingService = {
    // Get all bookings (with pagination and filters)
    async getBookings(params = {}) {
        try {
            const response = await api.get('/bookings', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get booking by ID
    async getBookingById(id) {
        try {
            const response = await api.get(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Create new booking
    async createBooking(bookingData) {
        try {
            const response = await api.post('/bookings', bookingData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update booking
    async updateBooking(id, bookingData) {
        try {
            const response = await api.put(`/bookings/${id}`, bookingData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Delete booking
    async deleteBooking(id) {
        try {
            const response = await api.delete(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Cancel booking
    async cancelBooking(id, reason = '') {
        try {
            const response = await api.post(`/bookings/${id}/cancel`, { reason });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Confirm booking
    async confirmBooking(id) {
        try {
            const response = await api.post(`/bookings/${id}/confirm`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Complete booking
    async completeBooking(id, notes = '') {
        try {
            const response = await api.post(`/bookings/${id}/complete`, { notes });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get user's bookings
    async getUserBookings(params = {}) {
        try {
            const response = await api.get('/user/bookings', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get seller's bookings
    async getSellerBookings(params = {}) {
        try {
            const response = await api.get('/seller/bookings', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get available time slots
    async getAvailableTimeSlots(serviceId, date) {
        try {
            const response = await api.get('/bookings/available-slots', {
                params: { serviceId, date }
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Check booking availability
    async checkAvailability(serviceId, date, time) {
        try {
            const response = await api.post('/bookings/check-availability', {
                serviceId,
                date,
                time
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Reschedule booking
    async rescheduleBooking(id, newDate, newTime) {
        try {
            const response = await api.post(`/bookings/${id}/reschedule`, {
                newDate,
                newTime
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Add booking notes
    async addBookingNotes(id, notes) {
        try {
            const response = await api.post(`/bookings/${id}/notes`, { notes });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get booking history
    async getBookingHistory(userId, params = {}) {
        try {
            const response = await api.get(`/bookings/history/${userId}`, { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get booking statistics
    async getBookingStatistics(period = 'month') {
        try {
            const response = await api.get('/bookings/statistics', {
                params: { period }
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Export bookings
    async exportBookings(format = 'csv', filters = {}) {
        try {
            const response = await api.get('/bookings/export', {
                params: { format, ...filters },
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Send booking reminder
    async sendBookingReminder(bookingId) {
        try {
            const response = await api.post(`/bookings/${bookingId}/reminder`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get booking calendar
    async getBookingCalendar(year, month) {
        try {
            const response = await api.get('/bookings/calendar', {
                params: { year, month }
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Bulk update bookings
    async bulkUpdateBookings(updates) {
        try {
            const response = await api.post('/bookings/bulk-update', { updates });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default bookingService; 