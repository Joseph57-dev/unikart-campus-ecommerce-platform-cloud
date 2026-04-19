# UNIKART - Quality Assurance & Testing Guide

## Overview
This guide provides comprehensive testing procedures to verify all components of the Unikart e-commerce application are working correctly before cloud deployment.

---

## Part 1: Pre-Testing Checklist

### Prerequisites
- [ ] Node.js 16+ installed
- [ ] PostgreSQL 12+ running locally (or MySQL 8.0+)
- [ ] Backend server started on port 5000
- [ ] Frontend dev server started on port 5173
- [ ] Postman or Insomnia installed for API testing

### Verify Installation
```bash
# Check Node.js
node --version  # Should be v16 or higher

# Check npm
npm --version   # Should be 7 or higher

# Check PostgreSQL (if using)
psql --version  # Should be 12 or higher

# Check Backend
curl http://localhost:5000/health
# Expected: {"status":"success","message":"Server is running"}

# Check Frontend
curl http://localhost:5173
# Expected: HTML response
```

---

## Part 2: Manual Testing Procedures

### 2.1 Authentication Testing

#### Test 2.1.1: User Registration
**Steps:**
1. Navigate to `http://localhost:5173/register`
2. Fill in registration form:
   - Email: `test@campus.edu`
   - Password: `TestPass123!`
   - Full Name: `Test Student`
   - Account Type: `Student`
   - Faculty: `Computing`
3. Click "Register"

**Expected Result:**
- ✅ User account created
- ✅ Redirected to login page
- ✅ Success message displayed

**Backend Verification:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@campus.edu",
    "password": "TestPass123!",
    "full_name": "Test Student",
    "account_type": "student",
    "faculty": "Computing"
  }'
```

#### Test 2.1.2: User Login
**Steps:**
1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - Email: `test@campus.edu`
   - Password: `TestPass123!`
3. Click "Login"

**Expected Result:**
- ✅ Authentication successful
- ✅ JWT token stored in localStorage
- ✅ Redirected to dashboard
- ✅ User info displayed in header

**Backend Verification:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@campus.edu",
    "password": "TestPass123!"
  }'

# Response should contain:
# {
#   "status": "success",
#   "data": {
#     "token": "eyJhbGc...",
#     "user": {...}
#   }
# }
```

#### Test 2.1.3: Token Verification
**Steps:**
1. Login to the application
2. Refresh the page (`Ctrl+R`)
3. Verify user is still logged in

**Expected Result:**
- ✅ User session persists
- ✅ Token is still valid
- ✅ User menu shows username

#### Test 2.1.4: Logout
**Steps:**
1. Login to the application
2. Click on username dropdown in header
3. Click "Logout"

**Expected Result:**
- ✅ Token removed from localStorage
- ✅ Redirected to home page
- ✅ User menu no longer visible

---

### 2.2 Product Catalog Testing

#### Test 2.2.1: View All Products
**Steps:**
1. Navigate to `http://localhost:5173/shop`
2. Wait for products to load

**Expected Result:**
- ✅ Products displayed in grid layout
- ✅ Each product shows:
  - Product image
  - Product name
  - Category
  - Price in UGX
  - Rating (if available)
  - "Add to Cart" button
- ✅ Loading spinner shown while fetching

**Backend Verification:**
```bash
curl http://localhost:5000/api/products?page=1&limit=12
```

#### Test 2.2.2: Search Products
**Steps:**
1. On the shop page, enter search term in search box
2. Type: `phone`
3. Wait for results to update

**Expected Result:**
- ✅ Results filtered in real-time
- ✅ Only products matching search shown
- ✅ No page refresh needed (debounced search)

**Backend Verification:**
```bash
curl "http://localhost:5000/api/products?search=phone&page=1&limit=12"
```

#### Test 2.2.3: Filter by Category
**Steps:**
1. On the shop page, find category filter
2. Select: `Electronics`

**Expected Result:**
- ✅ Products filtered by category
- ✅ Filter updates results immediately
- ✅ Can combine with search

#### Test 2.2.4: Filter by Price Range
**Steps:**
1. On the shop page, use price slider
2. Set range: `50,000 - 500,000 UGX`

**Expected Result:**
- ✅ Only products in price range shown
- ✅ Min/max values displayed
- ✅ Can combine with other filters

#### Test 2.2.5: Sort Products
**Steps:**
1. On the shop page, find sort dropdown
2. Select: `Price: Low to High`

**Expected Result:**
- ✅ Products reordered by price
- ✅ Sorting options work:
  - Price: Low to High
  - Price: High to Low
  - Name: A to Z
  - Newest First

