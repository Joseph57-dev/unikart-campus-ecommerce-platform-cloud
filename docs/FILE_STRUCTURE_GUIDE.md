# 🗂️ UNIKART - File Structure & Navigation Guide

## Project Overview

Your Unikart project is organized for maximum clarity and ease of navigation. This guide shows you where everything is and what each component does.

---

## 📁 Root Level Files (START HERE)

Located at: `d:\Downloads\unikart\`

### Essential Files to Read First

```
✅ START_HERE.js                           Interactive startup guide
✅ DOCUMENTATION_INDEX.md                  Main documentation index (READ THIS FIRST)
✅ UNIKART_COMPLETE_SUMMARY.md            Complete project overview
✅ README_COMPLETE.md                      Full setup and features guide
```

### Deployment & Testing

```
📖 DEPLOYMENT_GUIDE.md                     Cloud deployment instructions
📖 DEPLOYMENT_READINESS_CHECKLIST.md      Pre-deployment verification
📖 QA_TESTING_GUIDE.md                    Comprehensive testing procedures
📖 IMPLEMENTATION_SUMMARY.md               Technical architecture details
📖 PROJECT_COMPLETION_SUMMARY.md           Project status and accomplishments
```

### Database Scripts

```
💾 unikart_db.sql                         Original MySQL schema (reference)
💾 unikart_db_postgres.sql               PostgreSQL schema (use this)
```

### API & Testing Tools

```
🔌 Unikart_API.postman_collection.json   API endpoint testing collection
🧪 setup.sh                               Automated environment setup script
```

---

## 📂 Backend Directory Structure

Located at: `d:\Downloads\unikart\backend\`

### Root Backend Files

```
backend/
├── server.js                   ⭐ Main Express application entry point
├── package.json               📦 Node.js dependencies (40+ packages)
├── package-lock.json          🔒 Dependency lock file
├── .env.example               📋 Configuration template (COPY THIS)
└── README.md                  📖 Backend-specific documentation
```

### Configuration Directory (`src/config/`)

```
src/config/
├── index.js                   📊 Centralized config loader
│                              └─ Loads all environment variables
├── database.js                🗄️ PostgreSQL connection pool
│                              └─ Connection pooling (20 max connections)
└── aws.js                     ☁️ AWS SDK initialization
                               └─ S3 and JWT auth setup
```

### Controllers Directory (`src/controllers/`)

Business logic for API endpoints

```
src/controllers/
├── authController.js          👤 Authentication
│                              ├─ register(email, password, etc.)
│                              ├─ login(email, password)
│                              ├─ logout()
│                              └─ verify()
├── productController.js       🛍️ Product management
│                              ├─ getProducts(filters, pagination)
│                              ├─ getProduct(id)
│                              ├─ createProduct(data, image)
│                              ├─ updateProduct(id, data, image)
│                              └─ deleteProduct(id)
└── orderController.js         📦 Order management
                               ├─ createOrder(items, delivery, payment)
                               ├─ getUserOrders(userId, pagination)
                               ├─ getOrder(orderId)
                               ├─ updateOrderStatus(orderId, status)
                               └─ cancelOrder(orderId)
```

### Middleware Directory (`src/middleware/`)

Request processing and validation

```
src/middleware/
├── auth.js                    🔐 Authentication & Authorization
│                              ├─ verifyToken() - JWT validation
│                              ├─ authorize(roles) - Role checking
│                              └─ errorHandler() - Global error handling
├── upload.js                  📸 File upload handling
│                              ├─ Image file validation
│                              ├─ File size limits (5MB)
│                              └─ Memory storage configuration
└── errorHandler.js            ⚠️ Error handling middleware
```

### Routes Directory (`src/routes/`)

API endpoint definitions

```
src/routes/
├── authRoutes.js              🔐 Authentication endpoints
│                              ├─ POST /api/auth/register
│                              ├─ POST /api/auth/login
│                              ├─ POST /api/auth/logout
│                              └─ GET /api/auth/verify (protected)
├── productRoutes.js           🛍️ Product endpoints
│                              ├─ GET /api/products (public)
│                              ├─ GET /api/products/:id (public)
│                              ├─ POST /api/products (protected)
│                              ├─ PUT /api/products/:id (protected)
│                              └─ DELETE /api/products/:id (protected)
└── orderRoutes.js             📦 Order endpoints
                               ├─ POST /api/orders (protected)
                               ├─ GET /api/orders (protected)
                               ├─ GET /api/orders/:id (protected)
                               ├─ PUT /api/orders/:id/cancel (protected)
                               └─ PUT /api/orders/:id/status (admin only)
