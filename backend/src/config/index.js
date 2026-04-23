require('dotenv').config();

module.exports = {
  port: process.env.PORT || 80,
  environment: process.env.NODE_ENV || 'development',
  
  // Database
  database: {
    url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },

  // JWT (API authentication)
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',

  // AWS
  aws: {
    region: process.env.AWS_REGION || 'eu-north-1',
    s3: {
      bucket: process.env.AWS_S3_BUCKET || 'unikart-products',
      region: process.env.AWS_S3_REGION || process.env.AWS_REGION || 'eu-north-1'
    },
    sns: {
      topicArn: process.env.AWS_SNS_TOPIC_ARN
    },
    ses: {
      senderEmail: process.env.AWS_SES_SENDER_EMAIL,
      configurationSet: process.env.AWS_SES_CONFIGURATION_SET
    }
  },

  // API Keys (non-JWT secrets)
  apiKeys: {
    secret: process.env.API_SECRET_KEY
  },

  // URLs
  urls: {
    frontend: process.env.FRONTEND_URL || 'http://unikart-alb-296069847.eu-north-1.elb.amazonaws.com',
    backend: process.env.BACKEND_URL || 'http://unikart-alb-296069847.eu-north-1.elb.amazonaws.com',
    apiBase:
      process.env.API_BASE_URL ||
      'http://unikart-alb-296069847.eu-north-1.elb.amazonaws.com/api'
  },

  // File Upload
  upload: {
    maxSize: parseInt(process.env.FILE_UPLOAD_SIZE) || 5242880 // 5MB
  }
};
