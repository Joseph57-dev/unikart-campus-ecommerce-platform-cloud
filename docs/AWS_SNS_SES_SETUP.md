# AWS SNS + SES Setup Guide for Unikart

This guide explains how to configure AWS SNS (Simple Notification Service) and SES (Simple Email Service) for order notifications in the Unikart e-commerce platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS SNS Setup](#aws-sns-setup)
3. [AWS SES Setup](#aws-ses-setup)
4. [Environment Configuration](#environment-configuration)
5. [Testing](#testing)
6. [Production Deployment](#production-deployment)

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js and npm installed
- Unikart backend project

## AWS SNS Setup

### Step 1: Create SNS Topic

1. Log in to AWS Console
2. Navigate to **SNS (Simple Notification Service)**
3. Click **Create topic**
4. Choose **Standard** type
5. Enter topic details:
   - **Name**: `order-notifications`
   - **Display name**: `Unikart Orders`
6. Click **Create topic**

### Step 2: Create Subscription

1. After creating the topic, click on it
2. Go to the **Subscriptions** tab
3. Click **Create subscription**
4. Configure subscription:
   - **Protocol**: Choose your notification method:
     - `Email` - for email notifications
     - `HTTPS` - for webhook notifications to your admin dashboard
     - `Lambda` - for serverless processing
     - `SMS` - for text message notifications
   - **Endpoint**: Enter the endpoint based on your protocol
5. Click **Create subscription**

### Step 3: Set Topic Policy (Optional)

For production, configure a proper access policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "events.amazonaws.com"
      },
      "Action": "SNS:Publish",
      "Resource": "arn:aws:sns:REGION:ACCOUNT-ID:order-notifications"
    }
  ]
}
```

## AWS SES Setup

### Step 1: Verify Domain or Email

1. Navigate to **SES (Simple Email Service)**
2. Go to **Configuration** > **Verified identities**
3. Click **Create identity**
4. Choose identity type:
   - **Domain** (Recommended for production)
     - Enter your domain (e.g., `yourdomain.com`)
     - Follow DNS verification steps
   - **Email address** (For testing)
     - Enter email address
     - Click verification link in confirmation email

### Step 2: Configure DKIM (For Domain)

1. After domain verification, enable DKIM
2. Add the provided CNAME records to your DNS
3. Wait for DNS propagation

### Step 3: Move Out of Sandbox (Production)

SES accounts start in sandbox mode with limitations:

1. Go to **Account dashboard** in SES
2. Click **Request production access**
3. Fill out the form:
   - Describe your use case
   - Provide website URL
   - Estimate sending volume
4. Wait for AWS approval (usually 24 hours)

### Step 4: Create Configuration Set (Optional)

1. Go to **Configuration** > **Configuration sets**
2. Click **Create configuration set**
3. Name: `UnikartConfigSet`
4. Add event destinations if needed (CloudWatch, Kinesis Firehose)

## Environment Configuration

### Update .env File

Copy the environment variables to your `.env` file:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key

# SNS Configuration
AWS_SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789012:order-notifications

# SES Configuration
AWS_SES_SENDER_EMAIL=noreply@yourdomain.com
AWS_SES_CONFIGURATION_SET=UnikartConfigSet
```

### IAM Permissions

Create an IAM policy for your application:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sns:Publish"
      ],
      "Resource": "arn:aws:sns:*:*:order-notifications"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

## Testing

### Test SNS Notification

```javascript
const { sendSNSNotification } = require('./src/services/notificationService');

// Test notification
sendSNSNotification({
  eventType: 'test',
  message: 'This is a test notification'
}, 'Test Notification').then(result => {
  console.log('SNS Result:', result);
}).catch(err => {
  console.error('SNS Error:', err);
});
```

### Test SES Email

```javascript
const { sendSESEmail } = require('./src/services/notificationService');

// Test email
sendSESEmail(
  'test@example.com',
  'Test Email Subject',
  '<h1>Hello World</h1>',
  'Hello World (text version)'
).then(result => {
  console.log('SES Result:', result);
}).catch(err => {
  console.error('SES Error:', err);
});
```

### Run Unit Tests

```bash
cd src/backend
npm test -- notificationService.test.js
```

## Production Deployment

### AWS Deployment Options

#### Option 1: EC2 with IAM Role

1. Create IAM role with SNS/SES permissions
2. Attach role to EC2 instance
3. No need for access keys in environment

#### Option 2: ECS/Fargate

1. Create task execution role with SNS/SES permissions
2. Configure task definition to use the role
3. Pass configuration via environment variables

#### Option 3: Lambda

1. Create Lambda execution role with SNS/SES permissions
2. Configure environment variables in Lambda function
3. Use Lambda layers for dependencies

### Monitoring

#### CloudWatch Alarms

Set up alarms for:
- SNS delivery failures
- SES sending limits
- Email bounce/complaint rates

#### SES Dashboard

Monitor:
- Sending statistics
- Reputation metrics
- Bounce and complaint rates

### Best Practices

1. **Error Handling**: All notification calls are non-blocking and catch errors gracefully
2. **Rate Limiting**: SES has sending limits - monitor and request increases as needed
3. **Email Templates**: Consider using SES templates for consistent branding
4. **Bounce Handling**: Implement bounce/complaint handling to maintain sender reputation
5. **Logging**: Log all notification attempts for debugging
6. **Fallback**: Consider fallback mechanisms for critical notifications

## Troubleshooting

### Common Issues

1. **"SES Sender Email not configured"**
   - Check `AWS_SES_SENDER_EMAIL` environment variable
   - Ensure email/domain is verified in SES

2. **"SNS Topic ARN not configured"**
   - Check `AWS_SNS_TOPIC_ARN` environment variable
   - Verify topic exists in the correct region

3. **"Email sending failed"**
   - Check SES sandbox status
   - Verify sender identity
   - Check SES sending limits

4. **"Access denied"**
   - Verify IAM permissions
   - Check resource-based policies

### Debug Mode

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

## API Reference

### notificationService Functions

| Function | Description |
|----------|-------------|
| `sendSNSNotification(message, subject)` | Send notification to SNS topic |
| `sendSESEmail(to, subject, htmlBody, textBody, replyTo)` | Send email via SES |
| `sendOrderConfirmationEmail(order, email, name)` | Send order confirmation to customer |
| `sendAdminOrderNotification(order)` | Send new order alert to admin via SNS |
| `sendShippingNotificationEmail(order, email, name, trackingNumber, carrier)` | Send shipping update |

## Additional Resources

- [AWS SNS Documentation](https://docs.aws.amazon.com/sns/latest/dg/welcome.html)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/latest/dg/welcome.html)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)