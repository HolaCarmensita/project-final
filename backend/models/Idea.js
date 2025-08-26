import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    connectedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
          maxlength: [500, 'Connection message cannot exceed 500 characters'],
        },
        connectedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual field to get like count
ideaSchema.virtual('likeCount').get(function () {
  return this.likedBy.length;
});

// Virtual field to get connections count
ideaSchema.virtual('connectionCount').get(function () {
  return this.connectedBy.length;
});

// Virtual field to get image count
ideaSchema.virtual('imageCount').get(function () {
  return this.images.length;
});

// Virtual field to check if idea has images
ideaSchema.virtual('hasImages').get(function () {
  return this.images.length > 0;
});

// Ensure virtual fields are serialized
ideaSchema.set('toJSON', { virtuals: true });
ideaSchema.set('toObject', { virtuals: true });

const Idea = mongoose.model('Idea', ideaSchema);

export default Idea;
