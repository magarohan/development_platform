const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
  console.log('Token:', token);

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticate;
