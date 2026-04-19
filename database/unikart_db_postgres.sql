-- PostgreSQL Schema for Unikart Campus Online Shopping Store
-- Converted from MySQL with enhancements for inventory, analytics, and security

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- USER MANAGEMENT TABLES
-- ===========================================

-- User accounts table (base table for all users)
CREATE TABLE user_account (
    account_id SERIAL PRIMARY KEY,
    university_email VARCHAR(100) UNIQUE NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('student', 'vendor', 'dean', 'admin')),
    account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'inactive', 'suspended', 'locked')),
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt hash
    password_salt VARCHAR(32), -- for additional security
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student profiles
CREATE TABLE student (
    student_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES user_account(account_id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    university_email VARCHAR(100) UNIQUE NOT NULL,
    contact VARCHAR(15) UNIQUE,
    address TEXT,
    faculty VARCHAR(100),
    year_of_study INTEGER CHECK (year_of_study >= 1 AND year_of_study <= 7),
    profile_picture VARCHAR(255),
    preferences JSONB DEFAULT '{}', -- for personalization
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users
CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES user_account(account_id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'moderator', 'support')),
    department VARCHAR(50),
    permissions JSONB DEFAULT '[]', -- granular permissions
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- PRODUCT CATALOG TABLES
-- ===========================================

-- Suppliers/Vendors
CREATE TABLE supplier (
    supplier_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES user_account(account_id) ON DELETE SET NULL,
    supplier_name VARCHAR(100) NOT NULL,
    contact VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    address TEXT,
    business_license VARCHAR(50),
    tax_id VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product categories
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_category_id INTEGER REFERENCES category(category_id),
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table with enhanced inventory tracking
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES supplier(supplier_id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES category(category_id),
    sku VARCHAR(50) UNIQUE NOT NULL, -- Stock Keeping Unit
    name VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    compare_price DECIMAL(12,2), -- for showing discounts
    cost_price DECIMAL(12,2), -- supplier cost
    currency VARCHAR(3) DEFAULT 'UGX',

    -- Inventory fields
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    stock_status VARCHAR(20) DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock', 'low_stock', 'discontinued')),
    low_stock_threshold INTEGER DEFAULT 5,
    stock_location VARCHAR(100), -- warehouse location

    -- Media
    image_url VARCHAR(255),
    additional_images JSONB DEFAULT '[]', -- array of image URLs
    video_url VARCHAR(255),

    -- Product attributes
    attributes JSONB DEFAULT '{}', -- color, size, weight, etc.
    weight DECIMAL(8,3), -- in kg
    dimensions JSONB, -- length, width, height

    -- SEO and display
    seo_title VARCHAR(200),
    seo_description VARCHAR(300),
    tags TEXT[], -- for search
    is_featured BOOLEAN DEFAULT FALSE,
    is_hot_deal BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,

    -- Analytics
    view_count INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    discontinued_at TIMESTAMP
);

-- Product variants (for different sizes, colors, etc.)
CREATE TABLE product_variant (
    variant_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    sku VARCHAR(50) UNIQUE,
    name VARCHAR(100) NOT NULL, -- e.g., "Red - Large"
    attributes JSONB NOT NULL, -- {"color": "red", "size": "large"}
    price_modifier DECIMAL(10,2) DEFAULT 0, -- additional cost
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product reviews
CREATE TABLE product_review (
    review_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES user_account(account_id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_votes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- SHOPPING CART & WISHLIST
-- ===========================================

-- Shopping cart
CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES user_account(account_id) ON DELETE CASCADE,
    session_id VARCHAR(100), -- for guest users
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    variant_id INTEGER REFERENCES product_variant(variant_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(12,2) NOT NULL, -- price at time of adding
    attributes JSONB DEFAULT '{}', -- selected options
    is_active BOOLEAN DEFAULT TRUE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, product_id, variant_id) DEFERRABLE INITIALLY DEFERRED
);

-- Wishlist
CREATE TABLE wishlist (
    wishlist_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES user_account(account_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    variant_id INTEGER REFERENCES product_variant(variant_id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, product_id, variant_id)
);

-- ===========================================
-- ORDER MANAGEMENT
-- ===========================================

-- Orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL, -- generated order number
    account_id INTEGER REFERENCES user_account(account_id) ON DELETE SET NULL,

    -- Order totals
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    shipping_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,

    -- Shipping
    delivery_method VARCHAR(20) NOT NULL CHECK (delivery_method IN ('delivery', 'pickup')),
    delivery_date DATE,
    delivery_time TIME,
    pickup_station VARCHAR(100),
    delivery_address JSONB, -- structured address data
    shipping_instructions TEXT,

    -- Payment
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('mobile_money', 'cash_on_delivery', 'card', 'bank_transfer')),
    payment_provider VARCHAR(20), -- 'mtn_momo', 'airtel_money', etc.
    payment_number VARCHAR(20),
    payment_reference VARCHAR(100), -- transaction reference
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),

    -- Order status
    order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    status_history JSONB DEFAULT '[]', -- track status changes

    -- Additional info
    notes TEXT,
    ip_address INET,
    user_agent TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP
);

-- Order items
CREATE TABLE order_item (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(product_id),
    variant_id INTEGER REFERENCES product_variant(variant_id),
    product_name VARCHAR(200) NOT NULL, -- snapshot of name
    product_sku VARCHAR(50), -- snapshot of SKU
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    attributes JSONB DEFAULT '{}', -- selected options at purchase time
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- DELIVERY MANAGEMENT
-- ===========================================

-- Delivery partners
CREATE TABLE delivery_partner (
    partner_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    contact VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    vehicle_type VARCHAR(50),
    license_plate VARCHAR(20),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'busy', 'inactive', 'maintenance')),
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_deliveries INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deliveries
CREATE TABLE deliveries (
    delivery_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
    partner_id INTEGER REFERENCES delivery_partner(partner_id),
    tracking_number VARCHAR(50) UNIQUE,
    delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'picked_up', 'on_the_way', 'delivered', 'failed', 'returned')),
    estimated_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    delivery_notes TEXT,
    recipient_name VARCHAR(100),
    recipient_contact VARCHAR(15),
    delivery_address JSONB,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    status_history JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- ANALYTICS & PERSONALIZATION
-- ===========================================

-- User search history
CREATE TABLE search_history (
    search_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES user_account(account_id) ON DELETE CASCADE,
    session_id VARCHAR(100),
    search_query TEXT NOT NULL,
    filters JSONB DEFAULT '{}',
    result_count INTEGER,
    clicked_product_id INTEGER REFERENCES products(product_id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product view tracking
CREATE TABLE product_view (
    view_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES user_account(account_id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    view_duration INTEGER, -- in seconds
    source VARCHAR(50), -- 'search', 'category', 'recommendation', etc.
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences and recommendations
CREATE TABLE user_preference (
    preference_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES user_account(account_id) ON DELETE CASCADE,
    preference_type VARCHAR(50) NOT NULL, -- 'category', 'brand', 'price_range', etc.
    preference_value TEXT NOT NULL,
    weight DECIMAL(3,2) DEFAULT 1.00, -- importance weight
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, preference_type, preference_value)
);

-- ===========================================
-- COMMUNICATION & SUPPORT
-- ===========================================

-- Messages/Contact forms
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES user_account(account_id) ON DELETE SET NULL,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    contact VARCHAR(15),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'general' CHECK (message_type IN ('general', 'complaint', 'suggestion', 'support')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived', 'closed')),
    assigned_to INTEGER REFERENCES admins(admin_id),
    response TEXT,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notification (
    notification_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES user_account(account_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(30) NOT NULL, -- 'order_update', 'promotion', 'system', etc.
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    data JSONB DEFAULT '{}', -- additional data for actions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- INVENTORY MANAGEMENT
-- ===========================================

-- Stock movements (for audit trail)
CREATE TABLE stock_movement (
    movement_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    variant_id INTEGER REFERENCES product_variant(variant_id) ON DELETE SET NULL,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'return', 'damage')),
    quantity INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reference_type VARCHAR(20), -- 'order', 'purchase', 'adjustment', etc.
    reference_id INTEGER, -- order_id, purchase_id, etc.
    notes TEXT,
    performed_by INTEGER REFERENCES user_account(account_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase orders (for inventory replenishment)
CREATE TABLE purchase_order (
    purchase_id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES supplier(supplier_id),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'ordered', 'received', 'cancelled')),
    total_amount DECIMAL(12,2),
    expected_delivery DATE,
    actual_delivery DATE,
    notes TEXT,
    created_by INTEGER REFERENCES user_account(account_id),
    approved_by INTEGER REFERENCES user_account(account_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase order items
CREATE TABLE purchase_order_item (
    item_id SERIAL PRIMARY KEY,
    purchase_id INTEGER REFERENCES purchase_order(purchase_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(product_id),
    variant_id INTEGER REFERENCES product_variant(variant_id),
    quantity_ordered INTEGER NOT NULL,
    quantity_received INTEGER DEFAULT 0,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(12,2) NOT NULL,
    received_at TIMESTAMP
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- User indexes
CREATE INDEX idx_user_account_email ON user_account(university_email);
CREATE INDEX idx_user_account_type ON user_account(account_type);
CREATE INDEX idx_user_account_status ON user_account(account_status);

-- Product indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_created ON products(created_at);

-- Order indexes
CREATE INDEX idx_orders_account ON orders(account_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Cart and wishlist indexes
CREATE INDEX idx_cart_account ON cart(account_id);
CREATE INDEX idx_cart_session ON cart(session_id);
CREATE INDEX idx_wishlist_account ON wishlist(account_id);

-- Search and analytics indexes
CREATE INDEX idx_search_history_account ON search_history(account_id);
CREATE INDEX idx_search_history_query ON search_history USING gin(to_tsvector('english', search_query));
CREATE INDEX idx_product_view_product ON product_view(product_id);
CREATE INDEX idx_product_view_account ON product_view(account_id);

-- ===========================================
-- TRIGGERS FOR AUTOMATION
-- ===========================================

-- Function to update product stock status
CREATE OR REPLACE FUNCTION update_product_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_quantity = 0 THEN
        NEW.stock_status := 'out_of_stock';
    ELSIF NEW.stock_quantity <= NEW.low_stock_threshold THEN
        NEW.stock_status := 'low_stock';
    ELSE
        NEW.stock_status := 'in_stock';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock_status
    BEFORE UPDATE ON products
    FOR EACH ROW
    WHEN (OLD.stock_quantity IS DISTINCT FROM NEW.stock_quantity)
    EXECUTE FUNCTION update_product_stock_status();

-- Function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    SELECT AVG(rating), COUNT(*) INTO avg_rating, review_count
    FROM product_review
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    AND status = 'approved';

    UPDATE products
    SET rating = avg_rating, review_count = review_count
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_rating
    AFTER INSERT OR UPDATE OR DELETE ON product_review
    EXECUTE FUNCTION update_product_rating();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'ORD-' || TO_CHAR(NEW.created_at, 'YYYYMMDD') || '-' || LPAD(NEW.order_id::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- Function to log stock movements
CREATE OR REPLACE FUNCTION log_stock_movement()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.stock_quantity != NEW.stock_quantity THEN
        INSERT INTO stock_movement (
            product_id, variant_id, movement_type, quantity,
            previous_stock, new_stock, reference_type, reference_id
        ) VALUES (
            NEW.product_id, NULL,
            CASE WHEN NEW.stock_quantity > OLD.stock_quantity THEN 'in' ELSE 'out' END,
            ABS(NEW.stock_quantity - OLD.stock_quantity),
            OLD.stock_quantity, NEW.stock_quantity,
            'adjustment', NEW.product_id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_stock_movement
    AFTER UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION log_stock_movement();

-- ===========================================
-- SAMPLE DATA INSERTION
-- ===========================================

-- Insert default categories
INSERT INTO category (name, description) VALUES
('computing', 'Laptops, desktops, and computing accessories'),
('clothing', 'Fashion and apparel'),
('groceries', 'Food and household items'),
('smartphones', 'Mobile phones and accessories'),
('electronics', 'Consumer electronics'),
('books', 'Educational and leisure books'),
('sports', 'Sports equipment and apparel');

-- Insert sample admin user
INSERT INTO user_account (university_email, account_type, password_hash, email_verified) VALUES
('admin@unikart.edu', 'admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true);

INSERT INTO admins (account_id, username, email, full_name, role) VALUES
(1, 'admin1', 'admin@unikart.edu', 'System Administrator', 'admin');

-- Insert sample products
INSERT INTO products (supplier_id, category_id, sku, name, description, price, stock_quantity, image_url, is_featured) VALUES
(1, 1, 'HP-PAV-001', 'HP Pavilion 15 Laptop', 'Powerful i7 processor with 256GB SSD storage', 1200000.00, 200, 'HP Pavilion 15.jpeg', true),
(1, 2, 'SHOE-MALE-001', 'Men''s Quality Shoes', 'Durable and comfortable shoes for men', 75000.00, 40, 'menb5.webp', false),
(1, 2, 'JEANS-WOMEN-001', 'Women Straight Fit Jeans', 'No fade black jeans with clean look, regular length', 35000.00, 100, 'lj3.webp', false),
(1, 3, 'KAROO-5KG', 'Numa Karo 5kg', 'Blend of millet and cassava flour, nutritious and quality', 21000.00, 100, 'numakaro.jpg', false),
(1, 3, 'WHEAT-2KG', 'Supreme Wheat Flour 2kg', 'Premium home baking flour fortified with vitamins & minerals', 7500.00, 100, 'supremewheat.jpeg', false),
(1, 4, 'BEATS-001', 'Beats Headphones', 'Durable wireless headphones', 25000.00, 50, 'beats.png', false);</content>
<parameter name="filePath">d:\Downloads\unikart\unikart_db_postgres.sql