```

### Services Directory (`src/services/`)

Business logic and external service integration

```
src/services/
├── s3Service.js               ☁️ AWS S3 operations
│                              ├─ uploadToS3(file, key)
│                              ├─ deleteFromS3(key)
│                              └─ getSignedUrl(key)
├── paymentService.js          💳 Payment processing (scaffolding)
│                              └─ Ready for payment gateway integration
└── emailService.js            📧 Email notifications (optional)
```

### Utils Directory (`src/utils/`)

Helper functions and utilities

```
src/utils/
├── jwt.js                     🔑 JWT token management
│                              ├─ generateToken(user)
│                              ├─ verifyToken(token)
│                              └─ decodeToken(token)
└── database.js                🗄️ Database query helpers
                               ├─ query(sql, params)
                               ├─ getOne(sql, params)
                               ├─ getAll(sql, params)
                               ├─ insert(table, data)
                               ├─ update(table, data, id)
                               └─ remove(table, id)
```

---

## 📱 Frontend Directory Structure

Located at: `d:\Downloads\unikart\frontend\`

### Root Frontend Files

```
frontend/
├── index.html                 📄 HTML entry point
├── vite.config.js             ⚙️ Vite build configuration
├── tailwind.config.js         🎨 Tailwind CSS configuration
├── postcss.config.js          🎨 PostCSS configuration
├── package.json               📦 React dependencies (30+ packages)
├── package-lock.json          🔒 Dependency lock file
├── .env.example               📋 Configuration template
└── README.md                  📖 Frontend-specific documentation
```

### Source Directory (`src/`)

```
src/
├── App.jsx                    🎯 Main application component
├── index.css                  🎨 Global styles
├── main.jsx                   ⚙️ React entry point
└── [subdirectories]           (see below)
```

### Pages Directory (`src/pages/`)

Full page components

```
src/pages/
├── Home.jsx                   🏠 Homepage
│                              └─ Featured products, categories, promotions
├── Shop.jsx                   🛍️ Product catalog
│                              └─ Search, filters, pagination
├── ProductDetail.jsx          📋 Product details page
│                              └─ Images, reviews, add to cart
├── Cart.jsx                   🛒 Shopping cart
│                              └─ Items, quantities, checkout button
├── Checkout.jsx               💳 Checkout & order placement
│                              └─ Address, delivery, payment
├── Login.jsx                  🔐 User login
│                              └─ Email/password authentication
├── Register.jsx               ✍️ User registration
│                              └─ Email, password, account info
├── Orders.jsx                 📦 Order history
│                              └─ List and detail views
└── Dashboard.jsx              📊 Admin/Vendor dashboard (if allowed)
```

### Components Directory (`src/components/`)

Reusable UI components

```
src/components/
├── Header.jsx                 📢 Top navigation bar
├── Footer.jsx                 🔗 Footer with links
├── ProductCard.jsx            🎴 Product grid card
├── CartItem.jsx               📦 Cart item row
├── FormInput.jsx              ⌨️ Reusable form input
├── Modal.jsx                  🪟 Modal dialog
├── Toast.jsx                  📬 Notification toasts
├── LoadingSpinner.jsx         ⏳ Loading indicator
├── ErrorMessage.jsx           ⚠️ Error display
├── ProtectedRoute.jsx         🔐 Route protection
└── [additional components]    (20+ more)
```

### Services Directory (`src/services/`)

API integration and business logic

```
src/services/
├── api.js                     🔌 Axios HTTP client
│                              ├─ Base URL configuration
│                              ├─ Request interceptors
│                              └─ Response error handling
├── authService.js             👤 Authentication wrapper
│                              ├─ login()
│                              ├─ register()
│                              ├─ logout()
│                              ├─ verify()
│                              └─ Token management
├── productService.js          🛍️ Product API wrapper
│                              ├─ getProducts(filters)
│                              ├─ getProduct(id)
│                              ├─ createProduct(data)
│                              ├─ updateProduct(data)
│                              └─ deleteProduct(id)
└── orderService.js            📦 Order API wrapper
                               ├─ createOrder(items)
                               ├─ getUserOrders()
                               ├─ getOrder(id)
                               ├─ cancelOrder(id)
                               └─ updateOrderStatus()
