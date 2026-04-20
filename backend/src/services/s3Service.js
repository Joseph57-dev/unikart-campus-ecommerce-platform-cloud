const { s3, config } = require('../config/aws');
const { v4: uuidv4 } = require('uuid');

// Upload image to S3
const uploadtoS3 = async (file, productId) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const key = `products/${productId}/${Date.now()}-${uuidv4()}.${file.originalname.split('.').pop()}`;

  const params = {
    Bucket: config.s3.bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  try {
    const result = await s3.upload(params).promise();
    return {
      url: result.Location,
      key: result.Key,
      bucket: result.Bucket
    };
  } catch (error) {
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

// Delete image from S3
const deleteFromS3 = async (key) => {
  const params = {
    Bucket: config.s3.bucket,
    Key: key
  };

  try {
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    throw new Error(`S3 delete failed: ${error.message}`);
  }
};

// Get signed URL for S3 object
const getSignedUrl = async (key, expiresIn = 3600) => {
  const params = {
    Bucket: config.s3.bucket,
    Key: key,
    Expires: expiresIn
  };

  try {
    const url = s3.getSignedUrl('getObject', params);
    return url;
  } catch (error) {
    throw new Error(`Failed to get signed URL: ${error.message}`);
  }
};

module.exports = {
  uploadtoS3,
  deleteFromS3,
  getSignedUrl
};
