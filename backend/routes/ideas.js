import express from 'express';
import { body, validationResult } from 'express-validator';
import Idea from '../models/Idea.js';
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
    const idea = await Idea.findById(req.params.id).populate(
      'creator',
      'firstName lastName email fullName'
    );

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

    res.json({
      message: isLiked ? 'Idea unliked' : 'Idea liked',
      idea: idea,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
