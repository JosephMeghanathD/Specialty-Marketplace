import axios from 'axios';
import authServiceInstance from './authService';

const API_BASE_URL = 'https://product-service-826904415366.us-central1.run.app/api/orders'; // Base URL for order operations

class OrderService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL
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

  async createOrder(orderData) {
    try {
      const response = await this.api.post('', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error.message);
      throw error;
    }
  }

  async getCurrentUserOrders() {
    try {
      // Assuming backend has an endpoint like /user or similar tied to authenticated user
      // Adjust endpoint if necessary based on your backend implementation
      const response = await this.api.get('/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user orders:', error.response?.data || error.message);
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await this.api.get(`/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error.response?.data || error.message);
      throw error;
    }
  }

  async cancelOrder(orderId) {
    try {
      const response = await this.api.post(`/${orderId}/cancel`); // Assuming POST for cancellation
      return response.data; // Or return true/status code based on backend
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error.response?.data || error.message);
      throw error;
    }
  }

  // --- Admin specific methods (example) ---

  async getAllOrders() {
    try {
      const response = await this.api.get('');
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await this.api.put(`/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for order ${orderId}:`, error.response?.data || error.message);
      throw error;
    }
  }

}

const orderServiceInstance = new OrderService();
export default orderServiceInstance;