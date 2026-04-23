import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(form.email, form.password);

      if (response.status === 'success' && response.data?.user) {
        if (onLogin) {
          onLogin(response.data.user);
        }
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      setError(apiMessage || err.message || 'Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-login">
      <div className="login-container">
        <div className="login-header">
          <span className="eyebrow">Campus Access</span>
          <h1>Login to your account</h1>
          <p>Access your personalized dashboard</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@campus.edu"
              required
              disabled={loading}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </label>

          <button type="submit" className="button primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-info">
          <h3>Demo Accounts</h3>
          <div className="demo-accounts">
            <div>
              <strong>Student:</strong> student@campus.edu / student123
            </div>
            <div>
              <strong>Vendor:</strong> vendor@campus.edu / vendor123
            </div>
            <div>
              <strong>Dean:</strong> dean@campus.edu / dean123
            </div>
            <div>
              <strong>Admin:</strong> admin@campus.edu / admin123
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;