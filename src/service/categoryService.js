import { api, handleApiError } from './apiConfig';

// Category Service for Admin
export const categoryService = {
    // Get all categories (with pagination and filters)
    async getCategories(params = {}) {
        try {
            const response = await api.get('/admin/categories', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get category by ID
    async getCategoryById(id) {
        try {
            const response = await api.get(`/admin/categories/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Create new category
    async createCategory(categoryData) {
        try {
            const response = await api.post('/admin/categories', categoryData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update category
    async updateCategory(id, categoryData) {
        try {
            const response = await api.put(`/admin/categories/${id}`, categoryData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Delete category
    async deleteCategory(id) {
        try {
            const response = await api.delete(`/admin/categories/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Upload category image
    async uploadCategoryImage(categoryId, image) {
        try {
            const formData = new FormData();
            formData.append('image', image);

            const response = await api.post(`/admin/categories/${categoryId}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update category status (active/inactive)
    async updateCategoryStatus(id, status) {
        try {
            const response = await api.patch(`/admin/categories/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get category hierarchy
    async getCategoryHierarchy() {
        try {
            const response = await api.get('/admin/categories/hierarchy');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get categories with product count
    async getCategoriesWithProductCount() {
        try {
            const response = await api.get('/admin/categories/with-product-count');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Reorder categories
    async reorderCategories(categoryIds) {
        try {
            const response = await api.post('/admin/categories/reorder', { categoryIds });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get category analytics
    async getCategoryAnalytics(categoryId, period = 'month') {
        try {
            const response = await api.get(`/admin/categories/${categoryId}/analytics`, {
                params: { period }
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Bulk update categories
    async bulkUpdateCategories(updates) {
        try {
            const response = await api.post('/admin/categories/bulk-update', { updates });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Bulk delete categories
    async bulkDeleteCategories(categoryIds) {
        try {
            const response = await api.post('/admin/categories/bulk-delete', { categoryIds });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default categoryService; 