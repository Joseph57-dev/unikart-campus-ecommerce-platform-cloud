# 🚀 Unikart - Quick Start Guide

Welcome to Unikart! Your e-commerce platform is ready to run locally.

## ✅ What's Already Set Up

- **AWS SDK v3** installed for SNS and SES notifications
- **Notification service** created and integrated with order processing
- **Environment files** configured
- **Dependencies** installed for both frontend and backend

## 🎯 Running the Application

### Both servers are currently running!

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📋 Quick Test

1. **Open your browser** and go to http://localhost:5173
2. **Browse the shop** - You'll see sample products
3. **Add items to cart** - Click "Add to Cart" on any product
4. **Go to checkout** - Complete an order
5. **Check the backend logs** - You should see order creation logs

## 🔧 Manual Start Commands

If you need to restart the servers:

### Terminal 1 - Backend:
```bash
cd src/backend
npm start
```

### Terminal 2 - Frontend:
```bash
cd src/frontend
npm run dev
```

## 🗄️ Database Setup

**Important**: You need a PostgreSQL database running.

### Option 1: Local PostgreSQL
1. Install PostgreSQL
2. Create database: `CREATE DATABASE unikart_db;`
3. Run setup: `node src/backend/deployment/setup_database.js`

### Option 2: Docker (Quick)
```bash
docker run --name unikart-postgres -e POSTGRES_DB=unikart_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

Then update `src/backend/.env` with your database credentials.

## 🔐 Environment Configuration

The `.env` file is already created at `src/backend/.env`. Update these values:

```env
# Database (update with your actual credentials)
DB_PASSWORD=your_postgres_password

# AWS (optional - for SNS/SES notifications)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_SNS_TOPIC_ARN=arn:aws:sns:region:account:order-notifications
AWS_SES_SENDER_EMAIL=noreply@yourdomain.com
```

## 🧪 Testing the Application

### Test Users (Frontend Demo)
- **Student**: student@campus.edu / student123
- **Vendor**: vendor@campus.edu / vendor123
- **Dean**: dean@campus.edu / dean123
- **Admin**: admin@campus.edu / admin123

### API Testing
```bash
# Health check
curl http://localhost:5000/health

# Get products
curl http://localhost:5000/api/products

# Create order (requires authentication)
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[...], "delivery_method":"delivery", ...}'
```

## 📦 Project Structure

```
unikart/
├── src/
│   ├── backend/          # Node.js + Express API
│   │   ├── src/
│   │   │   ├── config/   # Configuration files
│   │   │   ├── controllers/ # API controllers
│   │   │   ├── services/ # Business logic (including notifications)
│   │   │   ├── routes/   # API routes
│   │   │   └── middleware/ # Express middleware
│   │   ├── .env          # Environment variables
│   │   └── server.js     # Express server
│   └── frontend/         # React + Vite UI
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── pages/     # Page components
│       │   ├── services/  # API services
│       │   └── App.jsx    # Main app component
│       └── .env.local     # Frontend environment
├── docs/                 # Documentation
├── database/            # Database schemas
└── setup-local-dev.js   # Setup automation script
```

## 🛠️ Available Scripts

### Backend
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run dev` - Start with hot reload (if configured)

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin/vendor)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/status` - Update order status (admin)

## 📧 AWS SNS + SES Notifications

The notification system is configured and ready. When you set up AWS credentials:

1. **Order Confirmation** - Email sent to customer via SES
2. **Admin Notifications** - SNS notification for new orders
3. **Shipping Updates** - Email notification when order ships

See `docs/AWS_SNS_SES_SETUP.md` for detailed setup instructions.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Database Connection Error
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database exists

### CORS Errors
- Ensure backend is running on port 5000
- Check `FRONTEND_URL` in backend `.env` is `http://localhost:5173`
- Clear browser cache

### Module Not Found
- Run `npm install` in both backend and frontend directories
- Delete `node_modules` and reinstall if needed

## 📚 Documentation

- **Local Development**: `docs/LOCAL_DEVELOPMENT_SETUP.md`
- **AWS SNS/SES Setup**: `docs/AWS_SNS_SES_SETUP.md`
- **Complete README**: `docs/README_COMPLETE.md`
- **Deployment Guide**: `docs/DEPLOYMENT_GUIDE.md`

## 🎉 You're All Set!

Your Unikart e-commerce platform is running locally with:
- ✅ Frontend React app on port 5173
- ✅ Backend API on port 5000
- ✅ AWS SNS/SES notification system configured
- ✅ Order processing integrated
- ✅ Full documentation

**Next Steps:**
1. Set up your PostgreSQL database
2. Configure AWS credentials for notifications
3. Start building your features!

Happy coding! 🚀