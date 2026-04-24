const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Verifies Unikart API JWT (HS256) from Authorization: Bearer <token>.
 * Attaches req.user: { sub, email, accountType } (sub is account_id as string).
 */
const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided',
      data: null
    });
  }

  const secret = config.apiKeys.jwtSecret;
  if (!secret) {
    return res.status(500).json({
      status: 'error',
      message: 'Server authentication is not configured',
      data: null
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = {
      sub: decoded.sub,
      email: decoded.email,
      accountType: decoded.accountType
    };
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
      data: null
    });
  }
};

module.exports = verifyJwt;
