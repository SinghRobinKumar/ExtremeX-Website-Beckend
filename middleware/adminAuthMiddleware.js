import jwt from 'jsonwebtoken';
import AdminUser from '../models/adminUserModel.js';

const authenticateAdmin = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await AdminUser.findByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token. Admin not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const authorize = (requiredPermission) => {
  return (req, res, next) => {
    const permissions = req.user.permissions || [];
    if (permissions.includes('all') || permissions.includes(requiredPermission)) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
  };
};

export { authenticateAdmin, authorize };
