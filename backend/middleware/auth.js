import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('Auth: Checking token...', {
      hasAuthHeader: !!authHeader,
      hasToken: !!token,
      tokenLength: token ? token.length : 0
    });

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Auth: Token decoded successfully', { userId: decoded.userId });

    // Find user
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      console.log('Auth: User not found', { userId: decoded.userId });
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('Auth: User authenticated successfully', {
      userId: user._id,
      email: user.email
    });

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth: Token verification failed', error.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Default export for convenience
const auth = authenticateToken;
export default auth;
