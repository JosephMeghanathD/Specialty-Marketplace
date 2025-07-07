import axios from 'axios';

const API_URL = 'https://user-service-826904415366.us-central1.run.app/api/auth/';

class authService {
  async login(username, password) {
    try {
      const response = await axios.post(API_URL + 'signin', {
        username,
        password
      });
      
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('userLoggedInAt', Date.now())
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

  removeUser() {
    localStorage.removeItem("user");
  }

  isLoggedIn() {
    const user = this.getCurrentUser();
    return !!user;
  }

  getLogginAt() {
    return localStorage.getItem("userLoggedInAt");
  }

  getToken() {
    const user = this.getCurrentUser();
    const tokenTTL = this.getCurrentUser()?.tokenTTL;
    if (tokenTTL >=  (Date.now() - this.getLogginAt())) {
      return user?.accessToken;
    }
    this.removeUser();
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role);
  }
}

const authServiceInstance = new authService();
export default authServiceInstance;