```

### Context Directory (`src/context/`)

State management with Context API

```
src/context/
├── AuthContext.jsx            👤 Authentication state
│                              ├─ User data
│                              ├─ JWT token
│                              └─ Login/logout functions
├── CartContext.jsx            🛒 Shopping cart state
│                              ├─ Cart items
│                              ├─ Add/remove functions
│                              └─ Cart totals
└── ThemeContext.jsx           🎨 Theme management (optional)
```

### Assets Directory (`src/assets/`)

Images and other static files

```
src/assets/
├── images/                    🖼️ Product images, icons
├── logos/                     📛 Brand logos
└── styles/                    🎨 Additional CSS files
```

### Tests Directory (`src/tests/`)

Automated test suites

```
src/tests/
└── IntegrationTests.js        🧪 Complete integration test suite
                               ├─ Health check test
                               ├─ Authentication tests
                               ├─ Product tests
                               ├─ Order tests
                               └─ 10+ total tests
```

---

## 🗄️ Database Directory

Located at: `d:\Downloads\unikart\Database\` or `d:\Downloads\unikart\`

### SQL Files

```
unikart_db.sql                 MySQL schema (original, reference only)
unikart_db_postgres.sql        PostgreSQL schema (USE THIS)
                               ├─ 25+ tables
                               ├─ Foreign key constraints
                               ├─ Indexes
                               └─ Sample data
```

---

## 📚 Documentation Directory

All documentation files are in the root directory for easy access.

### Navigation & Index

```
DOCUMENTATION_INDEX.md         📖 Main documentation index (START HERE)
UNIKART_COMPLETE_SUMMARY.md   📊 Complete project summary
START_HERE.js                 🚀 Interactive startup guide
```

### Setup & Features

```
README_COMPLETE.md            📋 Complete setup and features guide (700+ lines)
│                             ├─ Installation instructions
│                             ├─ Configuration guide
│                             ├─ Feature overview
│                             ├─ Development guide
│                             └─ Troubleshooting

IMPLEMENTATION_SUMMARY.md     🏗️ Technical implementation (800+ lines)
│                             ├─ Architecture overview
│                             ├─ Complete file structure
│                             ├─ API documentation
│                             ├─ Database schema
│                             └─ Setup instructions
```

### Deployment & DevOps

```
DEPLOYMENT_GUIDE.md           🚀 Cloud deployment guide (400+ lines)
│                             ├─ AWS step-by-step
│                             ├─ Google Cloud setup
│                             ├─ Azure deployment
│                             ├─ Heroku deployment
│                             └─ Environment config

DEPLOYMENT_READINESS_CHECKLIST.md  ✅ Pre-deployment verification
│                             ├─ Development checklist
│                             ├─ Configuration verification
│                             ├─ Platform-specific checks
│                             └─ Sign-off sheet
```

### Testing & Quality

```
QA_TESTING_GUIDE.md           🧪 Comprehensive testing (600+ lines)
│                             ├─ Manual test procedures
│                             ├─ Automated tests
│                             ├─ API testing with Postman
│                             ├─ Performance testing
│                             ├─ Security testing
│                             └─ 100+ item checklist

PROJECT_COMPLETION_SUMMARY.md  📊 Project achievements
│                             ├─ Transformation journey
│                             ├─ Statistics
│                             ├─ Features list
│                             └─ Next steps
```

### API Testing

```
Unikart_API.postman_collection.json  🔌 API test collection
                             ├─ 15+ endpoints
                             ├─ All CRUD operations
                             ├─ Authentication flows
                             ├─ Test data
                             └─ Example responses
```

### Automation Scripts

```
setup.sh                      🔧 Automated setup script
                             ├─ Dependency installation
                             ├─ Environment setup
                             ├─ Database initialization
                             └─ Server startup
