import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { inMemoryDB } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'agrivalue_super_secret_jwt_key_2026';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      let user = null;
      try {
        user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        // Fallback to in-memory store
        user = inMemoryDB.users.find(u => u._id.toString() === decoded.id.toString());
      }

      if (!user) {
        // Try finding in in-memory
        user = inMemoryDB.users.find(u => u._id.toString() === decoded.id.toString());
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'User account not found' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Auth Token Verification Failed:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired authorization token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role || 'Guest'}' does not have access to this resource`
      });
    }
    next();
  };
};

export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '30d'
  });
};
