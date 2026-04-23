# Unikart - Campus Online Shopping Platform

A modern, full-stack e-commerce platform built for campus communities with React frontend and Node.js backend.

## 🚀 AWS Production Deployment

This application is configured for AWS cloud deployment with the following infrastructure:

### AWS Resources Configured:
- **Load Balancer**: `http://unikart-alb-296069847.eu-north-1.elb.amazonaws.com`
- **Database**: PostgreSQL RDS (`unikart-postgres.chogwkgeox2f.eu-north-1.rds.amazonaws.com`)
- **Authentication**: JWT issued by the Node.js API (`JWT_SECRET` / `JWT_EXPIRE` in backend environment)
- **Auto Scaling**: EC2 instances with target group
- **Region**: eu-north-1 (Stockholm)

### Quick Deploy:
1. Copy `.env.example` to `.env` and fill in your AWS credentials
2. Run `deploy.sh` to build Docker image
3. Deploy to EC2 or use CodeDeploy
4. Test health endpoint: `http://unikart-alb-296069847.eu-north-1.elb.amazonaws.com/health`

## 📁 Project Structure

```
unikart/
├── docs/                    # 📚 Documentation
│   ├── DEPLOYMENT_GUIDE.md
│   ├── DEPLOYMENT_READINESS_CHECKLIST.md
│   ├── DOCUMENTATION_INDEX.md
│   ├── FILE_STRUCTURE_GUIDE.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── POSTGRESQL_README.md
│   ├── PROJECT_COMPLETION_SUMMARY.md
│   ├── QA_TESTING_GUIDE.md
│   ├── README_COMPLETE.md
│   └── UNIKART_COMPLETE_SUMMARY.md
├── src/                     # 💻 Source Code
│   ├── frontend/           # ⚛️  React Application
│   │   ├── public/         # Static assets
│   │   ├── src/            # React source code
│   │   ├── package.json    # Frontend dependencies
│   │   └── vite.config.js  # Vite configuration
│   └── backend/            # 🚀 Node.js API Server
│       ├── src/            # Backend source code
│       ├── package.json    # Backend dependencies
│       └── server.js       # Main server file
├── database/               # 🗄️  Database Files
│   ├── unikart_db.sql      # MySQL schema
│   └── unikart_db_postgres.sql # PostgreSQL schema
├── legacy/                 # 📜 Legacy PHP System
│   ├── admin/              # Admin panel
│   ├── api/                # PHP API endpoints
│   ├── components/         # PHP components
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   ├── images/             # Static images
│   ├── uploaded_img/       # User uploaded images
│   └── *.php               # PHP pages
├── deployment/             # 🚀 Deployment Assets
│   ├── setup.sh            # Setup script
│   ├── setup_database.php  # Database setup
│   ├── test_postgres_setup.php
│   └── Unikart_API.postman_collection.json
├── START_HERE.js          # 🚀 Quick start script
├── test_connection.js     # 🔍 Connection test
└── README.md              # 📖 This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- PostgreSQL (optional - uses mock data by default)

### Installation & Setup

1. **Clone and navigate to the project:**
   ```bash
   cd unikart
   ```

2. **Start the backend:**
   ```bash
   cd src/backend
   npm install
   npm start
   ```
   Backend will run on `http://localhost:5000`

3. **Start the frontend (in a new terminal):**
   ```bash
   cd src/frontend
   npm install
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **Test the connection:**
   ```bash
   node test_connection.js
   ```

## 📋 Features

### 🛒 E-Commerce Features
- **Product Catalog**: 15+ products across 6 categories
- **Shopping Cart**: Add, remove, update quantities
- **User Authentication**: Register, login, logout
- **Order Management**: Place orders, view order history
- **Wishlist**: Save favorite products
- **Product Reviews**: Rate and review products
- **Search & Filters**: Find products by category, price, rating

### 🛠️ Technical Features
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live cart and wishlist updates
- **API Integration**: RESTful API with JWT authentication
- **Mock Data**: Works without database setup
- **Modern UI**: Clean, intuitive interface

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18.3.1 with Vite
- **Routing**: React Router for navigation
- **State Management**: React hooks and context
- **Styling**: CSS modules and responsive design
- **API Client**: Axios for HTTP requests

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express 4.18
- **Authentication**: JWT tokens with bcrypt
- **Database**: PostgreSQL with pg driver (mock data fallback)
- **Security**: Helmet, CORS, rate limiting
- **Validation**: Joi for input validation

## 📁 Directory Explanations

### `src/` - Source Code
Contains the modern React frontend and Node.js backend applications.

### `docs/` - Documentation
Comprehensive documentation including setup guides, API docs, and deployment instructions.

### `database/` - Database Schema
SQL files for both MySQL and PostgreSQL database setups.

### `legacy/` - Legacy PHP System
The original PHP-based e-commerce system (preserved for reference).

### `deployment/` - Deployment Assets
Scripts, configurations, and tools for deploying the application.

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
cd src/frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

**Backend:**
```bash
cd src/backend
npm start        # Start production server
npm run dev      # Start with nodemon
npm test         # Run tests
```

### Environment Variables

Create `.env` files in both `src/frontend` and `src/backend` directories:

**Backend (.env):**
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unikart_db
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your_jwt_secret
AWS_REGION=us-east-1
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

See `docs/DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

### Quick Deployment
1. Use the setup script: `bash deployment/setup.sh`
2. Follow the deployment checklist: `docs/DEPLOYMENT_READINESS_CHECKLIST.md`

## 🧪 Testing

### API Testing
- Import `deployment/Unikart_API.postman_collection.json` into Postman
- Use the connection test: `node test_connection.js`

### Manual Testing
See `docs/QA_TESTING_GUIDE.md` for comprehensive testing procedures.

## 📚 Documentation

- **📖 Complete Documentation**: `docs/README_COMPLETE.md`
- **🏗️ Architecture Overview**: `docs/IMPLEMENTATION_SUMMARY.md`
- **🚀 Deployment Guide**: `docs/DEPLOYMENT_GUIDE.md`
- **🧪 Testing Guide**: `docs/QA_TESTING_GUIDE.md`
- **📁 File Structure**: `docs/FILE_STRUCTURE_GUIDE.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure everything works
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Check the documentation in `docs/`
- Review `START_HERE.js` for quick setup
- Use `test_connection.js` for troubleshooting

---

**🎓 Built for Campus Communities** - Making online shopping easier for students, faculty, and staff.</content>
<parameter name="filePath">d:\Downloads\unikart\README.md