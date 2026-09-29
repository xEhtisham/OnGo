import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token containing user ID
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {string} Signed JWT token
 */
export function generateToken(userId) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }

  return jwt.sign({ id: userId.toString() }, secret, {
    expiresIn: '7d',
  });
}

export default generateToken;
