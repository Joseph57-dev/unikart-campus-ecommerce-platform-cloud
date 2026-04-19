const jwt = require('jsonwebtoken');
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const config = require('../config');

// Create Cognito JWT verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: config.aws.cognito.userPoolId,
  tokenUse: 'access',
  clientId: config.aws.cognito.appClientId,
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided',
      data: null
    });
  }

  try {
    const decoded = jwt.verify(token, config.apiKeys.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
      data: null
    });
  }
};

// Verify Cognito JWT token
const verifyCognitoToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided',
      data: null
    });
  }

  try {
    // Verify token with Cognito
    const payload = await verifier.verify(token);

    req.user = {
      sub: payload.sub,
      email: payload.email,
      username: payload['cognito:username'],
      accountType: payload['custom:account_type'] || 'student'
    };
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token: ' + error.message,
      data: null
    });
  }
};

// Check user role/permissions
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.accountType || req.user?.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Insufficient permissions',
        data: null
      });
    }
    next();
  };
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      data: err.details || err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized',
      data: null
    });
  }

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    data: null
  });
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

module.exports = {
  verifyToken,
  verifyCognitoToken,
  authorize,
  errorHandler,
  requestLogger
};
