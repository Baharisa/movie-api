const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'supersecretkey123'); // Same secret used in login
    req.user = decoded.id; // Attach user ID to request
    next();
  } catch (err) {
    console.error(' Invalid token:', err);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth;
