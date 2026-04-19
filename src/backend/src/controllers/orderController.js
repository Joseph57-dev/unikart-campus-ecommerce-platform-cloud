const db = require('../utils/database');
const { sendOrderConfirmationEmail, sendAdminOrderNotification, sendShippingNotificationEmail } = require('../services/notificationService');

// Create order
const createOrder = async (req, res) => {
  try {
    const { 
      items, 
      delivery_method, 
      delivery_address,
      pickup_station,
      payment_method,
      payment_provider,
      payment_number,
      delivery_date,
      delivery_time
    } = req.body;

    const accountId = req.user.sub;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Order must contain at least one item',
        data: null
      });
    }

    if (!delivery_method || !payment_method) {
      return res.status(400).json({
        status: 'error',
        message: 'Delivery method and payment method are required',
        data: null
      });
    }

    // Calculate total from items
    let subtotal = 0;
    for (const item of items) {
      const product = await db.getOne(
        'SELECT price FROM products WHERE product_id = $1 AND is_active = true',
        [item.product_id]
      );

      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: `Product with ID ${item.product_id} not found`,
          data: null
        });
      }

      subtotal += product.price * item.quantity;
    }

    // Calculate taxes (10% example)
    const tax_amount = subtotal * 0.1;
    const shipping_amount = delivery_method === 'delivery' ? 15000 : 0;
    const total_amount = subtotal + tax_amount + shipping_amount;

    // Start transaction
    const client = await db.query('BEGIN');

    try {
      // Create order
      const order = await db.insert(
        `INSERT INTO orders 
         (account_id, subtotal, tax_amount, shipping_amount, total_amount,
          delivery_method, delivery_address, pickup_station, delivery_date, delivery_time,
          payment_method, payment_provider, payment_number, order_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING *`,
        [accountId, subtotal, tax_amount, shipping_amount, total_amount,
         delivery_method, delivery_address || null, pickup_station || null,
         delivery_date, delivery_time, payment_method, payment_provider || null,
         payment_number || null, 'pending']
      );

      // Add order items
      for (const item of items) {
        const product = await db.getOne(
          'SELECT name, price FROM products WHERE product_id = $1',
          [item.product_id]
        );

        await db.insert(
          `INSERT INTO order_item 
           (order_id, product_id, product_name, quantity, unit_price, total_price, attributes)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [order.order_id, item.product_id, product.name, item.quantity,
           product.price, product.price * item.quantity, JSON.stringify(item.attributes || {})]
        );

        // Update product stock
        await db.update(
          `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE product_id = $2`,
          [item.quantity, item.product_id]
        );
      }

      // Commit transaction
      await db.query('COMMIT');

      // Get customer email for notification
      const customer = await db.getOne(
        'SELECT email, first_name, last_name FROM accounts WHERE account_id = $1',
        [accountId]
      );

      // Prepare order data for notifications
      const orderData = {
        id: order.order_id,
        orderNumber: order.order_number || order.order_id,
        totalAmount: order.total_amount,
        paymentStatus: order.payment_method,
        paymentMethod: order.payment_method,
        shippingAddress: delivery_address,
        items: items,
        createdAt: order.created_at,
        customerEmail: customer?.email
      };

      // Send notifications asynchronously (non-blocking)
      if (customer && customer.email) {
        // Send order confirmation email to customer
        sendOrderConfirmationEmail(
          orderData,
          customer.email,
          `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
        ).catch(err => console.error('Failed to send order confirmation email:', err));

        // Send admin notification via SNS
        sendAdminOrderNotification(orderData)
          .catch(err => console.error('Failed to send admin notification:', err));
      }

      res.status(201).json({
        status: 'success',
        message: 'Order created successfully',
        data: { order }
      });
    } catch (err) {
      await db.query('ROLLBACK');
      throw err;
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create order: ' + error.message,
      data: null
    });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const accountId = req.user.sub;
    const { page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const countResult = await db.getOne(
      'SELECT COUNT(*) as total FROM orders WHERE account_id = $1',
      [accountId]
    );
    const total = parseInt(countResult.total);

    // Get orders
    const orders = await db.getAll(
      `SELECT * FROM orders WHERE account_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [accountId, parseInt(limit), offset]
    );

    // Get items for each order
    for (let order of orders) {
      const items = await db.getAll(
        'SELECT * FROM order_item WHERE order_id = $1',
        [order.order_id]
      );
      order.items = items;
    }

    res.json({
      status: 'success',
      message: 'Orders retrieved successfully',
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get orders: ' + error.message,
      data: null
    });
  }
};

// Get order details
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const accountId = req.user.sub;

    const order = await db.getOne(
      'SELECT * FROM orders WHERE order_id = $1 AND account_id = $2',
      [id, accountId]
    );

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
        data: null
      });
    }

    // Get items
    const items = await db.getAll(
      'SELECT * FROM order_item WHERE order_id = $1',
      [id]
    );
    order.items = items;

    // Get delivery info if available
    const delivery = await db.getOne(
      'SELECT * FROM deliveries WHERE order_id = $1',
      [id]
    );
    order.delivery = delivery || null;

    res.json({
      status: 'success',
      message: 'Order retrieved successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get order: ' + error.message,
      data: null
    });
  }
};

// Update order status (Admin/Vendor only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, notes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid order status',
        data: null
      });
    }

    const order = await db.update(
      `UPDATE orders SET order_status = $1, notes = $2, updated_at = NOW() 
       WHERE order_id = $3 RETURNING *`,
      [order_status, notes || null, id]
    );

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
        data: null
      });
    }

    // Send shipping notification if order is shipped
    if (order_status === 'shipped') {
      // Get customer and order details for notification
      const customer = await db.getOne(
        'SELECT a.email, a.first_name, a.last_name FROM accounts a JOIN orders o ON a.account_id = o.account_id WHERE o.order_id = $1',
        [id]
      );

      if (customer && customer.email) {
        const orderItems = await db.getAll(
          'SELECT * FROM order_item WHERE order_id = $1',
          [id]
        );

        const orderData = {
          id: order.order_id,
          orderNumber: order.order_number || order.order_id,
          items: orderItems,
          createdAt: order.created_at
        };

        // Send shipping notification email
        sendShippingNotificationEmail(
          orderData,
          customer.email,
          `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
          notes || null,
          'Standard Delivery'
        ).catch(err => console.error('Failed to send shipping notification email:', err));
      }
    }

    res.json({
      status: 'success',
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update order status: ' + error.message,
      data: null
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const accountId = req.user.sub;

    const order = await db.getOne(
      'SELECT * FROM orders WHERE order_id = $1 AND account_id = $2',
      [id, accountId]
    );

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
        data: null
      });
    }

    if (order.order_status !== 'pending' && order.order_status !== 'confirmed') {
      return res.status(400).json({
        status: 'error',
        message: 'Order cannot be cancelled in current status',
        data: null
      });
    }

    // Get order items
    const items = await db.getAll(
      'SELECT * FROM order_item WHERE order_id = $1',
      [id]
    );

    // Return items to inventory
    for (const item of items) {
      await db.update(
        'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE product_id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Update order status
    const updatedOrder = await db.update(
      'UPDATE orders SET order_status = $1, updated_at = NOW() WHERE order_id = $2 RETURNING *',
      ['cancelled', id]
    );

    res.json({
      status: 'success',
      message: 'Order cancelled successfully',
      data: { order: updatedOrder }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to cancel order: ' + error.message,
      data: null
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
};