#### Test 2.2.6: Product Details
**Steps:**
1. Click on any product image or name
2. Navigate to product detail page

**Expected Result:**
- ✅ Large product image displayed
- ✅ Product information shown:
  - Full name
  - Category
  - Price
  - Stock status
  - Description
  - Rating & reviews
- ✅ Quantity selector available
- ✅ "Add to Cart" button prominent

---

### 2.3 Shopping Cart Testing

#### Test 2.3.1: Add to Cart
**Steps:**
1. On shop page, click "Add to Cart" on any product
2. Verify cart icon in header updates

**Expected Result:**
- ✅ Product added to cart
- ✅ Cart count incremented in header
- ✅ Success notification displayed
- ✅ Cart data persisted in localStorage

#### Test 2.3.2: View Cart
**Steps:**
1. Click cart icon in header
2. View cart contents

**Expected Result:**
- ✅ All added items displayed
- ✅ Each item shows:
  - Product image
  - Product name
  - Price
  - Quantity selector
  - Remove button
  - Subtotal
- ✅ Cart total calculated correctly
- ✅ Proceed to Checkout button available

#### Test 2.3.3: Update Quantity
**Steps:**
1. Open cart
2. Change quantity of an item
3. Verify cart total updates

**Expected Result:**
- ✅ Quantity changed
- ✅ Subtotal recalculated
- ✅ Cart total updated
- ✅ Changes persisted in localStorage

#### Test 2.3.4: Remove from Cart
**Steps:**
1. Open cart
2. Click remove button on an item

**Expected Result:**
- ✅ Item removed from cart
- ✅ Cart total updated
- ✅ Changes persisted in localStorage
- ✅ Success notification shown

---

### 2.4 Checkout & Order Testing

#### Test 2.4.1: Proceed to Checkout
**Steps:**
1. Add products to cart
2. Click "Proceed to Checkout"

**Expected Result:**
- ✅ Redirected to checkout page
- ✅ Login required if not authenticated
- ✅ Order summary displayed
- ✅ Checkout form visible

#### Test 2.4.2: Fill Delivery Information
**Steps:**
1. On checkout page, fill form:
   - Delivery Method: `Delivery` or `Pickup`
   - Delivery Address: `123 Campus Street`
   - Delivery Date: Tomorrow's date
   - Special Instructions: (optional)

**Expected Result:**
- ✅ Form accepts valid input
- ✅ Address validation works
- ✅ Date picker functional
- ✅ No errors on valid input

#### Test 2.4.3: Select Payment Method
**Steps:**
1. Select payment method:
   - Mobile Money (MTN, Airtel, Africell)
   - Bank Transfer
   - Card Payment (if integrated)
2. Enter payment details

**Expected Result:**
- ✅ All payment methods available
- ✅ Provider selector appears for mobile money
- ✅ Phone number validation works
- ✅ Payment info collected

#### Test 2.4.4: Place Order
**Steps:**
1. Complete all checkout fields
2. Click "Place Order"

**Expected Result:**
- ✅ Order created in database
- ✅ Inventory updated (stock decremented)
- ✅ Order confirmation page displayed
- ✅ Order ID shown
- ✅ Email confirmation sent (if email configured)

