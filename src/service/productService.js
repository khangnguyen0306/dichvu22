import { api, handleApiError } from './apiConfig';

export const productService = {
    // Get all products
    async getProducts(params = {}) {
        try {
            const response = await api.get('/products', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get product by ID
    async getProductById(id) {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Create new product
    async createProduct(productData) {
        try {
            const response = await api.post('/products', productData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update product
    async updateProduct(id, productData) {
        try {
            const response = await api.put(`/products/${id}`, productData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Delete product
    async deleteProduct(id) {
        try {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default productService; 