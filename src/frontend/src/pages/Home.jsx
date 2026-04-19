import { Link } from 'react-router-dom';

function Home({ onAdd, cartCount }) {
  return (
    <section className="page-home">
      <div className="hero-panel">
        <div>
          <span className="eyebrow">Catalog & Checkout</span>
          <h1>Shop the latest products with an intuitive cart experience.</h1>
          <p>Responsive React views for browsing, ordering, and managing inventory from customer and admin workflows.</p>
          <div className="hero-actions">
            <Link to="/shop" className="button primary">Browse catalogue</Link>
            <Link to="/cart" className="button secondary">View cart ({cartCount})</Link>
          </div>
        </div>
        <div className="hero-graphic">
          <div className="hero-card">
            <span>Trending</span>
            <h2>Galactic Smartwatch</h2>
            <p>Trending gadget with fitness, notifications and premium style.</p>
            <button type="button" onClick={() => onAdd({ id: 'p102', name: 'Galactic Smartwatch', price: 149.99, image: '' })}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
      <div className="feature-grid">
        <article>
          <h3>Customer-first shopping</h3>
          <p>Product discovery, quick cart updates, and clean checkout steps designed for mobile and desktop.</p>
        </article>
        <article>
          <h3>Admin insights</h3>
          <p>Order previews, product management, and sales snapshot views help keep operations smooth.</p>
        </article>
        <article>
          <h3>Modern responsive UI</h3>
          <p>Flexible layout support for every screen size with polished spacing, cards, and quick actions.</p>
        </article>
      </div>
    </section>
  );
}

export default Home;
