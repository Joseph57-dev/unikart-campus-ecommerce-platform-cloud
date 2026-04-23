import { useMemo, useState, useEffect } from 'react';
import productService from '../services/productService';

function Shop({ onAdd }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const filters = {
          page,
          limit: 20,
          search: query || undefined,
          category: category !== 'All' ? category : undefined
        };
        const response = await productService.getProducts(filters);
        
        if (response.status === 'success') {
          setProducts(response.data.products);
          setError('');
        } else {
          setError(response.message || 'Failed to load products');
        }
      } catch (err) {
        setError(err.message || 'Failed to load products');
        console.error('Product fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, category, page]);

  const categories = useMemo(() => {
    const cats = products.map((p) => p.category_name).filter(Boolean);
    return ['All', ...new Set(cats)];
  }, [products]);

  return (
    <section className="page-shop">
      <div className="shop-header">
        <div>
          <span className="eyebrow">Catalogue</span>
          <h1>Browse products with smart filters.</h1>
        </div>
        <div className="shop-controls">
          <input
            type="search"
            placeholder="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading products...</div>}

      <div className="product-grid">
        {products.map((product) => (
          <article key={product.product_id} className="product-card">
            <div className="product-image" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${product.image_url || product.image || 'placeholder.jpg'})` }} />
            <div className="product-details">
              <span className="product-category">{product.category_name || 'Uncategorized'}</span>
              <h2>{product.name}</h2>
              <p>{product.short_description || product.description}</p>
              <div className="product-meta">
                <strong>UGX {(product.price || 0).toLocaleString()}</strong>
                <span className={`rating ${product.rating >= 4.0 ? 'high-rating' : ''}`}>
                  {product.rating || 0} ★
                </span>
              </div>
              <button 
                className="button primary" 
                type="button" 
                onClick={() => onAdd({
                  id: product.product_id,
                  product_id: product.product_id,
                  name: product.name,
                  price: product.price,
                  image: product.image_url,
                  category: product.category_name
                })}
              >
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Shop;
