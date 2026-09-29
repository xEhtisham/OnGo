import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password are required',
      });
    }

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Validate name length
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return res.status(400).json({
        status: 'error',
        message: 'Name must be between 2 and 50 characters',
      });
    }

    // Validate email format
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'A user with this email already exists',
      });
    }

    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in database
    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Return safe user representation
    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
// @access  Public
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validate input presence
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query user by email (explicitly selecting hidden password)
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    // Generic error message prevents account enumeration attacks
    const invalidAuthMessage = 'Invalid email or password';

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: invalidAuthMessage,
      });
    }

    // Compare provided password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: invalidAuthMessage,
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private (Protected by JWT)
export async function getMe(req, res, next) {
  try {
    // req.user was populated by the protect middleware
    return res.status(200).json({
      status: 'success',
      data: {
        user: req.user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
}
