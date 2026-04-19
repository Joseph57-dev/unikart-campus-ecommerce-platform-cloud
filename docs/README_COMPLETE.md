# 🛒 Unikart Campus Online Shopping - Complete Cloud Application

A modern, scalable e-commerce platform built for campus communities with role-based access (Students, Vendors, Deans, Admin), cloud deployment on AWS, and comprehensive inventory management.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with Cognito integration
- Multi-role access control (Student, Vendor, Dean, Admin)
- Secure password hashing with bcrypt
- Token-based session management

### 📦 Product Management
- Full CRUD operations for products
- Product variants (sizes, colors, etc.)
- AWS S3 image storage with automatic optimization
- Real-time inventory tracking
- Categorization and search capabilities
- Product ratings and reviews

### 🛒 Shopping Experience
- Dynamic product catalog with filtering
- Shopping cart with local persistence
- Wishlist functionality
- Quick view and detailed product pages
- Advanced search with autocomplete

### 📋 Order Management
- Complete order lifecycle (pending → delivered)
- Multiple payment methods (Mobile Money, Cash on Delivery)
- Delivery tracking with real-time updates
- Invoice generation
- Order status notifications

### 👥 Role-Based Dashboards
- **Students**: View order history, track shipments
- **Vendors**: Manage products, update inventory, fulfill orders
- **Deans**: Analytics, performance reports, student insights
- **Admin**: System management, user permissions, help desk

### 🌐 Cloud Architecture
- Containerized microservices ready
- Horizontal scaling capability
- Cost-optimized AWS infrastructure
- CDN integration for fast delivery
- Automated backups and disaster recovery

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL 12+
- **Cloud**: AWS (S3, Cognito, Lambda, RDS)
- **Authentication**: JWT + AWS Cognito
- **ORM**: Native Node PostgreSQL client
- **File Upload**: Multer + AWS S3

### Frontend
- **Framework**: React 18.3
- **Build Tool**: Vite 5.4
- **Routing**: React Router DOM 6.17
- **Styling**: CSS3 with responsive design
- **HTTP Client**: Axios
- **State**: localStorage for cart/user data

### Infrastructure
- **Server**: Express.js / AWS Lambda
- **Database**: PostgreSQL on AWS RDS
- **Storage**: AWS S3
- **CDN**: AWS CloudFront
- **Container**: Docker (optional)
- **CI/CD**: GitHub Actions

## 📂 Project Structure

```
unikart/
├── backend/                          # Node.js Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.js             # Configuration loader
│   │   │   ├── database.js          # PostgreSQL connection pool
│   │   │   └── aws.js               # AWS services setup
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic (register, login)
│   │   │   ├── productController.js # Product CRUD + search
│   │   │   └── orderController.js   # Order management
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification, role checks
│   │   │   └── upload.js            # File upload handling
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth endpoints
│   │   │   ├── productRoutes.js     # /api/products endpoints
│   │   │   └── orderRoutes.js       # /api/orders endpoints
│   │   ├── services/
│   │   │   └── s3Service.js         # S3 upload/delete operations
│   │   └── utils/
│   │       ├── jwt.js               # Token generation/verification
│   │       └── database.js          # Database query helpers
│   ├── server.js                     # Express app initialization
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/                         # React + Vite SPA
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Shop.jsx             # Product catalog
│   │   │   ├── Cart.jsx             # Shopping cart
│   │   │   ├── Checkout.jsx         # Order placement
│   │   │   ├── Login.jsx            # Authentication
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── VendorDashboard.jsx
│   │   │   ├── DeanDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js               # Axios configuration
│   │   │   ├── authService.js       # Auth API calls
│   │   │   ├── productService.js    # Product API calls
│   │   │   └── orderService.js      # Order API calls
│   │   ├── App.jsx                  # Main app component
│   │   ├── App.css                  # Global styles
│   │   └── main.jsx                 # Entry point
│   ├── public/
│   │   ├── favicon.ico
│   │   └── project images/          # Product images
│   ├── index.html
│   ├── package.json
│   ├── .env.local
│   ├── vite.config.js
│   └── .gitignore
│
├── unikart_db_postgres.sql          # PostgreSQL schema
├── DEPLOYMENT_GUIDE.md              # Cloud deployment docs
├── POSTGRESQL_README.md             # Database setup
├── Unikart_API.postman_collection.json
├── setup.sh                         # Quick start script
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### 1. Clone & Setup
```bash
# Clone repository
git clone <your-repo-url>
cd unikart

# Make setup script executable (Linux/Mac)
chmod +x setup.sh
./setup.sh

# Or on Windows, run manually:
cd backend && npm install && cd ../frontend && npm install
```

### 2. Configure Environment
```bash
# Backend configuration
cd backend
cp .env.example .env
# Edit .env with your database and AWS credentials

# Frontend configuration (already set)
# frontend/.env.local points to http://localhost:5000/api
```

### 3. Database Setup
```bash
# Create database
createdb unikart_db

