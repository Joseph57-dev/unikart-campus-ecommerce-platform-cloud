# Local Development Setup Guide

This guide explains how to run both the frontend and backend of Unikart locally for development and testing.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- AWS account (for SNS/SES - optional for local development)

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd src/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unikart_db
DB_USER=postgres
DB_PASSWORD=your_password

# AWS Configuration (Optional for local development)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=unikart-products
AWS_S3_REGION=us-east-1

# AWS SNS + SES Configuration (Optional)
AWS_SNS_TOPIC_ARN=arn:aws:sns:us-east-1:account-id:order-notifications
AWS_SES_SENDER_EMAIL=noreply@yourdomain.com
AWS_SES_CONFIGURATION_SET=UnikartConfigSet

# AWS Cognito (Optional)
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_APP_CLIENT_ID=your_client_id
COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# API Configuration
API_SECRET_KEY=your_super_secret_key_change_in_production
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d

# App Configuration
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
FILE_UPLOAD_SIZE=5242880

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password
```

### 4. Database Setup

#### Option 1: Using PostgreSQL Locally

1. Install PostgreSQL if not already installed
2. Create database:

```sql
CREATE DATABASE unikart_db;
```

3. Run database migrations:

```bash
# Run the setup script
node deployment/setup_database.js
```

#### Option 2: Using Docker

```bash
# Start PostgreSQL with Docker
docker run --name unikart-postgres -e POSTGRES_DB=unikart_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

### 5. Start Backend Server

```bash
npm start
```

The backend will be available at `http://localhost:5000`

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd src/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The frontend `.env.local` file should already be configured:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Database Setup

### Using the Setup Script

The project includes a setup script that creates the database schema:

```bash
cd src/backend
node deployment/setup_database.js
```

### Manual Setup

Alternatively, you can run the SQL files manually:

```bash
# For PostgreSQL
psql -U postgres -d unikart_db -f database/unikart_db_postgres.sql
```

## Running the Application

### Start Both Servers

1. **Backend Server** (Terminal 1):
   ```bash
   cd src/backend
   npm start
   ```

2. **Frontend Server** (Terminal 2):
   ```bash
   cd src/frontend
   npm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **API Documentation**: http://localhost:5000/api-docs (if Swagger is configured)

## Testing

### Backend Tests

```bash
cd src/backend
npm test
```

### Frontend Tests

```bash
cd src/frontend
npm test
```

### Integration Tests

Run the comprehensive integration test:

```bash
cd src/frontend
node src/tests/IntegrationTests.js
```

### Manual Testing

1. **Register a User**:
   - Go to http://localhost:5173/login
   - Register with test credentials

2. **Browse Products**:
   - Visit http://localhost:5173/shop
   - Add items to cart

3. **Place an Order**:
   - Go to http://localhost:5173/cart
   - Proceed to checkout
   - Complete the order

4. **Check Dashboard**:
   - Log in and visit http://localhost:5173/dashboard
   - View orders and account information

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin/vendor)
- `PUT /api/products/:id` - Update product (admin/vendor)
- `DELETE /api/products/:id` - Delete product (admin/vendor)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/status` - Update order status (admin/vendor)

## CORS Configuration

The backend is configured to allow requests from the frontend:

```javascript
app.use(cors({
  origin: config.urls.frontend, // http://localhost:5173
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### 2. Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

#### 3. CORS Errors
- Check frontend URL in backend `.env` file
- Ensure both servers are running
- Check browser console for CORS errors

#### 4. JWT Token Issues
- Clear browser localStorage
- Check JWT secret in `.env`
- Verify token expiration time

#### 5. File Upload Issues
- Check file size limits
- Verify upload directory permissions
- Check AWS S3 configuration if using cloud storage

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=unikart:* npm start

# Frontend
npm run dev -- --debug
```

### Logs

Backend logs are displayed in the terminal. For more detailed logging:

```javascript
// Add to server.js
const morgan = require('morgan');
app.use(morgan('dev'));
```

## Production Deployment

### Build Frontend

```bash
cd src/frontend
npm run build
```

### Serve Static Files

The backend can serve the built frontend files:

```javascript
// Add to server.js
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
```

### Environment Variables for Production

Create production environment files with secure values:

```env
NODE_ENV=production
API_SECRET_KEY=your_production_secret_key
JWT_SECRET=your_production_jwt_secret
```

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload for faster development
2. **API Testing**: Use Postman or the built-in integration tests
3. **Database**: Use pgAdmin or psql for database management
4. **Debugging**: Use browser dev tools and Node.js debugger
5. **Version Control**: Keep environment files in `.gitignore`

## Next Steps

1. Set up AWS SNS + SES for notifications (see `docs/AWS_SNS_SES_SETUP.md`)
2. Configure CI/CD pipeline
3. Set up monitoring and logging
4. Implement additional features
5. Optimize performance

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the logs
3. Check the documentation
4. Create an issue in the repository