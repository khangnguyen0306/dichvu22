import { api, handleApiError, uploadFile } from './apiConfig';

// Product Service for Sellers
export const productService = {
    // Get all products (with pagination and filters)
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

    // Get seller's products
    async getSellerProducts(params = {}) {
        try {
            const response = await api.get('/seller/products', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Create new product
    async createProduct(productData) {
        try {
            const response = await api.post('/seller/products', productData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update product
    async updateProduct(id, productData) {
        try {
            const response = await api.put(`/seller/products/${id}`, productData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Delete product
    async deleteProduct(id) {
        try {
            const response = await api.delete(`/seller/products/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Upload product images
    async uploadProductImages(productId, images) {
        try {
            const formData = new FormData();
            images.forEach((image, index) => {
                formData.append('images', image);
            });

            const response = await api.post(`/seller/products/${productId}/images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Delete product image
    async deleteProductImage(productId, imageId) {
        try {
            const response = await api.delete(`/seller/products/${productId}/images/${imageId}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update product status (active/inactive)
    async updateProductStatus(id, status) {
        try {
            const response = await api.patch(`/seller/products/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get product categories
    async getProductCategories() {
        try {
            const response = await api.get('/products/categories');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Search products
    async searchProducts(query, filters = {}) {
        try {
            const response = await api.get('/products/search', {
                params: { q: query, ...filters }
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get product analytics for seller
    async getProductAnalytics(productId, period = 'month') {
        try {
            const response = await api.get(`/seller/products/${productId}/analytics`, {
                params: { period }
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default productService; 