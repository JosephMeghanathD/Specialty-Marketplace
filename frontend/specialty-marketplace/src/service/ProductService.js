import axios from 'axios';
import authServiceInstance from './authService'; // Assuming this handles token logic

class ProductService {
    constructor() {
        this.api = axios.create({
            baseURL: 'http://localhost:8082/api' // Ensure your product/order service URL
        });

        // Request interceptor to add JWT token
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
            console.error('Error fetching all products:', error);
            throw error;
        }
    }

    // Get a single product by its ID
    async getProductById(productId) {
        try {
            const response = await this.api.get(`/products/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            throw error; // Re-throw to be caught by the calling component
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

    // Get overall popular products (Top 5 example)
    async getPopularProducts() {
        try {
            const response = await this.api.get('/products/popular');
            return response.data;
        } catch (error) {
            console.error('Error fetching popular products:', error);
            throw error;
        }
    }

    async getPopularProductsByCategory(categoryId) {
        if (!categoryId) {
            console.warn("getPopularProductsByCategory called with invalid categoryId:", categoryId);
            return []; 
        }
        try {
            const response = await this.api.get(`/products/popular/${categoryId}`);
            return response.data;
        } catch (error) {
            // Don't throw, just log and return empty so page doesn't fully break
            console.error(`Error fetching popular products for category ${categoryId}:`, error);
            return []; // Return empty array on error for this non-critical section
        }
    }


    // Get products by category ID (for filtering page)
    async getProductsByCategory(categoryId) {
        try {
            const response = await this.api.get(`/products/category/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching products for category ${categoryId}:`, error);
            throw error;
        }
    }

    // Search products
    async searchProducts(query) {
        try {
            const response = await this.api.get(`/products/search?name=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }

    // --- Admin Methods (ensure backend requires ADMIN role) ---

    async createProduct(productData) {
        try {
            const response = await this.api.post('/products', productData);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    async updateProduct(productId, productData) {
        try {
            const response = await this.api.put(`/products/${productId}`, productData);
            return response.data;
        } catch (error) {
            console.error(`Error updating product ${productId}:`, error);
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            await this.api.delete(`/products/${productId}`);
            return true; // Indicate success
        } catch (error) {
            console.error(`Error deleting product ${productId}:`, error);
            throw error;
        }
    }
}

const productService = new ProductService();
export default productService;