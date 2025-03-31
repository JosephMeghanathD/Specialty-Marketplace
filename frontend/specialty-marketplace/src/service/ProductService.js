import axios from 'axios';
import authServiceInstance from './authService';


class ProductService {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8082/api'
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

  // Get all products
  async getAllProducts() {
    try {
      const response = await this.api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts() {
    try {
      const response = await this.api.get('/products/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId) {
    try {
      const response = await this.api.get(`/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  }

  // Get product details
  async getProductById(productId) {
    try {
      const response = await this.api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  }

  // Search products
  async searchProducts(query) {
    try {
      const response = await this.api.get(`/products/search?name=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}

const productService = new ProductService();
export default productService;