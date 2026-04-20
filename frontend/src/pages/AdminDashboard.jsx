import { useState } from 'react';

function AdminDashboard({ user, products, orders }) {
  const [activeTab, setActiveTab] = useState('overview');

  const systemStats = {
    totalUsers: 245, // Mock data
    activeSessions: 89,
    totalProducts: products.length,
    totalOrders: orders.length,
    systemUptime: '99.9%',
    securityAlerts: 2
  };

  const recentActivity = [
    { id: 1, type: 'user_login', message: 'Student John Doe logged in', time: '2 minutes ago' },
    { id: 2, type: 'order_placed', message: 'New order ORD-1023 placed', time: '5 minutes ago' },
    { id: 3, type: 'product_updated', message: 'Vendor updated HP Laptop stock', time: '10 minutes ago' },
    { id: 4, type: 'security_alert', message: 'Failed login attempt detected', time: '15 minutes ago' },
    { id: 5, type: 'user_registered', message: 'New student account created', time: '20 minutes ago' }
  ];

  const pendingIssues = [
    { id: 1, title: 'Payment gateway timeout', priority: 'high', status: 'open' },
    { id: 2, title: 'User unable to reset password', priority: 'medium', status: 'open' },
    { id: 3, title: 'Product image not loading', priority: 'low', status: 'in-progress' }
  ];

  return (
    <section className="page-dashboard">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">System Administration</span>
          <h1>{user.name} - Campus Management</h1>
          <p>Monitor system health, manage users, and handle support</p>
        </div>
        <div className="system-status">
          <span className="status-indicator online">System Online</span>
          <span>Uptime: {systemStats.systemUptime}</span>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button
          className={activeTab === 'security' ? 'active' : ''}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
        <button
          className={activeTab === 'support' ? 'active' : ''}
          onClick={() => setActiveTab('support')}
        >
          Help Desk
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-section">
          <div className="stats-grid">
            <article className="stat-card">
              <h3>Total Users</h3>
              <strong>{systemStats.totalUsers}</strong>
              <span>+12 this week</span>
            </article>
            <article className="stat-card">
              <h3>Active Sessions</h3>
              <strong>{systemStats.activeSessions}</strong>
              <span>Current online</span>
            </article>
            <article className="stat-card">
              <h3>Total Products</h3>
              <strong>{systemStats.totalProducts}</strong>
              <span>Listed items</span>
            </article>
            <article className="stat-card">
              <h3>Total Orders</h3>
              <strong>{systemStats.totalOrders}</strong>
              <span>This month</span>
            </article>
            <article className="stat-card alert">
              <h3>Security Alerts</h3>
              <strong>{systemStats.securityAlerts}</strong>
              <span>Requires attention</span>
            </article>
            <article className="stat-card">
              <h3>System Uptime</h3>
              <strong>{systemStats.systemUptime}</strong>
              <span>This month</span>
            </article>
          </div>

          <div className="activity-section">
            <h2>Recent Activity</h2>
            <div className="activity-feed">
              {recentActivity.map((activity) => (
                <div key={activity.id} className={`activity-item ${activity.type}`}>
                  <div className="activity-icon">
                    {activity.type === 'user_login' && '👤'}
                    {activity.type === 'order_placed' && '🛒'}
                    {activity.type === 'product_updated' && '📦'}
                    {activity.type === 'security_alert' && '⚠️'}
                    {activity.type === 'user_registered' && '✨'}
                  </div>
                  <div className="activity-content">
                    <p>{activity.message}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-management">
          <h2>User Management</h2>
          <div className="user-controls">
            <button className="button primary">Add New User</button>
            <button className="button secondary">Bulk Import</button>
            <button className="button secondary">Export Users</button>
          </div>
          <div className="user-stats">
            <div>Students: 200</div>
            <div>Vendors: 15</div>
            <div>Staff: 25</div>
            <div>Admins: 5</div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="security-management">
          <h2>Security Center</h2>
          <div className="security-alerts">
            <h3>Active Alerts</h3>
            <div className="alerts-list">
              <div className="alert-item high">
                <span className="alert-priority">High</span>
                <p>Multiple failed login attempts from IP 192.168.1.100</p>
                <button className="button secondary">Investigate</button>
              </div>
              <div className="alert-item medium">
                <span className="alert-priority">Medium</span>
                <p>Unusual login pattern detected for user account</p>
                <button className="button secondary">Review</button>
              </div>
            </div>
          </div>
          <div className="security-actions">
            <button className="button primary">Run Security Scan</button>
            <button className="button secondary">Update Policies</button>
          </div>
        </div>
      )}

      {activeTab === 'support' && (
        <div className="support-management">
          <h2>Help Desk</h2>
          <div className="support-stats">
            <div>Open Tickets: {pendingIssues.length}</div>
            <div>Resolved Today: 8</div>
            <div>Average Response: 2.3 hours</div>
          </div>
          <div className="pending-issues">
            <h3>Pending Issues</h3>
            {pendingIssues.map((issue) => (
              <div key={issue.id} className={`issue-item ${issue.priority}`}>
                <div className="issue-header">
                  <h4>{issue.title}</h4>
                  <span className={`priority ${issue.priority}`}>{issue.priority}</span>
                </div>
                <div className="issue-actions">
                  <button className="button secondary">Assign</button>
                  <button className="button primary">Resolve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;