import { useState } from 'react';

function VendorDashboard({ user, products, orders }) {
  const [activeTab, setActiveTab] = useState('products');
  const vendorProducts = products.filter(p => p.vendorId === user.id || !p.vendorId);
  const vendorOrders = orders.filter(order =>
    order.items.some(item => vendorProducts.some(p => p.id === item.id))
  );

  const updateStock = (productId, newStock) => {
    // In a real app, this would update the backend
    console.log(`Updated stock for ${productId} to ${newStock}`);
  };

  const markFulfilled = (orderId) => {
    // In a real app, this would update the backend
    console.log(`Marked order ${orderId} as fulfilled`);
  };

  return (
    <section className="page-dashboard">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Vendor Dashboard</span>
          <h1>{user.name} - Product Management</h1>
          <p>Manage your products, stock, and orders</p>
        </div>
        <div className="vendor-stats">
          <div>Products: {vendorProducts.length}</div>
          <div>Orders: {vendorOrders.length}</div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          My Products
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="products-management">
          <h2>Product Inventory</h2>
          <div className="products-table">
            {vendorProducts.map((product) => (
              <div key={product.id} className="product-row">
                <div className="product-info">
                  <img src={product.image} alt={product.name} />
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.category}</p>
                  </div>
                </div>
                <div className="product-details">
                  <span>UGX {product.price.toLocaleString()}</span>
                  <span className={`rating ${product.rating >= 4.0 ? 'high-rating' : ''}`}>
                    Rating: {product.rating}★
                  </span>
                </div>
                <div className="stock-controls">
                  <label>
                    Stock:
                    <input
                      type="number"
                      defaultValue="10"
                      min="0"
                      onChange={(e) => updateStock(product.id, e.target.value)}
                    />
                  </label>
                  <button className="button secondary">Update</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="orders-management">
          <h2>Order Fulfillment</h2>
          <div className="orders-table">
            {vendorOrders.map((order) => (
              <div key={order.id} className="order-row">
                <div className="order-info">
                  <h3>{order.id}</h3>
                  <p>{order.date}</p>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      {item.name} x{item.qty} - UGX {(item.price * item.qty).toLocaleString()}
                    </div>
                  ))}
                </div>
                <div className="order-actions">
                  <strong>UGX {order.total.toLocaleString()}</strong>
                  {order.status !== 'Fulfilled' && (
                    <button
                      className="button primary"
                      onClick={() => markFulfilled(order.id)}
                    >
                      Mark Fulfilled
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics-section">
          <h2>Sales Analytics</h2>
          <div className="analytics-grid">
            <article className="metric-card">
              <h3>Total Revenue</h3>
              <strong>UGX {vendorOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}</strong>
            </article>
            <article className="metric-card">
              <h3>Orders This Month</h3>
              <strong>{vendorOrders.length}</strong>
            </article>
            <article className="metric-card">
              <h3>Average Order Value</h3>
              <strong>
                UGX {vendorOrders.length > 0
                  ? Math.round(vendorOrders.reduce((sum, order) => sum + order.total, 0) / vendorOrders.length).toLocaleString()
                  : '0'
                }
              </strong>
            </article>
            <article className="metric-card">
              <h3>Top Product</h3>
              <strong>{vendorProducts[0]?.name || 'N/A'}</strong>
            </article>
          </div>
        </div>
      )}
    </section>
  );
}

export default VendorDashboard;