function CartPage({ items, total, updateQuantity, removeFromCart, clearCart }) {
  return (
    <section className="page-cart">
      <div className="section-header">
        <span className="eyebrow">Shopping Cart</span>
        <h1>Your cart is ready for checkout.</h1>
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty. Add items from the shop to start your order.</p>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-image" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="cart-item-details">
                  <h2>{item.name}</h2>
                  <p>UGX {item.price.toLocaleString()} each</p>
                  <div className="quantity-control">
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <strong>UGX {(item.price * item.quantity).toLocaleString()}</strong>
                  <button type="button" className="button secondary" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="cart-summary">
            <h2>Order summary</h2>
            <div className="summary-line">
              <span>Items</span>
              <span>{items.length}</span>
            </div>
            <div className="summary-line total">
              <span>Total</span>
              <span>UGX {total.toLocaleString()}</span>
            </div>
            <button type="button" className="button primary" onClick={() => window.location.assign('/checkout')}>
              Proceed to checkout
            </button>
            <button type="button" className="button secondary" onClick={clearCart}>
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

export default CartPage;
