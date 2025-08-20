import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters long'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters long'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    role: {
      type: String,
      default: 'creative mind',
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    link: {
      type: String,
      trim: true,
      maxlength: [200, 'Link cannot exceed 200 characters'],
    },
    likedIdeas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Idea',
      },
    ],
    connectedIdeas: [
      {
        idea: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Idea',
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

// Virtual field to get full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual field to get like count
userSchema.virtual('likeCount').get(function () {
  return this.likedIdeas ? this.likedIdeas.length : 0;
});

// Virtual field to get connection count
userSchema.virtual('connectionCount').get(function () {
  return this.connectedIdeas ? this.connectedIdeas.length : 0;
});

// Virtual field to check if user has description
userSchema.virtual('hasDescription').get(function () {
  return this.description && this.description.trim().length > 0;
});

// Virtual field to check if user has link
userSchema.virtual('hasLink').get(function () {
  return this.link && this.link.trim().length > 0;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with salt rounds of 10
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
