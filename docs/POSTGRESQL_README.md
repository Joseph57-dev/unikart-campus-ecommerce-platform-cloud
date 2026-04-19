# Unikart Campus Online Shopping - PostgreSQL Backend

This project has been upgraded to use PostgreSQL for enhanced performance, security, and scalability. The database now supports comprehensive e-commerce features including real-time inventory management, advanced analytics, and secure transaction processing.

## 🚀 Features

### Product Catalog Management
- **Complete Product Details**: Names, descriptions, prices, images, SKUs
- **Advanced Inventory Control**: Real-time stock tracking with automatic status updates
- **Product Variants**: Support for different sizes, colors, and options
- **Categories & Suppliers**: Hierarchical categorization and vendor management

### User Management & Security
- **Multi-Role Authentication**: Students, Vendors, Deans, and System Admins
- **Encrypted Passwords**: bcrypt hashing with salt
- **Session Management**: Secure cart persistence and user sessions
- **128-bit Security**: PostgreSQL's built-in encryption capabilities

### Transaction Processing
- **Order Management**: Complete purchase flow from cart to delivery
- **Payment Integration**: Support for mobile money and multiple payment methods
- **Shipping Tracking**: Real-time delivery status updates
- **Invoice Generation**: Automated receipt and invoice creation

### Analytics & Personalization
- **Purchase History**: Complete transaction tracking
- **Search Behavior**: User search patterns and preferences
- **Personalized Recommendations**: AI-powered product suggestions
- **Performance Analytics**: Sales reports and business intelligence

## 🛠 Installation & Setup

### Prerequisites
- PHP 8.0 or higher
- PostgreSQL 12 or higher
- Composer (for dependency management)

### 1. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Windows - Download from postgresql.org
```

### 2. Create Database User
```sql
-- Connect to PostgreSQL as superuser
sudo -u postgres psql

-- Create database user
CREATE USER unikart_user WITH PASSWORD 'your_secure_password';

-- Create database
CREATE DATABASE unikart_db OWNER unikart_user;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE unikart_db TO unikart_user;
```

### 3. Configure Database Connection
Edit `components/connect_pgsql.php`:
```php
$host = 'localhost';
$dbname = 'unikart_db';
$username = 'unikart_user';  // Your PostgreSQL username
$password = 'your_secure_password';  // Your password
$port = '5432';
```

### 4. Run Database Setup
```bash
cd /path/to/unikart
php setup_database.php
```

This will:
- Create the database (if it doesn't exist)
- Execute the complete schema
- Create all tables, indexes, and triggers
- Insert sample data

### 5. Update API Endpoints
The API endpoints have been updated to use PostgreSQL. Use the new endpoints:
- Products API: `api/products/index_pgsql.php`
- Configuration: `api/config_pgsql.php`

## 📊 Database Schema Overview

### Core Tables
- `user_account` - Base user accounts with role-based access
- `student` - Student profiles
- `admins` - Administrative users
- `supplier` - Product vendors
- `products` - Product catalog with inventory
- `category` - Product categories
- `orders` - Customer orders
- `order_item` - Order line items

### Advanced Features
- `product_variant` - Product variations (size, color, etc.)
- `product_review` - Customer reviews and ratings
- `cart` - Shopping cart with session support
- `wishlist` - Saved products
- `stock_movement` - Inventory audit trail
- `search_history` - User search analytics
- `user_preference` - Personalization data

### Transaction Tables
- `deliveries` - Shipping and delivery tracking
- `delivery_partner` - Delivery service providers
- `purchase_order` - Inventory replenishment orders
- `notification` - User notifications

## 🔧 API Usage

### Authentication
All API requests require an API key:
```
X-API-Key: unikart_web_key_2024
```

### Products API

#### Get Products
```http
GET /api/products/index_pgsql.php?page=1&limit=20&category=computing&min_price=10000
```

#### Create Product
```http
POST /api/products/index_pgsql.php
Content-Type: application/json
X-API-Key: unikart_web_key_2024

{
  "name": "Gaming Laptop",
  "sku": "GAMING-LAPTOP-001",
  "price": 2500000.00,
  "description": "High-performance gaming laptop",
  "category_id": 1,
  "stock_quantity": 10
}
```

#### Update Product
```http
PUT /api/products/index_pgsql.php
Content-Type: application/json
X-API-Key: unikart_web_key_2024

{
  "product_id": 1,
  "price": 2600000.00,
  "stock_quantity": 8
}
```

## 🔒 Security Features

### Data Encryption
- Passwords hashed with bcrypt
- Sensitive data encrypted at rest
- SSL/TLS for data in transit

### Access Control
- Role-based permissions (student, vendor, dean, admin)
- API key authentication
- Input validation and sanitization

### Audit Trail
- All stock movements logged
- User actions tracked
- Transaction history maintained

## 📈 Performance Optimizations

### Database Indexes
- Optimized indexes on frequently queried columns
- Composite indexes for complex queries
- Partial indexes for active records

### Query Optimization
- Efficient pagination
- Proper JOIN operations
- Connection pooling ready

### Triggers & Automation
- Automatic stock status updates
- Rating calculations
- Order number generation

## 🔄 Migration from MySQL

If migrating from the existing MySQL database:

1. Export data from MySQL tables
2. Transform data to match PostgreSQL schema
3. Use pgloader or custom scripts for migration
4. Update application code to use PostgreSQL connections

## 🧪 Testing

### Sample API Calls
```bash
# Test products endpoint
curl -H "X-API-Key: unikart_public_key_2024" \
     "http://localhost/unikart/api/products/index_pgsql.php?page=1&limit=5"

# Test with search
curl -H "X-API-Key: unikart_public_key_2024" \
     "http://localhost/unikart/api/products/index_pgsql.php?search=laptop"
```

### Database Verification
```sql
-- Check table counts
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public';

-- Verify constraints
SELECT conname, conrelid::regclass, contype
FROM pg_constraint
WHERE conrelid::regclass::text LIKE 'public.%';
```

## 🚀 Deployment

### Production Considerations
1. Use connection pooling (pgpool-II or similar)
2. Configure PostgreSQL for high availability
3. Set up automated backups
4. Monitor performance with pg_stat_statements
5. Use SSL for database connections

### Environment Variables
```bash
DB_HOST=localhost
DB_NAME=unikart_db
DB_USER=unikart_user
DB_PASS=your_secure_password
DB_PORT=5432
API_KEYS=unikart_web_key_2024,unikart_mobile_key_2024
```

## 📞 Support

For issues or questions:
- Check the database logs: `tail -f /var/log/postgresql/postgresql-*.log`
- Verify PHP PostgreSQL extension: `php -m | grep pgsql`
- Test database connection: `php -r "new PDO('pgsql:host=localhost;dbname=unikart_db;user=unikart_user;password=pass');"`

## 🔄 Future Enhancements

- Real-time notifications with WebSockets
- Advanced analytics dashboard
- AI-powered product recommendations
- Multi-tenant architecture support
- API rate limiting and caching</content>
<parameter name="filePath">d:\Downloads\unikart\POSTGRESQL_README.md