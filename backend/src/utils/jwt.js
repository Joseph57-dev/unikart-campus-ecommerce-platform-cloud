const { v4: uuidv4 } = require('uuid');

// S3-related helpers (API JWT is handled in authController + middleware/jwtAuth.js).

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
  generateS3Key,
  generateSignedUrl
};