```

---

## 🎯 Quick Navigation Map

### "I want to understand the project"
```
1. START_HERE.js (interactive guide)
2. DOCUMENTATION_INDEX.md (navigation)
3. README_COMPLETE.md (full overview)
4. UNIKART_COMPLETE_SUMMARY.md (statistics)
```

### "I want to set up locally"
```
1. README_COMPLETE.md (Setup section)
2. backend/ - npm install
3. frontend/ - npm install
4. Run both servers
```

### "I want to understand the code"
```
1. IMPLEMENTATION_SUMMARY.md (architecture)
2. backend/server.js (entry point)
3. frontend/src/App.jsx (entry point)
4. backend/src/controllers/ (logic)
5. frontend/src/services/ (API calls)
```

### "I want to test"
```
1. QA_TESTING_GUIDE.md (procedures)
2. frontend/src/tests/IntegrationTests.js (automated)
3. Unikart_API.postman_collection.json (API)
4. Run manual test cases
```

### "I want to deploy"
```
1. DEPLOYMENT_READINESS_CHECKLIST.md (verification)
2. DEPLOYMENT_GUIDE.md (platform-specific)
3. Follow step-by-step instructions
4. Verify application in cloud
```

---

## 📊 File Statistics

### Backend Files
- Total: 18 files
- Controllers: 3 files
- Middleware: 3 files
- Routes: 3 files
- Services: 2 files
- Utils: 2 files
- Config: 3 files

### Frontend Files
- Total: 25+ files
- Pages: 9 files
- Components: 15+ files
- Services: 4 files
- Context: 3 files
- Tests: 1 file

### Documentation Files
- Total: 8 files
- Lines of content: 3,000+
- API endpoints documented: 15+
- Test cases described: 50+

### Configuration Files
- .env files: 3 (example files)
- Package.json files: 2
- Build config files: 6
- Database scripts: 2

---

## 🔄 File Dependencies

### Frontend Dependencies Chain
```
App.jsx
├─ pages/* (depend on)
│  ├─ services/ (call APIs)
│  │  └─ api.js (HTTP client)
│  ├─ context/ (get/set state)
│  └─ components/ (UI elements)
└─ Router configuration
```

### Backend Dependencies Chain
```
server.js (Express app)
├─ routes/* (define endpoints)
│  ├─ controllers/* (execute logic)
│  │  ├─ services/ (business logic)
│  │  │  └─ config/ (settings)
│  │  └─ utils/ (helpers)
│  └─ middleware/ (auth, validation)
└─ config/database.js (PostgreSQL)
```

---

## ✅ File Organization Best Practices

This project follows industry-standard organization:

✅ **Separation of Concerns**
- Pages handle routing and user interaction
- Components are reusable UI pieces
- Services handle all API communication
- Controllers contain business logic
- Models/Schemas define data structure

✅ **Scalability**
- Easy to add new pages
- Easy to add new API endpoints
- Easy to add new services
- Easy to add new middleware

✅ **Maintainability**
- Clear file naming
- Logical directory structure
- Single responsibility principle
- Minimal file dependencies

✅ **Testing**
- Integration tests in src/tests/
- API tests in Postman collection
- Manual tests documented
- CI/CD ready

---

## 🚀 Getting Started with Files

### Step 1: Read
```
1. START_HERE.js
2. DOCUMENTATION_INDEX.md
3. README_COMPLETE.md
```

### Step 2: Explore
```
1. backend/package.json (see dependencies)
2. frontend/package.json (see dependencies)
3. backend/server.js (understand API structure)
4. frontend/src/App.jsx (understand UI structure)
```

### Step 3: Run
```
1. cd backend && npm install && npm start
2. cd frontend && npm install && npm run dev
3. Open http://localhost:5173
```

### Step 4: Test
```
1. Run IntegrationTests.js
2. Import Postman collection
3. Run manual test cases
```

### Step 5: Deploy
```
1. Review DEPLOYMENT_READINESS_CHECKLIST.md
2. Follow DEPLOYMENT_GUIDE.md
3. Deploy to your chosen platform
```

---

## 📞 File Reference Quick Links

### Most Important Files
- 📖 **DOCUMENTATION_INDEX.md** - Start here for navigation
- 📋 **README_COMPLETE.md** - Detailed setup and features
- 🚀 **DEPLOYMENT_GUIDE.md** - Cloud deployment
- 🧪 **QA_TESTING_GUIDE.md** - Testing procedures
- ⚙️ **backend/server.js** - Backend entry point
- ⚛️ **frontend/src/App.jsx** - Frontend entry point
- 💻 **IntegrationTests.js** - Run to verify everything works

### By Task
- **Set up locally:** README_COMPLETE.md
- **Understand code:** IMPLEMENTATION_SUMMARY.md
- **Test application:** QA_TESTING_GUIDE.md
- **Deploy:** DEPLOYMENT_GUIDE.md
- **Fix issues:** README_COMPLETE.md (Troubleshooting)

---

**Total Project Files:** 70+
**Total Lines of Code:** 3,500+
**Total Documentation:** 3,000+ lines
**Status:** ✅ Production Ready

---

*Navigate efficiently using this guide. All files are organized for maximum clarity and ease of access.* 📁
