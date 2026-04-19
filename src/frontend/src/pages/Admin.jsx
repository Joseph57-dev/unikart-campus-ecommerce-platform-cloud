import { useState } from 'react';

function Admin({ products, orders }) {
  const [tab, setTab] = useState('dashboard');
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const productCount = products.length;

  return (
    <section className="page-admin">
      <div className="admin-header">
        <div>
          <span className="eyebrow">Admin Panel</span>
          <h1>Manage products, orders, and store performance.</h1>
        </div>
        <div className="tabs">
          <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}>
            Dashboard
          </button>
          <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>
            Products
          </button>
          <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
            Orders
          </button>
        </div>
      </div>

      {tab === 'dashboard' && (
        <div className="admin-grid">
          <article>
            <h3>Total sales</h3>
            <strong>UGX {totalSales.toLocaleString()}</strong>
          </article>
          <article>
            <h3>Products</h3>
            <strong>{productCount}</strong>
          </article>
          <article>
            <h3>Orders</h3>
            <strong>{orders.length}</strong>
          </article>
        </div>
      )}

      {tab === 'products' && (
        <div className="product-table">
          {products.map((product) => (
            <div key={product.id} className="admin-row">
              <span>{product.name}</span>
              <span>{product.category}</span>
              <span>UGX {product.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div className="order-table">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span>{order.id}</span>
                <strong>{order.status}</strong>
              </div>
              <div>
                <span>{order.date}</span>
                <span>UGX {order.total.toLocaleString()}</span>
              </div>
              <ul>
                {order.items.map((item, index) => (
                  <li key={`${order.id}-${index}`}>{item.name} x{item.qty}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Admin;
