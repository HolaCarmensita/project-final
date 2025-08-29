import api from './api.js';

// Retry utility function
const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
};

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
    // Create FormData for file upload
    const formData = new FormData();

    // Add text fields
    formData.append('title', ideaData.title);
    formData.append('description', ideaData.description);

    // Add files if they exist
    console.log('Files to upload:', ideaData.files ? ideaData.files.length : 0);
    if (ideaData.files && ideaData.files.length > 0) {
      ideaData.files.forEach((file, index) => {
        console.log(`File ${index}:`, file.name, 'Size:', file.size, 'Type:', file.type);
        formData.append('files', file);
      });
    }

    // Send with different headers for FormData
    const response = await api.post('/ideas', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

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
  return withRetry(async () => {
    try {
      const response = await api.post(`/ideas/${id}/like`);
      return {
        success: true,
        idea: response.data.idea,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }
  });
};

// Unlike idea (same endpoint as like - it toggles)
const unlikeIdea = async (id) => {
  return withRetry(async () => {
    try {
      const response = await api.post(`/ideas/${id}/like`);
      return {
        success: true,
        idea: response.data.idea,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }
  });
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
const connectToIdea = async (id, message, socialLink) => {
  return withRetry(async () => {
    try {
      const response = await api.post(`/ideas/${id}/connect`, {
        message,
        socialLink,
      });
      return {
        success: true,
        idea: response.data.idea,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }
  });
};

// Disconnect from idea
const disconnectFromIdea = async (id) => {
  return withRetry(async () => {
    try {
      const response = await api.delete(`/ideas/${id}/connect`);
      return {
        success: true,
        idea: response.data.idea,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }
  });
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
