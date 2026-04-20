const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    sub: user.account_id || user.id,
    email: user.university_email || user.email,
    username: user.username || user.full_name,
    accountType: user.account_type || user.role,
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(payload, config.apiKeys.jwtSecret, {
    expiresIn: config.apiKeys.jwtExpire,
    algorithm: 'HS256'
  });
};

// Verify JWT token
const verifyJWT = (token) => {
  try {
    return jwt.verify(token, config.apiKeys.jwtSecret);
  } catch (error) {
    throw new Error('Invalid token: ' + error.message);
  }
};

// Decode JWT token (without verification)
const decodeJWT = (token) => {
  return jwt.decode(token);
};

// Generate S3 key for product image
const generateS3Key = (productId, filename) => {
  const timestamp = Date.now();
  const ext = filename.split('.').pop();
  return `products/${productId}/${timestamp}-${uuidv4()}.${ext}`;
};

// Generate signed S3 URL
const generateSignedUrl = (bucket, key, expireIn = 3600) => {
  const params = {
    Bucket: bucket,
    Key: key,
    Expires: expireIn
  };
  
  // This would use AWS SDK in production
  return `https://${bucket}.s3.amazonaws.com/${key}`;
};

module.exports = {
  generateToken,
  verifyJWT,
  decodeJWT,
  generateS3Key,
  generateSignedUrl
};
