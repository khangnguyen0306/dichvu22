import { api, handleApiError } from './apiConfig';

export const productTypeService = {
    // Get all product types
    async getProductTypes(params = {}) {
        try {
            const response = await api.get('/product-types', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get product type by ID
    async getProductTypeById(id) {
        try {
            const response = await api.get(`/product-types/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Create new product type
    async createProductType(productTypeData) {
        try {
            const response = await api.post('/product-types', productTypeData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update product type
    async updateProductType(id, productTypeData) {
        try {
            const response = await api.put(`/product-types/${id}`, productTypeData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Delete product type
    async deleteProductType(id) {
        try {
            const response = await api.delete(`/product-types/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get products by product type
    async getProductsByType(typeId, params = {}) {
        try {
            const response = await api.get(`/product-types/${typeId}/products`, { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Search product types
    async searchProductTypes(query, params = {}) {
        try {
            const response = await api.get('/product-types/search', {
                params: { q: query, ...params }
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get product type statistics
    async getProductTypeStats(typeId) {
        try {
            const response = await api.get(`/product-types/${typeId}/stats`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Bulk create product types
    async bulkCreateProductTypes(productTypesData) {
        try {
            const response = await api.post('/product-types/bulk', { productTypes: productTypesData });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Bulk update product types
    async bulkUpdateProductTypes(updates) {
        try {
            const response = await api.patch('/product-types/bulk', { updates });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Bulk delete product types
    async bulkDeleteProductTypes(typeIds) {
        try {
            const response = await api.delete('/product-types/bulk', { 
                data: { typeIds } 
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Toggle product type status (active/inactive)
    async toggleProductTypeStatus(id) {
        try {
            const response = await api.patch(`/product-types/${id}/toggle-status`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get product type hierarchy (if nested categories)
    async getProductTypeHierarchy() {
        try {
            const response = await api.get('/product-types/hierarchy');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default productTypeService; 