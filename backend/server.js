import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import ideaRoutes from './routes/ideas.js';
import userRoutes from './routes/users.js';
import docsRoutes from './routes/docs.js';

// Load environment variables
dotenv.config();

// --- MongoDB connection diagnostics ---
const redactMongoUri = (uri = '') => {
  try {
    if (!uri) return '[empty]';
    // Hide credentials but show host/db for debugging
    const url = new URL(
      uri.replace('mongodb+srv://', 'https://').replace('mongodb://', 'http://')
    );
    const protocol = uri.startsWith('mongodb+srv://')
      ? 'mongodb+srv://'
      : 'mongodb://';
    const host = url.host;
    const pathname = url.pathname;
    return `${protocol}<credentials>@${host}${pathname}`;
  } catch {
    return '[unparseable URI]';
  }
};

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/final-project';
const port = process.env.PORT || 8080;

console.log('Boot: Node version:', process.version);
console.log('Boot: Mongo URI (redacted):', redactMongoUri(mongoUrl));
console.log('Boot: PORT:', port);

const app = express();

// MongoDB connection
console.log('Mongo: attempting to connect...');
mongoose.set('strictQuery', true);
mongoose.connect(mongoUrl, {
  serverSelectionTimeoutMS: 15000,
});

const database = mongoose.connection;

database.on('connecting', () => console.log('Mongo: connecting...'));
database.on('connected', () => console.log('Mongo: connected'));
database.on('open', () => console.log('Mongo: connection open'));
database.on('error', (err) =>
  console.error('Mongo: connection error:', err?.message || err)
);
database.on('disconnected', () => console.warn('Mongo: disconnected'));
database.on('reconnected', () => console.log('Mongo: reconnected'));

// Basic error handling already above; keep process-level guards
process.on('unhandledRejection', (reason) => {
  console.error('Process: unhandledRejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Process: uncaughtException:', err);
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
// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // Common React dev server
  'http://localhost:4173', // Vite preview
  'https://aesthetic-dolphin-63dc60.netlify.app', // Your Netlify URL
  process.env.FRONTEND_URL, // Production frontend URL
].filter(Boolean); // Remove any undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Basic route
app.get('/', (req, res) => {
  res.send('Hello Technigo!');
});

app.use('/auth', authRoutes);
app.use('/ideas', ideaRoutes);
app.use('/users', userRoutes);
app.use('/api-docs', docsRoutes);
