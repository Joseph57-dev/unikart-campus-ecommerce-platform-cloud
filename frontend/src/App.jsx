import { useEffect, useMemo, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import CartPage from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import VendorDashboard from './pages/VendorDashboard.jsx';
import DeanDashboard from './pages/DeanDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import productsData from './data/products.js';
import authService from './services/authService';
import './App.css';

const userTypes = {
  STUDENT: 'student',
  VENDOR: 'vendor',
  DEAN: 'dean',
  ADMIN: 'admin'
};

function normalizeUser(raw) {
  if (!raw) return null;
  if (raw.type && raw.name) {
    return raw;
  }
  return {
    id: String(raw.account_id ?? raw.id ?? ''),
    email: raw.email,
    type: raw.account_type ?? raw.type,
    name: raw.full_name ?? raw.name ?? raw.email ?? 'User'
  };
}

function ProtectedRoute({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

const initialCart = () => {
  try {
    return JSON.parse(localStorage.getItem('unikart-cart')) || [];
  } catch {
    return [];
  }
};

const sampleOrders = [
  {
    id: 'ORD-1003',
    date: '2026-04-11',
    total: 189000,
    status: 'Shipped',
    items: [
      { name: 'Campus Hoodie', qty: 1, price: 85000 },
      { name: 'Campus T-Shirt', qty: 1, price: 35000 }
    ]
  },
  {
    id: 'ORD-1002',
    date: '2026-04-08',
    total: 219000,
    status: 'Processing',
    items: [{ name: 'HP Laptop', qty: 1, price: 1250000 }]
  }
];

function App() {
  const [products] = useState(productsData);
  const [cart, setCart] = useState(initialCart);
  const [orders, setOrders] = useState(sampleOrders);
  const [currentUser, setCurrentUser] = useState(() => normalizeUser(authService.getStoredUser()));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('unikart-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem('token');
    if (!token || authService.getStoredUser()) {
      return undefined;
    }

    (async () => {
      try {
        const res = await authService.verify();
        if (cancelled || !res?.data?.user) return;
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setCurrentUser(normalizeUser(res.data.user));
      } catch {
        // Session invalid — api client may redirect to login on 401
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const pageNames = {
      '/': 'Home',
      '/shop': 'Shop',
      '/cart': 'Cart',
      '/checkout': 'Checkout',
      '/login': 'Login',
      '/dashboard': currentUser
        ? `${currentUser.type.charAt(0).toUpperCase() + currentUser.type.slice(1)} Dashboard`
        : 'Dashboard'
    };

    const routeName = pageNames[location.pathname] || 'Unikart Campus Online Shopping Store';
    const userPrefix = currentUser ? `${currentUser.name} | ` : '';
    document.title = `${userPrefix}${routeName} | Unikart Campus Online Shopping Store`;
  }, [location.pathname, currentUser]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const handleAuthLogin = (user) => {
    const normalized = normalizeUser(user);
    setCurrentUser(normalized);
  };

  const logout = () => {
    setCurrentUser(null);
    authService.logout();
  };

  const addToCart = (product) => {
    setCart((current) => {
      const exists = current.find((item) => item.id === product.id);
      if (exists) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (customerData) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US'),
      total: cartTotal,
      status: 'Confirmed',
      shipping: customerData,
      items: cart.map(({ id, name, price, quantity }) => ({ id, name, price, qty: quantity }))
    };
    setOrders((current) => [newOrder, ...current]);
    clearCart();
    navigate('/checkout', { state: { order: newOrder, success: true } });
  };

  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.type) {
      case userTypes.STUDENT:
        return <StudentDashboard user={currentUser} products={products} orders={orders} />;
      case userTypes.VENDOR:
        return <VendorDashboard user={currentUser} products={products} orders={orders} />;
      case userTypes.DEAN:
        return <DeanDashboard user={currentUser} products={products} orders={orders} />;
      case userTypes.ADMIN:
        return <AdminDashboard user={currentUser} products={products} orders={orders} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span>Unikart</span>
          <small>Campus Online Shopping Store</small>
        </div>
        <nav className="nav-links">
          {!currentUser ? (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/shop">Shop</NavLink>
              <NavLink to="/cart">Cart</NavLink>
              <NavLink to="/checkout">Checkout</NavLink>
              <NavLink to="/login">Login</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              {currentUser.type === userTypes.STUDENT && (
                <>
                  <NavLink to="/shop">Shop</NavLink>
                  <NavLink to="/cart">Cart</NavLink>
                  <NavLink to="/checkout">Checkout</NavLink>
                </>
              )}
            </>
          )}
        </nav>
        {currentUser ? (
          <div className="user-info">
            <span>Welcome, {currentUser.name}</span>
            <button type="button" className="button secondary" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <button type="button" className="cart-button" onClick={() => navigate('/cart')}>
            Cart <span>{cartCount}</span>
          </button>
        )}
      </header>

      <main className="content-wrap">
        <Routes>
          <Route path="/" element={<Home onAdd={addToCart} cartCount={cartCount} />} />
          <Route path="/shop" element={<Shop products={products} onAdd={addToCart} />} />
          <Route
            path="/cart"
            element={
              <CartPage
                items={cart}
                total={cartTotal}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={<Checkout cartItems={cart} total={cartTotal} onSubmit={placeOrder} />}
          />
          <Route path="/login" element={<Login onLogin={handleAuthLogin} />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute>{renderDashboard()}</ProtectedRoute>}
          />
        </Routes>
      </main>
      <footer className="footer-bar">
        <p>Campus Online Shopping Store - Built for students, vendors, and administrators.</p>
      </footer>
    </div>
  );
}

export default App;