# Initialize schema
psql -d unikart_db -f unikart_db_postgres.sql
```

### 4. Run Development Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2: Frontend
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### 5. Test Login
Open http://localhost:5173 and create an account or test with demo credentials.

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

### Auth Endpoints
```
POST   /auth/register           # Register new user
POST   /auth/login              # Login user
POST   /auth/logout             # Logout user
GET    /auth/verify             # Verify token (protected)
```

### Product Endpoints
```
GET    /products                # Get all products (paginated)
GET    /products/:id            # Get product details
POST   /products                # Create product (protected, admin/vendor)
PUT    /products/:id            # Update product (protected, admin/vendor)
DELETE /products/:id            # Delete product (protected, admin/vendor)
```

### Order Endpoints
```
POST   /orders                  # Create order (protected)
GET    /orders                  # Get user orders (protected)
GET    /orders/:id              # Get order details (protected)
PUT    /orders/:id/cancel       # Cancel order (protected)
PUT    /orders/:id/status       # Update status (protected, admin/vendor)
```

### Health Check
```
GET    /health                  # API health status
```

## 🗄️ Database Schema

### Core Tables
- **user_account** - Base user authentication
- **student** - Student profiles
- **admins** - Administrative users
- **supplier** - Product vendors
- **products** - Product catalog
- **category** - Product categories
- **product_variant** - Size, color variants
- **product_review** - Customer reviews

### Transaction Tables
- **orders** - Customer orders
- **order_item** - Order line items
- **cart** - Shopping cart
- **wishlist** - Saved products

### Shipping & Analytics
- **deliveries** - Shipment tracking
- **delivery_partner** - Courier services
- **search_history** - User search logs
- **product_view** - Product analytics

## 🧪 Testing

### Using Postman
1. Import `Unikart_API.postman_collection.json`
2. Set variables:
   - `baseURL`: http://localhost:5000
   - `token`: Get from login response
3. Run test collection

### Manual Testing with cURL
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123"}'

# Get products
curl http://localhost:5000/api/products
```

### Frontend Testing Checklist
- [ ] User registration and login
- [ ] Product search and filtering
- [ ] Add to cart and checkout
- [ ] Place order with payment method
- [ ] View order history
- [ ] Role-based dashboard access
- [ ] Responsive design on mobile

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Environment variable configuration
- CORS policy enforcement
- SQL injection prevention (parameterized queries)
- Request validation and sanitization
- Rate limiting ready
- AWS security best practices

## 📦 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- Local development setup
- Docker containerization
- AWS EC2/Lambda deployment
- RDS database setup
- S3 configuration
- CloudFront CDN
- Security checklist
- Performance optimization

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unikart_db
DB_USER=postgres
DB_PASSWORD=password
AWS_REGION=us-east-1
AWS_S3_BUCKET=unikart-products
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret_key
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Database Queries

### Most Popular Products
```sql
SELECT product_id, name, purchase_count, rating 
FROM products 
ORDER BY purchase_count DESC 
LIMIT 10;
```

### Sales by Category
```sql
SELECT c.name, COUNT(*) as total_sales, SUM(oi.total_price) as revenue
FROM order_item oi
JOIN products p ON oi.product_id = p.product_id
JOIN category c ON p.category_id = c.category_id
GROUP BY c.name;
```

### User Order History
```sql
SELECT o.order_id, o.created_at, o.total_amount, o.order_status
FROM orders o
WHERE o.account_id = $1
ORDER BY o.created_at DESC;
```

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Check database connection
psql -U postgres -h localhost -d unikart_db -c "SELECT 1"

# Check environment variables
cat backend/.env
```

### Frontend API Errors
1. Verify backend is running: `curl http://localhost:5000/health`
2. Check browser console for errors
3. Verify CORS is enabled in backend
4. Ensure VITE_API_URL is correct

### Database Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restore from backup
psql -d unikart_db < backup.sql

# Verify schema
psql -d unikart_db -c "\dt"
```

## 📚 Documentation

- [API Documentation](./DEPLOYMENT_GUIDE.md#api-testing)
- [Database Schema](./POSTGRESQL_README.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [PostgreSQL Setup](./POSTGRESQL_README.md)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## 📄 License

MIT License - See LICENSE file for details

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue](/)
- Email: support@unikart.edu
- Documentation: See docs/ directory

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSockets)
- [ ] Advanced analytics dashboard
- [ ] AI-powered recommendations
- [ ] Two-factor authentication
- [ ] Subscription plans
- [ ] Vendor analytics
- [ ] International payment methods

## 🎉 What's Next?

1. **Test Locally**: Run through all features in development
2. **Database Migration**: Import production data if available
3. **AWS Setup**: Configure Cognito, S3, RDS for cloud deployment
4. **CI/CD Pipeline**: Set up GitHub Actions for automated testing
5. **Load Testing**: Use Apache JMeter or Artillery
6. **Security Audit**: Run OWASP security checks
7. **Performance Tuning**: Monitor and optimize based on metrics
8. **Go Live**: Deploy to production with blue-green deployment

---

**Built with ❤️ for campus communities**

Version: 1.0.0 | Last Updated: 2024 | Status: Active Development
