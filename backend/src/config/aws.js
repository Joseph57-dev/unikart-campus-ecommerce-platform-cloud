const AWS = require('aws-sdk');
const config = require('./index');

// Configure AWS
AWS.config.update({
  region: config.aws.region,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// S3 Client
const s3 = new AWS.S3({
  region: config.aws.s3.region
});

// SNS Client
const sns = new AWS.SNS({
  region: config.aws.region
});

// SES Client
const ses = new AWS.SES({
  region: config.aws.region
});

module.exports = {
  s3,
  sns,
  ses,
  config: config.aws
};
