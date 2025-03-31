import axios from 'axios';
import authServiceInstance from './authService';

class CategoryService {
  constructor() {
    this.api = axios.create({
        baseURL: 'http://localhost:8082/api',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
    });
    this.api.interceptors.request.use(
      (config) => {
        const token = authServiceInstance.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  

  // Get all categories
  async getAllCategories() {
    try {
      const response = await this.api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get category by ID
  async getCategoryById(categoryId) {
    try {
      const response = await this.api.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      throw error;
    }
  }

  // Get categories with product counts
  async getCategoriesWithProducts() {
    try {
      const response = await this.api.get('/categories/with-products');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories with products:', error);
      throw error;
    }
  }

  // Search categories
  async searchCategories(query) {
    try {
      const response = await this.api.get(`/categories/search?name=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;