**Backend Verification:**
```bash
# Check order was created
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

#### Test 2.4.5: View Order History
**Steps:**
1. Login to account
2. Navigate to my orders/account page
3. View order list

**Expected Result:**
- ✅ All user orders displayed
- ✅ Each order shows:
  - Order ID
  - Order date
  - Status
  - Total amount
  - Items count

#### Test 2.4.6: View Order Details
**Steps:**
1. Click on an order in order history
2. View detailed order page

**Expected Result:**
- ✅ Order information displayed:
  - Order ID
  - Order date
  - Status timeline
  - Delivery information
  - Items with prices
  - Customer information

---

### 2.5 Responsive Design Testing

#### Test 2.5.1: Mobile Responsiveness (375px width)
**Steps:**
1. Open browser DevTools (`F12`)
2. Toggle device toolbar
3. Select iPhone SE (375px width)
4. Test each page:
   - Home page
   - Shop page
   - Product detail
   - Cart
   - Checkout

**Expected Result:**
- ✅ All content readable on small screen
- ✅ Touch-friendly button sizes (44px minimum)
- ✅ Navigation hamburger menu works
- ✅ Forms stack vertically
- ✅ No horizontal scrolling
- ✅ Images scale properly

#### Test 2.5.2: Tablet Responsiveness (768px width)
**Steps:**
1. Toggle device toolbar
2. Select iPad (768px width)
3. Test all pages

**Expected Result:**
- ✅ Optimal layout for tablet
- ✅ Two-column layouts work
- ✅ Product grid shows 2-3 items
- ✅ Touch-friendly navigation

#### Test 2.5.3: Desktop Responsiveness (1920px width)
**Steps:**
1. Toggle device toolbar
2. Select desktop (1920px width)
3. Test all pages

**Expected Result:**
- ✅ Full-featured layout
- ✅ Product grid shows 4+ items
- ✅ All UI elements visible
- ✅ No excessive whitespace

#### Test 2.5.4: Browser Compatibility
**Browsers to Test:**
- [ ] Chrome (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Edge (Latest)

**Expected Result:**
- ✅ Application works in all browsers
- ✅ No console errors
- ✅ Styling consistent
- ✅ All features functional

---

### 2.6 Error Handling Testing

#### Test 2.6.1: Invalid Login
**Steps:**
1. Navigate to login page
2. Enter invalid credentials:
   - Email: `invalid@test.com`
   - Password: `wrongpassword`
3. Click login

**Expected Result:**
- ✅ Error message displayed
- ✅ User not logged in
- ✅ Stays on login page
- ✅ Error is user-friendly

#### Test 2.6.2: Out of Stock Products
**Steps:**
1. Find product with 0 stock
2. Try to add to cart

**Expected Result:**
- ✅ "Out of Stock" indicator shown
- ✅ Can't add to cart
- ✅ "Notify When Available" option (if implemented)

#### Test 2.6.3: Network Error Handling
**Steps:**
1. Open DevTools Network tab
2. Throttle network to offline
3. Try to perform action (load products, login, etc.)
4. Monitor error handling

**Expected Result:**
- ✅ User-friendly error message shown
- ✅ Retry option available
- ✅ No cryptic error codes
- ✅ Application doesn't crash

#### Test 2.6.4: Invalid Form Input
**Steps:**
1. On registration page, try invalid inputs:
   - Email: `notanemail` (invalid format)
   - Password: `123` (too short)
   - Password mismatch

**Expected Result:**
- ✅ Validation errors shown
- ✅ Form doesn't submit
- ✅ Clear error messages
- ✅ Helpful suggestions provided

---

## Part 3: Automated Testing

### 3.1 Integration Tests

**Location:** `frontend/src/tests/IntegrationTests.js`

**Run Integration Tests:**
```bash
# From frontend directory
cd frontend

# Run all integration tests
npm test -- IntegrationTests.js

# Or using Node directly
node src/tests/IntegrationTests.js
```

**Tests Included:**
- [ ] Health check (backend running)
- [ ] User registration
- [ ] User login
- [ ] Get products
- [ ] Get product details
- [ ] Token verification
- [ ] Create order
- [ ] Get user orders
- [ ] Responsive design (manual)
- [ ] Error handling

**Expected Output:**
```
✅ All tests passed
Success Rate: 90-100%
Ready for Cloud Deployment
```

### 3.2 API Testing with Postman

**Collection:** `Unikart_API.postman_collection.json`

**Import into Postman:**
1. Open Postman
2. Click "Import"
3. Select the collection file
4. Import all endpoints

**Run Collection:**
1. Select the collection
2. Click "Run"
3. Collection runner will test all endpoints
4. Review results

**Expected Results:**
- [ ] All 15 endpoints respond successfully
- [ ] Status codes are correct (200, 201, 400, 401, etc.)
- [ ] Response bodies match expected format
- [ ] Authentication flows work

---

## Part 4: Performance Testing

### 4.1 Load Testing

**Tool:** Apache JMeter or Locust

**Test Scenarios:**
1. Homepage load time: < 2 seconds
2. Product search: < 1 second
3. Login: < 2 seconds
4. Checkout: < 3 seconds
5. Concurrent users: 100+ without errors

```bash
# Example with curl (simple load test)
for i in {1..100}; do
  curl http://localhost:5173 &
done
wait
```

### 4.2 Database Performance

**Check slow queries:**
```bash
# PostgreSQL
psql -U username -d unikart_db -c "SELECT * FROM pg_stat_statements WHERE mean_exec_time > 100;"

# MySQL
mysql -u username -p unikart_db -e "SELECT * FROM mysql.general_log WHERE query_time > 0.1;"
```

### 4.3 API Response Times

**Test endpoint performance:**
```bash
# Time a simple product request
time curl http://localhost:5000/api/products?page=1&limit=12

