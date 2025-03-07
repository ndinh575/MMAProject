const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: 'Invalid token. User not found.' });
    }
    if (user.id === req.params.id || user.role === 'admin') {
      req.user = user;
      return next();
    }
    return res.status(403).json({ message: "Forbidden 403" });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
