const jwt = require('jsonwebtoken');

// Checks if the user is logged in (has a valid token)
const authenticate = (req, res, next) => {

  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, access denied' });
  }

  // Extracting token by removing 'Bearer ' prefix
  const token = authHeader.split(' ')[1];

  try {
    // Verifying the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next(); // move on to the next middleware or controller
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Checking if the logged-in user has the required role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied, insufficient permissions'
      });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };
