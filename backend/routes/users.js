import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Idea from '../models/Idea.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.json({
      message: 'Profile retrieved successfully',
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put(
  '/profile',
  [
    body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
    body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
    body('role').optional().trim().isLength({ max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('link').optional().trim().isLength({ max: 200 }),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
        runValidators: true,
      }).select('-password');

      res.json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Unlike a liked idea
router.delete('/liked-ideas/:ideaId', async (req, res) => {
  try {
    const { ideaId } = req.params;

    // Remove idea from user's likedIdeas
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { likedIdeas: ideaId } },
      { new: true }
    ).select('-password');

    // Remove user from idea's likedBy
    await Idea.findByIdAndUpdate(ideaId, { $pull: { likedBy: req.user._id } });

    res.json({
      message: 'Idea unliked successfully',
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user account
router.delete('/account', async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all ideas created by this user
    await Idea.deleteMany({ creator: userId });

    // Remove user from all liked ideas
    await Idea.updateMany({ likedBy: userId }, { $pull: { likedBy: userId } });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
