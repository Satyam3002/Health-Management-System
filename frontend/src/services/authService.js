const API_BASE_URL = process.env.REACT_APP_API_URL + '/auth' || 'http://localhost:5000/api/v1/auth';

class AuthService {
  constructor() {
    this.user = this.getUserFromStorage();
    this.token = this.getTokenFromStorage();
  }

  getUserFromStorage() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from storage:', error);
      return null;
    }
  }

  getTokenFromStorage() {
    return localStorage.getItem('token');
  }

  // Set user and token in localStorage
  setUserAndToken(user, token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.user = user;
    this.token = token;
  }

  // Clear user and token from localStorage
  clearUserAndToken() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.user = null;
    this.token = null;
  }

  isAuthenticated() {
    return !!this.user && !!this.token;
  }


  getCurrentUser() {
    return this.user;
  }


  getCurrentToken() {
    return this.token;
  }


  async login(email, password) {
    try {

      if (email === 'demo@example.com' && password === 'password123') {
        const mockUser = {
          id: 'user123',
          email: email,
          name: 'Demo User',
          role: 'patient'
        };
        
        const mockToken = 'demo-jwt-token-' + Date.now();
        
        this.setUserAndToken(mockUser, mockToken);
        
        return {
          success: true,
          user: mockUser,
          token: mockToken
        };
      }


      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const user = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.fullName,
        role: 'patient'
      };

      this.setUserAndToken(user, data.token);

      return {
        success: true,
        user: user,
        token: data.token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }


  async logout() {
    try {
      this.clearUserAndToken();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }


  async register(email, password, name) {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          fullName: name 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const user = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.fullName,
        role: 'patient'
      };

      this.setUserAndToken(user, data.token);

      return {
        success: true,
        user: user,
        token: data.token
      };
    } catch (error) {
      console.error('Register error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  }
}


const authService = new AuthService();

export default authService; 