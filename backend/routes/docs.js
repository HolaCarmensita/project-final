import express from 'express';
import listEndpoints from 'express-list-endpoints';

const router = express.Router();

// API Documentation endpoint
router.get('/', (req, res) => {
  const endpoints = listEndpoints(req.app);

  // Add descriptions to each endpoint
  const documentedEndpoints = endpoints.map((endpoint) => {
    const descriptions = {
      '/': 'Welcome page',
      '/api-docs': 'API Documentation',
      '/auth/register': 'Register new user',
      '/auth/login': 'Login user',
      '/ideas': 'Get all ideas or create new idea',
      '/ideas/:id': 'Get, update, or delete specific idea',
      '/ideas/:id/like': 'Like/unlike an idea',
      '/users/profile': 'Get or update user profile',
      '/users/liked-ideas/:ideaId': 'Unlike an idea',
      '/users/account': 'Delete user account',
    };

    return {
      ...endpoint,
      description: descriptions[endpoint.path] || 'No description available',
      authentication: endpoint.path.startsWith('/auth')
        ? 'None'
        : endpoint.path === '/' || endpoint.path === '/api-docs'
        ? 'None'
        : 'Required',
    };
  });

  res.json({
    message: 'Creative Ideas API Documentation',
    version: '1.0.0',
    description:
      'A RESTful API for managing creative ideas and user connections',
    totalEndpoints: documentedEndpoints.length,
    authentication: {
      type: 'JWT Bearer Token',
      header: 'Authorization: Bearer YOUR_TOKEN',
    },
    endpoints: documentedEndpoints,
  });
});

export default router;
