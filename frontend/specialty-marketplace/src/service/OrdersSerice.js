import axios from 'axios';
import authServiceInstance from './authService';


class OrderService {
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

  

  // Get current user orders
  async getCurrentUserOrders() {
    try {
      const response = await this.api.get('/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user orders:', error);
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await this.api.get(`/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }

  // Create new order
  async createOrder(orderData) {
    try {
      const response = await this.api.post('', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId) {
    try {
      await this.api.post(`/${orderId}/cancel`);
      return true;
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  }

  // Get recent orders for current user
  async getRecentOrders() {
    try {
      // We need to get the userId from the authenticated user
      // For now, we'll just use the '/user' endpoint to get orders
      const response = await this.api.get('/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  }

  // For admin functions
  // Get all orders (admin only)
  async getAllOrders() {
    try {
      const response = await this.api.get('');
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }

  // Get orders by status (admin only)
  async getOrdersByStatus(status) {
    try {
      const response = await this.api.get(`/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders with status ${status}:`, error);
      throw error;
    }
  }

  // Update order status (admin only)
  async updateOrderStatus(orderId, status) {
    try {
      const response = await this.api.put(`/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for order ${orderId}:`, error);
      throw error;
    }
  }

  // Update tracking info (admin only)
  async updateTrackingInfo(orderId, trackingNumber) {
    try {
      const response = await this.api.put(`/${orderId}/tracking`, { trackingNumber });
      return response.data;
    } catch (error) {
      console.error(`Error updating tracking for order ${orderId}:`, error);
      throw error;
    }
  }

  // Get order status counts (admin only)
  async getOrderStatusCounts() {
    try {
      const response = await this.api.get('/stats/status-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching order status counts:', error);
      throw error;
    }
  }
}

export default new OrderService();