import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Checkout({ cartItems, total, onSubmit }) {
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (location.state?.success) {
      setSubmitted(true);
    }
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!cartItems.length) return;
    onSubmit(form);
  };

  return (
    <section className="page-checkout">
      <div className="section-header">
        <span className="eyebrow">Checkout</span>
        <h1>Confirm your order and delivery details.</h1>
      </div>

      {submitted ? (
        <div className="checkout-success">
          <h2>Order placed successfully!</h2>
          <p>Your payment details are secure and an email confirmation will be sent shortly.</p>
        </div>
      ) : (
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email address
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Address
              <input name="address" value={form.address} onChange={handleChange} required />
            </label>
            <div className="field-row">
              <label>
                City
                <input name="city" value={form.city} onChange={handleChange} required />
              </label>
              <label>
                ZIP code
                <input name="zip" value={form.zip} onChange={handleChange} required />
              </label>
            </div>
            <button type="submit" className="button primary" disabled={!cartItems.length}>
              Place order (UGX {total.toLocaleString()})
            </button>
          </form>
          <aside className="checkout-summary">
            <h2>Order summary</h2>
            {cartItems.length ? (
              <ul>
                {cartItems.map((item) => (
                  <li key={item.id}>
                    <span>{item.name} x{item.quantity}</span>
                    <strong>UGX {(item.price * item.quantity).toLocaleString()}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-note">Add products to your cart to continue.</p>
            )}
            <div className="summary-line total">
              <span>Total</span>
              <span>UGX {total.toLocaleString()}</span>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Checkout;
