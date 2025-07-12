import { api, handleApiError } from './apiConfig';

export const serviceService = {
    // Get all services (public)
    async getServices(params = {}) {
        try {
            const response = await api.get('/services', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get service by ID (public)
    async getServiceById(id) {
        try {
            const response = await api.get(`/services/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get services by shop ID (public)
    async getServicesByShop(shopId, params = {}) {
        try {
            const response = await api.get(`/services/shop/${shopId}`, { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Create new service (protected - shop only)
    async createService(serviceData) {
        try {
            const response = await api.post('/services', serviceData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update service (protected - shop owner only)
    async updateService(id, serviceData) {
        try {
            const response = await api.put(`/services/${id}`, serviceData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Delete service (protected - shop owner only)
    async deleteService(id) {
        try {
            const response = await api.delete(`/services/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default serviceService; 