# Should complete in < 500ms
```

---

## Part 5: Security Testing

### 5.1 Authentication Security

- [ ] JWT tokens expire properly
- [ ] Expired tokens rejected
- [ ] Invalid tokens rejected
- [ ] Password hashing verified (bcrypt used)
- [ ] Sensitive data not exposed in responses

### 5.2 Authorization Testing

- [ ] Regular users can't access admin endpoints
- [ ] Users can only see their own data
- [ ] Role-based access control works
- [ ] Vendor accounts separate from user accounts

```bash
# Test with invalid token
curl -H "Authorization: Bearer invalid_token" \
  http://localhost:5000/api/orders

# Should return 401 Unauthorized
```

### 5.3 Input Validation

- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevention (hashed/escaped output)
- [ ] File upload validation (image types only)
- [ ] Request size limits enforced

### 5.4 CORS Configuration

```bash
# Test CORS headers
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:5000/api/products

# Should return appropriate CORS headers
```

---

## Part 6: Testing Checklist

### Core Features
- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Password reset works (if implemented)
- [ ] Profile management works (if implemented)

### Product Management
- [ ] View all products
- [ ] Search products
- [ ] Filter by category
- [ ] Filter by price
- [ ] Sort results
- [ ] View product details
- [ ] View reviews/ratings

### Shopping Cart
- [ ] Add products to cart
- [ ] View cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Cart persists across sessions
- [ ] Cart total calculated correctly

### Ordering
- [ ] Order creation works
- [ ] Order validation works
- [ ] Inventory updated after order
- [ ] Order confirmation received
- [ ] Order history accessible
- [ ] Order status tracking works

### UI/UX
- [ ] Mobile responsive (375px)
- [ ] Tablet responsive (768px)
- [ ] Desktop responsive (1920px)
- [ ] Navigation intuitive
- [ ] Error messages clear
- [ ] Success messages shown
- [ ] Loading states display
- [ ] No broken images
- [ ] No console errors

### Performance
- [ ] Homepage loads < 2 seconds
- [ ] Product search < 1 second
- [ ] Login < 2 seconds
- [ ] API responses < 500ms
- [ ] Images optimized
- [ ] No memory leaks

### Security
- [ ] JWT tokens secure
- [ ] Passwords hashed
- [ ] CORS configured
- [ ] Input validated
- [ ] SQL injection prevented
- [ ] XSS prevented
- [ ] HTTPS ready (for production)

---

## Part 7: Pre-Deployment Testing

### Before Cloud Deployment:
1. **Database Backup:**
   ```bash
   pg_dump -U username unikart_db > backup.sql
   ```

2. **Environment Variables:**
   - [ ] .env file configured with all values
   - [ ] Database credentials correct
   - [ ] AWS credentials set
   - [ ] JWT secret changed from default
   - [ ] API URLs pointing to production

3. **Build Optimization:**
   ```bash
   # Frontend
   cd frontend
   npm run build
   # Check bundle size
   ```

4. **Configuration Verification:**
   - [ ] CORS allows production domain
   - [ ] API endpoints correct
   - [ ] Database connection pooling configured
   - [ ] Error logging configured
   - [ ] Session timeout appropriate

5. **Final Integration Test:**
   ```bash
   npm test -- IntegrationTests.js
   # All tests must pass
   ```

---

## Part 8: Issue Reporting Template

**If a test fails, use this template:**

```
Test Name: [Name of failed test]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Error Message:
[Any error messages or console logs]

Environment:
- Browser: [Chrome/Firefox/Safari/Edge]
- OS: [Windows/Mac/Linux]
- Screen Size: [Mobile/Tablet/Desktop]

Severity:
- [ ] Critical (app doesn't work)
- [ ] High (major feature broken)
- [ ] Medium (workaround exists)
- [ ] Low (minor issue)
```

---

## Summary

This comprehensive testing guide ensures:
- ✅ All features work as intended
- ✅ UI/UX is responsive and intuitive
- ✅ Performance meets standards
- ✅ Security measures are in place
- ✅ Application ready for cloud deployment

**Total Estimated Testing Time:** 4-6 hours

**When to Deploy:**
- All manual tests pass ✅
- All integration tests pass ✅
- No critical or high-severity issues
- Performance metrics acceptable
- Security checklist complete

---

## Contact & Support

For questions or issues:
1. Check IMPLEMENTATION_SUMMARY.md
2. Review DEPLOYMENT_GUIDE.md
3. Check logs in backend/logs/
4. Run IntegrationTests.js for diagnostics
