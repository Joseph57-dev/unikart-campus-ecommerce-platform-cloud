# Unikart Campus Online Store

A comprehensive React-based e-commerce platform designed for university campuses, featuring role-based dashboards for students, vendors, deans, and administrators.

## Features

### 🛒 Customer Features (Students)
- Browse products by category (Food, Fashion, Electronics, etc.)
- Add items to cart and manage quantities
- Secure checkout with order confirmation
- Order history and tracking
- Responsive mobile-friendly interface

### 🏪 Vendor Features
- Product inventory management
- Stock level updates
- Order fulfillment tracking
- Sales analytics and reporting
- Real-time order notifications

### 📊 Dean Dashboard
- Campus-wide sales performance reports
- Student shopping trend analysis
- Category-wise revenue breakdown
- Top-performing products insights
- Student engagement metrics

### ⚙️ Admin Features
- System health monitoring
- User account management
- Security alerts and incident response
- Help desk ticket management
- Platform-wide analytics

## Technology Stack

- **Frontend**: React 18 with React Router
- **Styling**: Custom CSS with responsive design
- **Build Tool**: Vite
- **Currency**: Ugandan Shillings (UGX)
- **Images**: Local assets from project images folder

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd d:\Downloads\unikart\frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit: `http://localhost:5174`

### Demo Accounts

Use these credentials to explore different user roles:

#### Student Account
- **Email**: student@campus.edu
- **Password**: student123
- **Access**: Shopping, cart, checkout, order history

#### Vendor Account
- **Email**: vendor@campus.edu
- **Password**: vendor123
- **Access**: Product management, stock updates, order fulfillment

#### Dean Account
- **Email**: dean@campus.edu
- **Password**: dean123
- **Access**: Performance reports, analytics, student insights

#### Admin Account
- **Email**: admin@campus.edu
- **Password**: admin123
- **Access**: System monitoring, user management, security, help desk

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── data/
│   │   └── products.js      # Product catalog data
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── Shop.jsx         # Product catalog
│   │   ├── Cart.jsx         # Shopping cart
│   │   ├── Checkout.jsx     # Order checkout
│   │   ├── Login.jsx        # User authentication
│   │   ├── StudentDashboard.jsx    # Student dashboard
│   │   ├── VendorDashboard.jsx     # Vendor dashboard
│   │   ├── DeanDashboard.jsx       # Dean dashboard
│   │   └── AdminDashboard.jsx      # Admin dashboard
│   ├── App.jsx             # Main application component
│   ├── App.css             # Application styles
│   └── main.jsx            # Application entry point
├── public/
│   └── project images/     # Product images
└── package.json
```

## Key Features Implemented

### Authentication System
- Role-based login system
- Session persistence with localStorage
- Automatic dashboard routing based on user type

### Product Management
- Categorized product listings
- Local image assets integration
- Real UGX pricing for Ugandan market
- Food items added for campus cafeteria needs

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements

### Dashboard Customization
- **Students**: Order tracking, quick shopping access
- **Vendors**: Inventory control, fulfillment management
- **Deans**: Performance analytics, student welfare insights
- **Admins**: System monitoring, security management

## Currency & Pricing

All prices are in Ugandan Shillings (UGX) with realistic pricing:
- Food items: 15,000 - 45,000 UGX
- Fashion: 35,000 - 285,000 UGX
- Electronics: 185,000 - 1,250,000 UGX
- Accessories: 19,000 - 95,000 UGX

## Future Enhancements

- Integration with existing PHP backend API
- Real-time notifications
- Payment gateway integration
- Advanced analytics and reporting
- Mobile app development
- Multi-language support

## Contributing

This is a demonstration project for campus e-commerce solutions. For production deployment, consider:

- Backend API integration
- Database connectivity
- Payment processing
- User authentication security
- Image optimization
- Performance monitoring

---

Built for modern campus shopping experiences with React and responsive design.