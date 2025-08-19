import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

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
    consogit adle.log(`🚀 Server running on http://localhost:${port}`);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello Technigo!');
});
