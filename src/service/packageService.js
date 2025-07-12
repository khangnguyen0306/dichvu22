import { api, handleApiError } from './apiConfig';

export const packageService = {
    // Create payment for package subscription
    async createPayment(paymentData) {
        try {
            const response = await api.post('/payments/payos/create', paymentData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default packageService;
