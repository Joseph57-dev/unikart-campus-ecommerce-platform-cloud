# Unikart Cloud Deployment Guide

This guide covers setting up, testing, and deploying the complete Unikart application stack with Node.js backend, React frontend, PostgreSQL database, and AWS Cognito integration.

## 🗂️ Project Structure

```
unikart/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database and AWS config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, upload, error handling
│   │   ├── routes/         # API endpoint definitions
│   │   ├── services/       # S3 service
│   │   └── utils/          # JWT, database helpers
│   ├── package.json
│   ├── .env.example
│   └── server.js
├── frontend/                # React/Vite application
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── .env.local
│   └── vite.config.js
├── unikart_db_postgres.sql # PostgreSQL schema
└── README.md
```

## 🚀 Local Development Setup

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env with your settings
# DB_HOST=localhost
# DB_USER=postgres
# DB_PASSWORD=your_password
# AWS_ACCESS_KEY_ID=your_key
# AWS_SECRET_ACCESS_KEY=your_secret
# AWS_S3_BUCKET=your_bucket

# Start backend
npm run dev
```

Backend runs on: `http://localhost:5000`

API Documentation:
- Health Check: `GET /health`
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Products: `GET /api/products`, `POST /api/products` (admin)
- Orders: `POST /api/orders`, `GET /api/orders`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# .env.local already contains:
# VITE_API_URL=http://localhost:5000/api

# Start dev server
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb unikart_db

# Create user (if needed)
createuser unikart_user

# Import schema
psql -U unikart_user -d unikart_db -f unikart_db_postgres.sql

# Or use the PHP setup script (if available):
# php setup_database.php
```

## 🧪 Testing

### Backend API Testing

#### 1. Health Check
```bash
curl http://localhost:5000/health
```

Expected Response:
```json
{
  "status": "success",
  "message": "API is running",
  "data": {
    "timestamp": "2024-01-XX",
    "uptime": 123.456
  }
}
```

#### 2. User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@campus.edu",
    "password": "TestPass123",
    "full_name": "John Student",
    "account_type": "student",
    "faculty": "Computing"
  }'
```

#### 3. User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@campus.edu",
    "password": "TestPass123"
  }'
```

Response includes JWT token:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 4. Get Products
```bash
curl "http://localhost:5000/api/products?page=1&limit=20&category=computing"
```

#### 5. Get Product Details
```bash
curl http://localhost:5000/api/products/1
```

#### 6. Create Order (Authenticated)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {"product_id": 1, "quantity": 2}
    ],
    "delivery_method": "delivery",
    "delivery_address": "123 Campus St",
    "payment_method": "mobile_money",
    "payment_provider": "mtn_momo",
    "payment_number": "0700000000",
    "delivery_date": "2024-02-01"
  }'
```

### Frontend Testing

1. **Navigation**: Test all menu links
2. **Login Flow**: 
   - Register new account
   - Login with credentials
   - Verify token storage
   - Logout

3. **Shopping**:
   - Browse products
   - Search functionality
   - Add to cart
   - View cart
   - Update quantities

4. **Checkout**:
   - Select delivery method
   - Enter shipping address
   - Choose payment method
   - Place order
   - View order confirmation

5. **Dashboards**:
   - Student: View orders
   - Vendor: Manage products
   - Admin: System management

## 📊 Database Verification

```bash
# Connect to database
psql -U unikart_user -d unikart_db

# Verify tables
\dt

# Check sample data
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM user_account;
```

## ☁️ AWS Configuration

### 1. Create S3 Bucket

```bash
aws s3 mb s3://unikart-products --region us-east-1
```

### 2. Create Cognito User Pool

```bash
# Using AWS Console or CLI:
aws cognito-idp create-user-pool \
  --pool-name UnikartUserPool \
  --region us-east-1
```

### 3. Create IAM User for API

```bash
aws iam create-user --user-name unikart-api
aws iam attach-user-policy --user-name unikart-api \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
aws iam attach-user-policy --user-name unikart-api \
  --policy-arn arn:aws:iam::aws:policy/AmazonCognitoPowerUser
```

### 4. Configure Bucket CORS

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:5173", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## 🌐 Deployment to AWS

### 1. Backend Deployment (EC2/ECS/Lambda)

#### Option A: EC2
```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Clone repository
git clone your-repo-url
cd unikart/backend

# Install Node
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Configure environment
nano .env

# Install dependencies
npm install

# Start application
pm2 start server.js --name "unikart-api"
pm2 save
pm2 startup
```

#### Option B: AWS Lambda + API Gateway
```bash
# Create deployment package
cd backend
npm install
zip -r lambda-function.zip . -x "node_modules/*"

# Upload to Lambda through AWS Console
# Set environment variables
# Configure API Gateway
```

### 2. Frontend Deployment (CloudFront + S3)

```bash
cd frontend

# Build for production
npm run build

# Create S3 bucket
aws s3 mb s3://unikart-frontend --region us-east-1

# Upload build
aws s3 sync dist/ s3://unikart-frontend/ --delete

# Create CloudFront distribution
# Point to S3 bucket
# Add custom domain
```

### 3. Database Deployment (RDS)

```bash
# Create RDS PostgreSQL instance via AWS Console
# Configure security groups
# Create database
# Run migrations

aws rds-instance create --db-instance-identifier unikart-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --allocated-storage 20 \
  --db-name unikart_db \
  --master-username postgres \
  --master-user-password your-strong-password

# Connect and initialize schema
psql -h your-rds-endpoint.rds.amazonaws.com \
  -U postgres -d unikart_db \
  -f unikart_db_postgres.sql
```

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Set environment variables in production
- [ ] Enable SSL/TLS certificates
- [ ] Configure WAF (Web Application Firewall)
- [ ] Set up rate limiting
- [ ] Enable CORS only for trusted domains
- [ ] Use strong JWT secrets
- [ ] Enable database encryption
- [ ] Set up automated backups
- [ ] Monitor CloudWatch logs
- [ ] Configure VPC with private subnets
- [ ] Enable MFA for AWS accounts

## 📈 Performance Optimization

1. **Database**:
   - Add indexes on frequently queried columns
   - Use connection pooling
   - Implement query caching

2. **Backend**:
   - Enable compression
   - Implement caching headers
   - Use CDN for static files

3. **Frontend**:
   - Code splitting
   - Lazy loading
   - Image optimization
   - Service workers

4. **AWS**:
   - Use CloudFront CDN
   - Enable S3 transfer acceleration
   - Configure auto-scaling

## 📞 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
lsof -i :5000
kill -9 <PID>
```

**Database connection error:**
- Verify PostgreSQL is running
- Check connection string
- Verify user permissions

**S3 upload fails:**
- Check AWS credentials
- Verify bucket exists
- Check bucket permissions

### Frontend Issues

**API not connecting:**
- Verify backend is running
- Check VITE_API_URL
- Check CORS configuration
- Open browser console for errors

**Products not loading:**
- Check network tab
- Verify API endpoint
- Check database has data

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Vite Documentation](https://vitejs.dev/)

## 🎯 Next Steps

1. Test locally thoroughly
2. Set up CI/CD pipeline (GitHub Actions)
3. Configure Staging environment
4. Load testing
5. Security audit
6. User acceptance testing
7. Production deployment
8. Post-launch monitoring

