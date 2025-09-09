const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid. User not found.' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is deactivated.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication.' 
    });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Role '${req.user.role}' is not authorized.` 
      });
    }

    next();
  };
};

// Optional authentication (for routes that work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

// Check if user owns resource or has permission
const checkResourceOwnership = (Model, resourceField = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceField];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ 
          success: false, 
          message: 'Resource not found.' 
        });
      }

      // Admin and managers can access all resources
      if (['admin', 'manager'].includes(req.user.role)) {
        req.resource = resource;
        return next();
      }

      // Check if user owns the resource or is assigned to it
      const isOwner = resource.client?.toString() === req.user._id.toString() ||
                     resource.createdBy?.toString() === req.user._id.toString() ||
                     resource.assignedTo?.some(id => id.toString() === req.user._id.toString());

      if (!isOwner) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. You do not have permission to access this resource.' 
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Resource ownership check error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error during permission check.' 
      });
    }
  };
};

module.exports = {
  auth,
  authorize,
  optionalAuth,
  checkResourceOwnership
};
