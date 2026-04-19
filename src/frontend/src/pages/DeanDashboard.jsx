import { useMemo } from 'react';

function DeanDashboard({ user, products, orders }) {
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const categorySales = products.reduce((acc, product) => {
      const productOrders = orders.filter(order =>
        order.items.some(item => item.id === product.id)
      );
      const sales = productOrders.reduce((sum, order) => sum + order.total, 0);
      acc[product.category] = (acc[product.category] || 0) + sales;
      return acc;
    }, {});

    const topProducts = products
      .map(product => ({
        ...product,
        sales: orders.filter(order =>
          order.items.some(item => item.id === product.id)
        ).length
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      categorySales,
      topProducts
    };
  }, [products, orders]);

  return (
    <section className="page-dashboard">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Dean Dashboard</span>
          <h1>Dr. {user.name} - Student Performance & Reports</h1>
          <p>Monitor campus shopping trends and student welfare</p>
        </div>
      </div>

      <div className="reports-grid">
        <article className="report-card">
          <h3>Total Campus Revenue</h3>
          <strong>UGX {analytics.totalRevenue.toLocaleString()}</strong>
          <p>This month</p>
        </article>
        <article className="report-card">
          <h3>Total Orders</h3>
          <strong>{analytics.totalOrders}</strong>
          <p>Campus-wide</p>
        </article>
        <article className="report-card">
          <h3>Average Order Value</h3>
          <strong>UGX {Math.round(analytics.avgOrderValue).toLocaleString()}</strong>
          <p>Per transaction</p>
        </article>
        <article className="report-card">
          <h3>Active Products</h3>
          <strong>{products.length}</strong>
          <p>Available items</p>
        </article>
      </div>

      <div className="reports-sections">
        <div className="category-breakdown">
          <h2>Sales by Category</h2>
          <div className="category-chart">
            {Object.entries(analytics.categorySales).map(([category, sales]) => (
              <div key={category} className="category-item">
                <div className="category-info">
                  <span>{category}</span>
                  <span>UGX {sales.toLocaleString()}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(sales / Math.max(...Object.values(analytics.categorySales))) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="top-products">
          <h2>Top Performing Products</h2>
          <div className="products-ranking">
            {analytics.topProducts.map((product, index) => (
              <div key={product.id} className="product-rank">
                <span className="rank">#{index + 1}</span>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>{product.category} • {product.sales} orders</p>
                </div>
                <div className="product-metrics">
                  <span>UGX {product.price.toLocaleString()}</span>
                  <span className={`rating ${product.rating >= 4.0 ? 'high-rating' : ''}`}>
                    {product.rating}★
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="student-insights">
          <h2>Student Shopping Insights</h2>
          <div className="insights-grid">
            <article>
              <h3>Most Popular Category</h3>
              <strong>
                {Object.entries(analytics.categorySales).reduce((a, b) =>
                  analytics.categorySales[a[0]] > analytics.categorySales[b[0]] ? a : b
                )[0]}
              </strong>
            </article>
            <article>
              <h3>Order Frequency</h3>
              <strong>{(analytics.totalOrders / 30).toFixed(1)} per day</strong>
            </article>
            <article>
              <h3>Student Engagement</h3>
              <strong>High</strong>
              <p>Based on order volume</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DeanDashboard;