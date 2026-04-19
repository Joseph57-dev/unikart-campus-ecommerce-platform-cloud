import { useNavigate } from 'react-router-dom';

function StudentDashboard({ user, products, orders }) {
  const navigate = useNavigate();
  const userOrders = orders.filter(order => order.customerId === user.id || !order.customerId);

  const recentProducts = products.slice(0, 4);
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <section className="page-dashboard">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Student Dashboard</span>
          <h1>Welcome back, {user.name}!</h1>
          <p>Manage your orders and continue shopping</p>
        </div>
        <div className="quick-actions">
          <button className="button primary" onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="stat-card">
          <h3>Total Orders</h3>
          <strong>{userOrders.length}</strong>
        </article>
        <article className="stat-card">
          <h3>Total Spent</h3>
          <strong>UGX {totalSpent.toLocaleString()}</strong>
        </article>
        <article className="stat-card">
          <h3>Active Orders</h3>
          <strong>{userOrders.filter(o => o.status !== 'Delivered').length}</strong>
        </article>
        <article className="stat-card">
          <h3>Completed Orders</h3>
          <strong>{userOrders.filter(o => o.status === 'Delivered').length}</strong>
        </article>
      </div>

      <div className="dashboard-sections">
        <div className="recent-orders">
          <h2>Recent Orders</h2>
          {userOrders.length === 0 ? (
            <p className="empty-state">No orders yet. Start shopping!</p>
          ) : (
            <div className="orders-list">
              {userOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span>{order.id}</span>
                    <strong className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </strong>
                  </div>
                  <div className="order-details">
                    <span>{order.date}</span>
                    <span>UGX {order.total.toLocaleString()}</span>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <span key={index}>{item.name} x{item.qty}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="featured-products">
          <h2>Popular Items</h2>
          <div className="products-grid">
            {recentProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div
                  className="product-image"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>UGX {product.price.toLocaleString()}</p>
                  <button
                    className="button secondary"
                    onClick={() => navigate('/shop')}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentDashboard;