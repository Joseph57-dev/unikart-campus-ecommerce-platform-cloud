const { sns, ses, config } = require('../config/aws');

/**
 * Send notification via SNS topic
 * Used for order notifications to admin/staff
 */
const sendSNSNotification = async (message, subject = 'Order Notification') => {
  if (!config.sns.topicArn) {
    console.warn('SNS Topic ARN not configured, skipping SNS notification');
    return null;
  }

  const params = {
    TopicArn: config.sns.topicArn,
    Message: JSON.stringify(message),
    Subject: subject,
    MessageAttributes: {
      EventType: {
        DataType: 'String',
        StringValue: message.eventType || 'order_notification'
      },
      Timestamp: {
        DataType: 'String',
        StringValue: new Date().toISOString()
      }
    }
  };

  try {
    const result = await sns.publish(params).promise();
    console.log('SNS notification sent:', result.MessageId);
    return { success: true, messageId: result.MessageId };
  } catch (error) {
    console.error('SNS notification failed:', error.message);
    throw new Error(`SNS notification failed: ${error.message}`);
  }
};

/**
 * Send email via SES
 * Used for order confirmations and notifications
 */
const sendSESEmail = async (to, subject, htmlBody, textBody = null, replyTo = null) => {
  if (!config.ses.senderEmail) {
    console.warn('SES Sender Email not configured, skipping email notification');
    return null;
  }

  const params = {
    Source: config.ses.senderEmail,
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to]
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8'
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8'
        }
      }
    },
    Tags: [
      {
        Name: 'event-type',
        Value: 'order-notification'
      }
    ]
  };

  // Add text body if provided
  if (textBody) {
    params.Message.Body.Text = {
      Data: textBody,
      Charset: 'UTF-8'
    };
  }

  // Add reply-to if provided
  if (replyTo) {
    params.ReplyToAddresses = Array.isArray(replyTo) ? replyTo : [replyTo];
  }

  // Add configuration set if configured
  if (config.ses.configurationSet) {
    params.ConfigurationSetName = config.ses.configurationSet;
  }

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('SES email sent:', result.MessageId);
    return { success: true, messageId: result.MessageId };
  } catch (error) {
    console.error('SES email failed:', error.message);
    throw new Error(`SES email failed: ${error.message}`);
  }
};

/**
 * Send order confirmation email to customer
 */
const sendOrderConfirmationEmail = async (order, customerEmail, customerName) => {
  const subject = `Order Confirmation - #${order.orderNumber || order.id}`;
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
    .order-items { margin: 15px 0; }
    .order-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .total { font-weight: bold; font-size: 1.2em; color: #4F46E5; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmed!</h1>
    </div>
    <div class="content">
      <p>Dear ${customerName || 'Valued Customer'},</p>
      <p>Thank you for your order! We've received your order and are processing it now.</p>
      
      <div class="order-details">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> #${order.orderNumber || order.id}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
        <p><strong>Shipping Address:</strong><br>${order.shippingAddress ? order.shippingAddress.replace(/\n/g, '<br>') : 'N/A'}</p>
      </div>

      <div class="order-items">
        <h3>Items Ordered</h3>
        ${order.items ? order.items.map(item => `
          <div class="order-item">
            <span>${item.productName || item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('') : ''}
      </div>

      <div class="order-details">
        <p class="total">Total: $${(order.totalAmount || order.total || 0).toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
        <p><strong>Payment Status:</strong> ${order.paymentStatus || 'Pending'}</p>
      </div>

      <p>We'll send you another email when your order ships. You can track your order status in your account.</p>
    </div>
    <div class="footer">
      <p>Thank you for shopping with Unikart!</p>
      <p>If you have any questions, please contact our support team.</p>
    </div>
  </div>
</body>
</html>
  `;

  const textBody = `
Order Confirmation - #${order.orderNumber || order.id}

Dear ${customerName || 'Valued Customer'},

Thank you for your order! We've received your order and are processing it now.

Order Details:
- Order Number: #${order.orderNumber || order.id}
- Order Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}
- Total: $${(order.totalAmount || order.total || 0).toFixed(2)}

We'll send you another email when your order ships.

Thank you for shopping with Unikart!
  `;

  return sendSESEmail(customerEmail, subject, htmlBody, textBody);
};

/**
 * Send order notification to admin/staff via SNS
 */
const sendAdminOrderNotification = async (order) => {
  const message = {
    eventType: 'new_order',
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerEmail: order.customerEmail,
    totalAmount: order.totalAmount || order.total,
    itemCount: order.items ? order.items.length : 0,
    paymentStatus: order.paymentStatus,
    shippingAddress: order.shippingAddress,
    timestamp: new Date().toISOString(),
    actionRequired: 'Please process this order',
    dashboardUrl: `${process.env.BACKEND_URL || 'http://unikart-alb-296069847.eu-north-1.elb.amazonaws.com'}/admin/orders/${order.id}`
  };

  return sendSNSNotification(message, `New Order #${order.orderNumber || order.id}`);
};

/**
 * Send shipping notification email to customer
 */
const sendShippingNotificationEmail = async (order, customerEmail, customerName, trackingNumber, carrier) => {
  const subject = `Your Order #${order.orderNumber || order.id} Has Shipped!`;
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #10B981; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .tracking-info { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #10B981; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Your Order Has Shipped!</h1>
    </div>
    <div class="content">
      <p>Dear ${customerName || 'Valued Customer'},</p>
      <p>Great news! Your order #${order.orderNumber || order.id} is on its way.</p>
      
      <div class="tracking-info">
        <h3>Tracking Information</h3>
        <p><strong>Carrier:</strong> ${carrier || 'N/A'}</p>
        <p><strong>Tracking Number:</strong> ${trackingNumber || 'N/A'}</p>
      </div>

      <p>You can track your package using the tracking number provided above.</p>
      <p>Thank you for shopping with Unikart!</p>
    </div>
    <div class="footer">
      <p>If you have any questions, please contact our support team.</p>
    </div>
  </div>
</body>
</html>
  `;

  const textBody = `
Your Order #${order.orderNumber || order.id} Has Shipped!

Dear ${customerName || 'Valued Customer'},

Great news! Your order is on its way.

Tracking Information:
- Carrier: ${carrier || 'N/A'}
- Tracking Number: ${trackingNumber || 'N/A'}

Thank you for shopping with Unikart!
  `;

  return sendSESEmail(customerEmail, subject, htmlBody, textBody);
};

module.exports = {
  sendSNSNotification,
  sendSESEmail,
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
  sendShippingNotificationEmail
};
