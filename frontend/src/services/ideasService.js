import api from './api.js';

// Get all ideas
const getAllIdeas = async () => {
  try {
    const response = await api.get('/ideas');
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

// Get single idea by ID
const getIdeaById = async (id) => {
  try {
    const response = await api.get(`/ideas/${id}`);
    return {
      success: true,
      idea: response.data.idea,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Create new idea
const createIdea = async (ideaData) => {
  try {
    const response = await api.post('/ideas', ideaData);
    return {
      success: true,
      idea: response.data.idea,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Update idea
const updateIdea = async (id, ideaData) => {
  try {
    const response = await api.put(`/ideas/${id}`, ideaData);
    return {
      success: true,
      idea: response.data.idea,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Delete idea
const deleteIdea = async (id) => {
  try {
    await api.delete(`/ideas/${id}`);
    return {
      success: true,
      message: 'Idea deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Like idea
const likeIdea = async (id) => {
  try {
    const response = await api.post(`/ideas/${id}/like`);
    return {
      success: true,
      idea: response.data.idea,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Unlike idea (same endpoint as like - it toggles)
const unlikeIdea = async (id) => {
  try {
    const response = await api.post(`/ideas/${id}/like`);
    return {
      success: true,
      idea: response.data.idea,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Get ideas by user
const getIdeasByUser = async (userId) => {
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

// Get liked ideas for current user
const getLikedIdeas = async () => {
  try {
    const response = await api.get('/ideas/liked');
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

// Connect to idea
const connectToIdea = async (id, message) => {
  try {
    const response = await api.post(`/ideas/${id}/connect`, { message });
    return {
      success: true,
      idea: response.data.idea,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

// Disconnect from idea
const disconnectFromIdea = async (id) => {
  try {
    const response = await api.delete(`/ideas/${id}/connect`);
    return {
      success: true,
      idea: response.data.idea,
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
export const ideasService = {
  getAllIdeas,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  likeIdea,
  unlikeIdea,
  getIdeasByUser,
  getLikedIdeas,
  connectToIdea,
  disconnectFromIdea,
};

export default ideasService;
