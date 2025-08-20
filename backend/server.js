import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import ideaRoutes from './routes/ideas.js';
import userRoutes from './routes/users.js';

// Load environment variables
dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/final-project';
const port = process.env.PORT || 8080;

const app = express();

// MongoDB connection
mongoose.connect(mongoUrl);

const database = mongoose.connection;

// Basic error handling
database.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// Start server only after database connects
database.once('open', () => {
  console.log('✅ Connected to MongoDB');

  // Start server here
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello Technigo!');
});

app.use('/auth', authRoutes);
app.use('/ideas', ideaRoutes);
app.use('/users', userRoutes);
