import api from './api.js';

// Get current user's profile
const getCurrentUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return {
      success: true,
      user: response.data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Update user profile
const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return {
      success: true,
      user: response.data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Get all users (for discovery)
const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return {
      success: true,
      users: response.data.users,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Get user by ID (for viewing profiles)
const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return {
      success: true,
      user: response.data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Get user's connections
const getUserConnections = async () => {
  try {
    const response = await api.get('/users/connections');
    return {
      success: true,
      connections: response.data.connections,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Create connection with another user
const createConnection = async (userId, message) => {
  try {
    const response = await api.post('/users/connections', {
      userId,
      message,
    });
    return {
      success: true,
      connection: response.data.connection,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Remove connection
const removeConnection = async (connectionId) => {
  try {
    await api.delete(`/users/connections/${connectionId}`);
    return {
      success: true,
      message: 'Connection removed successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Get ideas created by user
const getUserIdeas = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/ideas`);
    return {
      success: true,
      ideas: response.data.ideas,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Get ideas liked by current user
const getUserLikedIdeas = async () => {
  try {
    const response = await api.get('/users/liked-ideas');
    return {
      success: true,
      ideas: response.data.ideas,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Search users
const searchUsers = async (query) => {
  try {
    const response = await api.get(
      `/users/search?q=${encodeURIComponent(query)}`
    );
    return {
      success: true,
      users: response.data.users,
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
export const usersService = {
  getCurrentUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  getUserConnections,
  createConnection,
  removeConnection,
  getUserIdeas,
  getUserLikedIdeas,
  searchUsers,
};

export default usersService;
