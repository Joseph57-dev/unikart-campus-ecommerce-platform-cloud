import apiClient from './api';

export const productService = {
  // Get all products
  getProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('min_price', filters.minPrice);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.featured) params.append('featured', filters.featured);

      const response = await apiClient.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Create product (Admin/Vendor)
  createProduct: async (productData, imageFile) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await apiClient.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Update product (Admin/Vendor)
  updateProduct: async (id, productData, imageFile) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await apiClient.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Delete product (Admin/Vendor)
  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }
};

export default productService;
