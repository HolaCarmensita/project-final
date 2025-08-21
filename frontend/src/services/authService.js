import api from './api.js';

// Token management functions
const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

// Store token in localStorage
const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Store user data in localStorage
const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Get user data from localStorage
const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Remove user data from localStorage
const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!getToken();
};

// Login function
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { token, user } = response.data;

    // Store token and user data
    setToken(token);
    setUser(user);

    return {
      success: true,
      user,
      token,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Register function
const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);

    const { token, user } = response.data;

    // Store token and user data
    setToken(token);
    setUser(user);

    return {
      success: true,
      user,
      token,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Logout function
const logout = () => {
  removeToken();
  removeUser();

  return {
    success: true,
    message: 'Logged out successfully',
  };
};

// Get current user
const getCurrentUser = () => {
  return getUser();
};

// Update user profile
const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    const updatedUser = response.data.user;

    // Update stored user data
    setUser(updatedUser);

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Export all functions
export const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  isAuthenticated,
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
};

export default authService;
