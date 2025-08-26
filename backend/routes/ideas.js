import express from 'express';
import { body, validationResult } from 'express-validator';
import Idea from '../models/Idea.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes will be protected (require authentication)
router.use(authenticateToken);

router.post(
  '/',
  [
    body('title')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be 3-100 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be 10-2000 characters'),
  ],
  async (req, res) => {
    try {
      //check validations error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Validation failed', errors: errors.array() });
      }

      const { title, description } = req.body;

      //creates an new idea object
      const idea = new Idea({
        title,
        description,
        creator: req.user._id,
      });

      // Save to database
      await idea.save();

      res.json({
        message: 'Idea object created and saved to database!',
        idea: idea,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Internal server error', error: error, message });
    }
  }
);

// Get all ideas
router.get('/', async (req, res) => {
  try {
    console.log('Fetching ideas...');
    const ideas = await Idea.find()
      .populate('creator', 'firstName lastName email fullName')
      .populate('likedBy', 'firstName lastName email fullName') // Add this!
      .populate('connectedBy.user', 'firstName lastName email fullName')
      .sort({ createdAt: -1 }); // Newest first

    console.log('Ideas found:', ideas.length);
    console.log('First idea:', ideas[0]);

    res.json({
      message: 'Ideas retrieved successfully',
      ideas: ideas,
    });
  } catch (error) {
    console.error('Error in GET /ideas:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single idea by ID
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('creator', 'firstName lastName email fullName')
      .populate('likedBy', 'firstName lastName email fullName')
      .populate('connectedBy.user', 'firstName lastName email fullName');

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    res.json({
      message: 'Idea retrieved successfully',
      idea: idea,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update idea
router.put('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Check if user is the creator
    if (idea.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this idea' });
    }

    const updatedIdea = await Idea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('creator', 'firstName lastName email fullName');

    res.json({
      message: 'Idea updated successfully',
      idea: updatedIdea,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete idea
router.delete('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Check if user is the creator
    if (idea.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this idea' });
    }

    await Idea.findByIdAndDelete(req.params.id);

    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/unlike idea
router.post('/:id/like', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    const userId = req.user._id;

    // Check if user is trying to like their own idea
    if (idea.creator.toString() === userId.toString()) {
      return res.status(400).json({
        message: 'You cannot like your own idea',
      });
    }

    const isLiked = idea.likedBy.includes(userId);

    if (isLiked) {
      // Unlike
      idea.likedBy = idea.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Like
      idea.likedBy.push(userId);
    }

    await idea.save();
    await idea.populate('creator', 'firstName lastName email fullName');
    await idea.populate('likedBy', 'firstName lastName email fullName');
    await idea.populate(
      'connectedBy.user',
      'firstName lastName email fullName'
    );

    res.json({
      message: isLiked ? 'Idea unliked' : 'Idea liked',
      idea: idea,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Connect to idea
router.post('/:id/connect', async (req, res) => {
  try {
    // 1. Get the idea ID from the URL parameter
    const ideaId = req.params.id;

    // 2. Get the connection message from request body
    const { message } = req.body;

    // 3. Get the user ID from the authentication token (already available from middleware)
    const userId = req.user._id;

    // 4. Validate the message
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        message: 'Connection message is required',
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        message: 'Connection message cannot exceed 500 characters',
      });
    }

    // 5. Find the idea and check if it exists
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({
        message: 'Idea not found',
      });
    }

    // 6. Check if user is trying to connect to their own idea
    if (idea.creator.toString() === userId.toString()) {
      return res.status(400).json({
        message: 'You cannot connect to your own idea',
      });
    }

    // 7. Check if user already connected to this idea
    const alreadyConnected = idea.connectedBy.some(
      (connection) => connection.user.toString() === userId.toString()
    );

    if (alreadyConnected) {
      return res.status(400).json({
        message: 'You have already connected to this idea',
      });
    }

    // 7. Add the connection to the idea's connectedBy array
    idea.connectedBy.push({
      user: userId,
      message: message.trim(),
      connectedAt: new Date(),
    });

    // 8. Add the connection to the user's connectedIdeas array
    const user = await User.findById(userId);
    if (user) {
      user.connectedIdeas.push({
        idea: ideaId,
        message: message.trim(),
        connectedAt: new Date(),
      });
      await user.save();
    }

    // 9. Add the connection to the idea creator's receivedConnections array
    const ideaCreator = await User.findById(idea.creator);
    if (ideaCreator) {
      ideaCreator.receivedConnections.push({
        idea: ideaId,
        connectedBy: userId,
        message: message.trim(),
        connectedAt: new Date(),
      });
      await ideaCreator.save();
    }

    // 10. Save the updated idea
    await idea.save();

    // 11. Populate the creator and connectedBy user information
    await idea.populate('creator', 'firstName lastName email fullName');
    await idea.populate(
      'connectedBy.user',
      'firstName lastName email fullName'
    );

    // 12. Return the updated idea
    res.json({
      message: 'Successfully connected to idea',
      idea: idea,
    });
  } catch (error) {
    console.error('Error in POST /ideas/:id/connect:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// Disconnect from idea
router.delete('/:id/connect', async (req, res) => {
  try {
    // 1. Get the idea ID from the URL parameter
    const ideaId = req.params.id;

    // 2. Get the user ID from the authentication token
    const userId = req.user._id;

    // 3. Find the idea and check if it exists
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({
        message: 'Idea not found',
      });
    }

    // 4. Check if user has connected to this idea
    const connectionIndex = idea.connectedBy.findIndex(
      (connection) => connection.user.toString() === userId.toString()
    );

    if (connectionIndex === -1) {
      return res.status(400).json({
        message: 'You have not connected to this idea',
      });
    }

    // 5. Remove the connection from the idea's connectedBy array
    idea.connectedBy.splice(connectionIndex, 1);

    // 6. Remove the connection from the user's connectedIdeas array
    const user = await User.findById(userId);
    if (user) {
      user.connectedIdeas = user.connectedIdeas.filter(
        (connection) => connection.idea.toString() !== ideaId.toString()
      );
      await user.save();
    }

    // 7. Remove the connection from the idea creator's receivedConnections array
    const ideaCreator = await User.findById(idea.creator);
    if (ideaCreator) {
      ideaCreator.receivedConnections = ideaCreator.receivedConnections.filter(
        (connection) =>
          !(
            connection.idea.toString() === ideaId.toString() &&
            connection.connectedBy.toString() === userId.toString()
          )
      );
      await ideaCreator.save();
    }

    // 8. Save the updated idea
    await idea.save();

    // 9. Populate the creator and connectedBy user information
    await idea.populate('creator', 'firstName lastName email fullName');
    await idea.populate('likedBy', 'firstName lastName email fullName');
    await idea.populate(
      'connectedBy.user',
      'firstName lastName email fullName'
    );

    // 10. Return the updated idea
    res.json({
      message: 'Successfully disconnected from idea',
      idea: idea,
    });
  } catch (error) {
    console.error('Error in DELETE /ideas/:id/connect:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

export default router;
