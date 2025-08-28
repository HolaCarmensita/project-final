import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Idea from '../models/Idea.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import cloudinary from '../services/cloudinary.js';
import stream from 'stream';
import {
  sendConnectionNotification,
  sendConnectionConfirmation,
} from '../services/emailService.js';

const router = express.Router();

// Helper function to upload buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, folder = 'ideas') =>
  new Promise((resolve, reject) => {
    const passthrough = new stream.PassThrough();
    const cldStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    passthrough.end(buffer);
    passthrough.pipe(cldStream);
  });

// Protect write/modify routes only; GET routes remain public

router.post(
  '/',
  authenticateToken,
  upload.array('files', 5), // Handle up to 5 files with field name 'files'
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
      // Check if database is connected
      if (mongoose.connection.readyState !== 1) {
        console.error('Database not connected. ReadyState:', mongoose.connection.readyState);
        return res.status(503).json({
          message: 'Database connection not available',
          error: 'Database disconnected'
        });
      }

      // Check validations error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Validation failed', errors: errors.array() });
      }

      const { title, description } = req.body;

      // Validate required fields
      if (!title || !description) {
        return res.status(400).json({
          message: 'Title and description are required'
        });
      }

      // Process uploaded files
      const imageUrls = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            const buffer = file.buffer;
            const result = await uploadBufferToCloudinary(buffer);
            const imageUrl = result.secure_url;
            console.log('File uploaded:', imageUrl);
            imageUrls.push(imageUrl);
          } catch (uploadError) {
            console.error('File upload error:', uploadError);
            // Continue with other files, don't fail the entire request
          }
        }
      }

      // Create a new idea object
      const idea = new Idea({
        title,
        description,
        creator: req.user._id,
        likeCount: 0,
        connectionCount: 0,
        images: imageUrls, // Add the image URLs to the idea
      });

      // Save to database
      await idea.save();

      // Populate the creator field before sending response
      await idea.populate('creator', 'firstName lastName email fullName role');

      res.json({
        message: 'Idea object created and saved to database!',
        idea: idea,
      });
    } catch (error) {
      console.error('Error creating idea:', error);
      res.status(500).json({
        message: 'Internal server error',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
);

// Get all ideas
router.get('/', async (req, res) => {
  try {
    console.log('Fetching ideas...');

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. ReadyState:', mongoose.connection.readyState);
      return res.status(503).json({
        message: 'Database connection not available',
        error: 'Database disconnected'
      });
    }

    // Use stored counters instead of aggregation for better performance
    const ideas = await Idea.find()
      .populate('creator', 'firstName lastName email fullName role')
      .sort({ createdAt: -1 })
      .lean();

    console.log('Ideas found:', ideas.length);

    // Add null check for ideas
    const safeIdeas = ideas || [];

    res.json({
      message: 'Ideas retrieved successfully',
      ideas: safeIdeas,
    });
  } catch (error) {
    console.error('Error in GET /ideas:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get single idea by ID
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('creator', 'firstName lastName email fullName role')
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
router.put('/:id', authenticateToken, async (req, res) => {
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
    }).populate('creator', 'firstName lastName email fullName role');

    res.json({
      message: 'Idea updated successfully',
      idea: updatedIdea,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete idea
router.delete('/:id', authenticateToken, async (req, res) => {
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
router.post('/:id/like', authenticateToken, async (req, res) => {
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

    // Check if user already liked this idea
    const user = await User.findById(userId);
    const isLiked = user.likedIdeas.includes(req.params.id);

    if (isLiked) {
      // Unlike - remove from user's likedIdeas and decrement counter
      user.likedIdeas = user.likedIdeas.filter(
        (ideaId) => ideaId.toString() !== req.params.id
      );
      idea.likeCount = Math.max(0, idea.likeCount - 1);
    } else {
      // Like - add to user's likedIdeas and increment counter
      user.likedIdeas.push(req.params.id);
      idea.likeCount += 1;
    }

    // Save both user and idea
    console.log('About to save user and idea...');
    const savedUser = await user.save();
    const savedIdea = await idea.save();

    console.log('Save operations completed');
    console.log('Saved user likedIdeas:', savedUser.likedIdeas);
    console.log('Saved idea likeCount:', savedIdea.likeCount);

    // Verify the save worked by fetching the user again
    const verifyUser = await User.findById(userId);
    console.log('Verified user likedIdeas from DB:', verifyUser.likedIdeas);

    res.json({
      message: isLiked ? 'Idea unliked' : 'Idea liked',
      success: true,
      user: savedUser,
      idea: savedIdea,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Connect to idea
router.post('/:id/connect', authenticateToken, async (req, res) => {
  try {
    // 1. Get the idea ID from the URL parameter
    const ideaId = req.params.id;

    // 2. Get the connection message and social link from request body
    const { message, socialLink } = req.body;

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
    const user = await User.findById(userId);
    const alreadyConnected = user.connectedIdeas.some(
      (connection) => connection.idea.toString() === ideaId.toString()
    );

    if (alreadyConnected) {
      return res.status(400).json({
        message: 'You have already connected to this idea',
      });
    }

    // 8. Add the connection to the user's connectedIdeas array
    user.connectedIdeas.push({
      idea: ideaId,
      message: message.trim(),
      socialLink: socialLink || null,
      connectedAt: new Date(),
    });

    // 9. Add the connection to the idea creator's receivedConnections array
    const ideaCreator = await User.findById(idea.creator);
    if (ideaCreator) {
      ideaCreator.receivedConnections.push({
        idea: ideaId,
        connectedBy: userId,
        message: message.trim(),
        socialLink: socialLink || null,
        connectedAt: new Date(),
      });
    }

    // 10. Increment the idea's connection counter
    idea.connectionCount += 1;

    // 11. Save all updates
    await Promise.all([user.save(), ideaCreator.save(), idea.save()]);

    // 12. Send email notifications (don't block the response if email fails)
    try {
      // Send notification to idea creator
      await sendConnectionNotification(
        ideaCreator,
        user,
        idea,
        message.trim(),
        socialLink
      );

      // Send confirmation to connecting user
      await sendConnectionConfirmation(user, ideaCreator, idea);
    } catch (emailError) {
      console.error('Failed to send connection emails:', emailError);
      // Don't fail the connection if email fails
    }

    // 13. Return success
    res.json({
      message: 'Successfully connected to idea',
      success: true,
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
router.delete('/:id/connect', authenticateToken, async (req, res) => {
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
    const user = await User.findById(userId);
    const connectionIndex = user.connectedIdeas.findIndex(
      (connection) => connection.idea.toString() === ideaId.toString()
    );

    if (connectionIndex === -1) {
      return res.status(400).json({
        message: 'You have not connected to this idea',
      });
    }

    // 5. Remove the connection from the user's connectedIdeas array
    user.connectedIdeas.splice(connectionIndex, 1);

    // 6. Remove the connection from the idea creator's receivedConnections array
    const ideaCreator = await User.findById(idea.creator);
    if (ideaCreator) {
      ideaCreator.receivedConnections = ideaCreator.receivedConnections.filter(
        (connection) =>
          !(
            connection.idea.toString() === ideaId.toString() &&
            connection.connectedBy.toString() === userId.toString()
          )
      );
    }

    // 7. Decrement the idea's connection counter
    idea.connectionCount = Math.max(0, idea.connectionCount - 1);

    // 8. Save all updates
    await Promise.all([user.save(), ideaCreator.save(), idea.save()]);

    // 9. Return success with updated user data
    res.json({
      message: 'Successfully disconnected from idea',
      success: true,
      user: user,
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
