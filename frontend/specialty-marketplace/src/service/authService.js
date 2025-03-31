import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth/';

class authService {
  async login(username, password) {
    try {
      const response = await axios.post(API_URL + 'signin', {
        username,
        password
      });
      
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('user');
  }

  async register(username, email, password, firstName, lastName, roles = ['user']) {
    try {
      return await axios.post(API_URL + 'signup', {
        username,
        email,
        password,
        firstName,
        lastName,
        roles
      });
    } catch (error) {
      throw error;
    }
  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  isLoggedIn() {
    const user = this.getCurrentUser();
    return !!user;
  }

  getToken() {
    const user = this.getCurrentUser();
    return user?.accessToken;
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role);
  }
}

const authServiceInstance = new authService();
export default authServiceInstance;
