/**
 * Notification Service Tests
 * 
 * These tests verify the AWS SNS + SES notification functionality.
 * Run with: npm test -- notificationService.test.js
 */

// Mock AWS SDK
jest.mock('../../config/aws', () => ({
  sns: {
    publish: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ MessageId: 'test-message-id-123' })
    })
  },
  ses: {
    sendEmail: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ MessageId: 'test-email-id-456' })
    })
  },
  config: {
    sns: {
      topicArn: 'arn:aws:sns:us-east-1:123456789:order-notifications'
    },
    ses: {
      senderEmail: 'noreply@unikart.com',
      configurationSet: 'UnikartConfigSet'
    }
  }
}));

const { sns, ses, config } = require('../../config/aws');
const {
  sendSNSNotification,
  sendSESEmail,
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
  sendShippingNotificationEmail
} = require('../notificationService');

describe('Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendSNSNotification', () => {
    it('should send SNS notification successfully', async () => {
      const message = {
        eventType: 'new_order',
        orderId: 'order-123',
        totalAmount: 100.00
      };

      const result = await sendSNSNotification(message, 'Test Notification');

      expect(result).toEqual({ success: true, messageId: 'test-message-id-123' });
      expect(sns.publish).toHaveBeenCalledWith(expect.objectContaining({
        TopicArn: config.sns.topicArn,
        Subject: 'Test Notification'
      }));
    });

    it('should include message attributes in SNS notification', async () => {
      const message = {
        eventType: 'order_shipped',
        orderId: 'order-456'
      };

      await sendSNSNotification(message);

      expect(sns.publish).toHaveBeenCalledWith(expect.objectContaining({
        MessageAttributes: expect.objectContaining({
          EventType: expect.objectContaining({
            StringValue: 'order_shipped'
          })
        })
      }));
    });

    it('should return null when SNS topic ARN is not configured', async () => {
      const originalTopicArn = config.sns.topicArn;
      config.sns.topicArn = null;

      const result = await sendSNSNotification({ test: 'data' });

      expect(result).toBeNull();
      
      // Restore
      config.sns.topicArn = originalTopicArn;
    });
  });

  describe('sendSESEmail', () => {
    it('should send email successfully', async () => {
      const result = await sendSESEmail(
        'customer@example.com',
        'Test Subject',
        '<h1>Test HTML</h1>',
        'Test text body'
      );

      expect(result).toEqual({ success: true, messageId: 'test-email-id-456' });
      expect(ses.sendEmail).toHaveBeenCalledWith(expect.objectContaining({
        Source: config.ses.senderEmail,
        Destination: { ToAddresses: ['customer@example.com'] }
      }));
    });

    it('should handle multiple recipients', async () => {
      await sendSESEmail(
        ['customer1@example.com', 'customer2@example.com'],
        'Test Subject',
        '<h1>Test HTML</h1>'
      );

      expect(ses.sendEmail).toHaveBeenCalledWith(expect.objectContaining({
        Destination: {
          ToAddresses: ['customer1@example.com', 'customer2@example.com']
        }
      }));
    });

    it('should include reply-to address when provided', async () => {
      await sendSESEmail(
        'customer@example.com',
        'Test Subject',
        '<h1>Test HTML</h1>',
        null,
        'support@unikart.com'
      );

      expect(ses.sendEmail).toHaveBeenCalledWith(expect.objectContaining({
        ReplyToAddresses: ['support@unikart.com']
      }));
    });

    it('should return null when SES sender email is not configured', async () => {
      const originalSenderEmail = config.ses.senderEmail;
      config.ses.senderEmail = null;

      const result = await sendSESEmail('test@example.com', 'Subject', '<p>Body</p>');

      expect(result).toBeNull();
      
      // Restore
      config.ses.senderEmail = originalSenderEmail;
    });
  });

  describe('sendOrderConfirmationEmail', () => {
    const mockOrder = {
      id: 'order-789',
      orderNumber: 'ORD-2024-001',
      totalAmount: 150.00,
      paymentMethod: 'credit_card',
      paymentStatus: 'paid',
      shippingAddress: '123 Main St, City, Country',
      items: [
        { productName: 'Product A', quantity: 2, price: 50.00 },
        { productName: 'Product B', quantity: 1, price: 50.00 }
      ],
      createdAt: new Date().toISOString()
    };

    it('should send order confirmation email', async () => {
      await sendOrderConfirmationEmail(mockOrder, 'customer@example.com', 'John Doe');

      expect(ses.sendEmail).toHaveBeenCalledWith(expect.objectContaining({
        Subject: { Data: `Order Confirmation - #${mockOrder.orderNumber}`, Charset: 'UTF-8' }
      }));
    });

    it('should include order items in email', async () => {
      await sendOrderConfirmationEmail(mockOrder, 'customer@example.com', 'John Doe');

      const callArgs = ses.sendEmail.mock.calls[0][0];
      expect(callArgs.Message.Body.Html.Data).toContain('Product A');
      expect(callArgs.Message.Body.Html.Data).toContain('Product B');
    });
  });

  describe('sendAdminOrderNotification', () => {
    const mockOrder = {
      id: 'order-999',
      orderNumber: 'ORD-2024-002',
      totalAmount: 200.00,
      customerEmail: 'customer@example.com',
      items: [{ product_id: 1, quantity: 2 }],
      paymentStatus: 'pending',
      shippingAddress: '456 Oak St, Town, Country'
    };

    it('should send admin notification via SNS', async () => {
      await sendAdminOrderNotification(mockOrder);

      expect(sns.publish).toHaveBeenCalledWith(expect.objectContaining({
        Subject: `New Order #${mockOrder.orderNumber}`
      }));
    });

    it('should include order details in SNS message', async () => {
      await sendAdminOrderNotification(mockOrder);

      const callArgs = sns.publish.mock.calls[0][0];
      const message = JSON.parse(callArgs.Message);
      
      expect(message.orderId).toBe(mockOrder.id);
      expect(message.totalAmount).toBe(mockOrder.totalAmount);
      expect(message.eventType).toBe('new_order');
    });
  });

  describe('sendShippingNotificationEmail', () => {
    const mockOrder = {
      id: 'order-shipped-123',
      orderNumber: 'ORD-2024-003'
    };

    it('should send shipping notification email', async () => {
      await sendShippingNotificationEmail(
        mockOrder,
        'customer@example.com',
        'Jane Smith',
        'TRACK123456',
        'DHL'
      );

      expect(ses.sendEmail).toHaveBeenCalledWith(expect.objectContaining({
        Subject: `Your Order #${mockOrder.orderNumber} Has Shipped!`
      }));
    });

    it('should include tracking information', async () => {
      await sendShippingNotificationEmail(
        mockOrder,
        'customer@example.com',
        'Jane Smith',
        'TRACK123456',
        'DHL'
      );

      const callArgs = ses.sendEmail.mock.calls[0][0];
      expect(callArgs.Message.Body.Html.Data).toContain('TRACK123456');
      expect(callArgs.Message.Body.Html.Data).toContain('DHL');
    });
  });
});