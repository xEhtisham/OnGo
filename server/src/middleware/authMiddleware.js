import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to authenticate requests using a Bearer JWT token
 */
export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Check for presence and format of Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, no token provided',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, token missing',
      });
    }

    // Verify token signature & expiration
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        status: 'error',
        message: 'Server security configuration error',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (jwtErr) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, token invalid or expired',
      });
    }

    // Retrieve user and ensure account still exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists',
      });
    }

    // Attach authenticated user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export default protect;
