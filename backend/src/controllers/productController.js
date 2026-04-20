const db = require('../utils/database');
const { uploadtoS3, deleteFromS3 } = require('../services/s3Service');

// Mock data for testing when database is not available
const mockProducts = [
  // Laptops
  {
    product_id: 1,
    sku: 'LAPTOP001',
    name: 'Gaming Laptop Pro',
    description: 'High-performance gaming laptop with Intel i7, RTX 4070, 16GB RAM, 512GB SSD',
    short_description: 'Powerful gaming laptop',
    price: 1299.99,
    compare_price: 1499.99,
    currency: 'USD',
    stock_quantity: 10,
    stock_status: 'in_stock',
    image_url: '/images/laptops/laptop1.jpg',
    rating: 4.5,
    review_count: 25,
    is_featured: true,
    is_hot_deal: false,
    view_count: 150,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    category_id: 1,
    category_name: 'Laptops',
    supplier_id: 1,
    supplier_name: 'TechCorp'
  },
  {
    product_id: 2,
    sku: 'LAPTOP002',
    name: 'Business Laptop Elite',
    description: 'Professional laptop for business use with Intel i5, 8GB RAM, 256GB SSD',
    short_description: 'Professional business laptop',
    price: 799.99,
    compare_price: 899.99,
    currency: 'USD',
    stock_quantity: 20,
    stock_status: 'in_stock',
    image_url: '/images/laptops/laptop2.jpg',
    rating: 4.3,
    review_count: 18,
    is_featured: false,
    is_hot_deal: false,
    view_count: 120,
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
    category_id: 1,
    category_name: 'Laptops',
    supplier_id: 1,
    supplier_name: 'TechCorp'
  },
  {
    product_id: 3,
    sku: 'LAPTOP003',
    name: 'Student Laptop Basic',
    description: 'Affordable laptop perfect for students with AMD Ryzen 5, 8GB RAM, 512GB SSD',
    short_description: 'Budget-friendly student laptop',
    price: 549.99,
    compare_price: 649.99,
    currency: 'USD',
    stock_quantity: 25,
    stock_status: 'in_stock',
    image_url: '/images/laptops/laptop3.jpg',
    rating: 4.1,
    review_count: 32,
    is_featured: false,
    is_hot_deal: true,
    view_count: 180,
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z',
    category_id: 1,
    category_name: 'Laptops',
    supplier_id: 2,
    supplier_name: 'EduTech'
  },

  // Smartphones
  {
    product_id: 4,
    sku: 'PHONE001',
    name: 'Smartphone Ultra',
    description: 'Latest smartphone with advanced camera features, 128GB storage, 5G connectivity',
    short_description: 'Premium smartphone',
    price: 899.99,
    compare_price: 999.99,
    currency: 'USD',
    stock_quantity: 15,
    stock_status: 'in_stock',
    image_url: '/images/phones/phone1.jpg',
    rating: 4.2,
    review_count: 40,
    is_featured: true,
    is_hot_deal: true,
    view_count: 200,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    category_id: 2,
    category_name: 'Smartphones',
    supplier_id: 2,
    supplier_name: 'MobileTech'
  },
  {
    product_id: 5,
    sku: 'PHONE002',
    name: 'Budget Smartphone Lite',
    description: 'Affordable smartphone with good camera, 64GB storage, reliable performance',
    short_description: 'Value for money smartphone',
    price: 299.99,
    compare_price: 349.99,
    currency: 'USD',
    stock_quantity: 30,
    stock_status: 'in_stock',
    image_url: '/images/phones/phone2.jpg',
    rating: 4.0,
    review_count: 55,
    is_featured: false,
    is_hot_deal: false,
    view_count: 250,
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z',
    category_id: 2,
    category_name: 'Smartphones',
    supplier_id: 2,
    supplier_name: 'MobileTech'
  },
  {
    product_id: 6,
    sku: 'PHONE003',
    name: 'Gaming Smartphone Pro',
    description: 'Smartphone designed for gaming with high refresh rate display and powerful processor',
    short_description: 'Gaming-focused smartphone',
    price: 699.99,
    compare_price: 799.99,
    currency: 'USD',
    stock_quantity: 12,
    stock_status: 'in_stock',
    image_url: '/images/phones/phone3.jpg',
    rating: 4.4,
    review_count: 28,
    is_featured: true,
    is_hot_deal: false,
    view_count: 160,
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
    category_id: 2,
    category_name: 'Smartphones',
    supplier_id: 3,
    supplier_name: 'GameTech'
  },

  // Accessories
  {
    product_id: 7,
    sku: 'HEADSET001',
    name: 'Wireless Gaming Headset',
    description: 'Immersive gaming experience with noise cancellation, 7.1 surround sound',
    short_description: 'Wireless gaming headset',
    price: 149.99,
    compare_price: 199.99,
    currency: 'USD',
    stock_quantity: 25,
    stock_status: 'in_stock',
    image_url: '/images/accessories/headset1.jpg',
    rating: 4.7,
    review_count: 18,
    is_featured: false,
    is_hot_deal: false,
    view_count: 80,
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z',
    category_id: 3,
    category_name: 'Accessories',
    supplier_id: 1,
    supplier_name: 'TechCorp'
  },
  {
    product_id: 8,
    sku: 'MOUSE001',
    name: 'RGB Gaming Mouse',
    description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons',
    short_description: 'RGB gaming mouse',
    price: 79.99,
    compare_price: 99.99,
    currency: 'USD',
    stock_quantity: 35,
    stock_status: 'in_stock',
    image_url: '/images/accessories/mouse1.jpg',
    rating: 4.3,
    review_count: 42,
    is_featured: false,
    is_hot_deal: true,
    view_count: 110,
    created_at: '2024-01-03T10:00:00Z',
    updated_at: '2024-01-03T10:00:00Z',
    category_id: 3,
    category_name: 'Accessories',
    supplier_id: 1,
    supplier_name: 'TechCorp'
  },
  {
    product_id: 9,
    sku: 'KEYBOARD001',
    name: 'Mechanical Gaming Keyboard',
    description: 'Mechanical keyboard with blue switches, RGB backlighting, and anti-ghosting',
    short_description: 'Mechanical gaming keyboard',
    price: 129.99,
    compare_price: 159.99,
    currency: 'USD',
    stock_quantity: 18,
    stock_status: 'in_stock',
    image_url: '/images/accessories/keyboard1.jpg',
    rating: 4.6,
    review_count: 35,
    is_featured: true,
    is_hot_deal: false,
    view_count: 95,
    created_at: '2024-01-07T10:00:00Z',
    updated_at: '2024-01-07T10:00:00Z',
    category_id: 3,
    category_name: 'Accessories',
    supplier_id: 1,
    supplier_name: 'TechCorp'
  },

  // Fashion
  {
    product_id: 10,
    sku: 'TSHIRT001',
    name: 'Campus Hoodie',
    description: 'Comfortable cotton hoodie perfect for campus life, available in multiple colors',
    short_description: 'Campus style hoodie',
    price: 39.99,
    compare_price: 49.99,
    currency: 'USD',
    stock_quantity: 50,
    stock_status: 'in_stock',
    image_url: '/images/fashion/hoodie1.jpg',
    rating: 4.2,
    review_count: 67,
    is_featured: false,
    is_hot_deal: true,
    view_count: 300,
    created_at: '2024-01-02T10:00:00Z',
    updated_at: '2024-01-02T10:00:00Z',
    category_id: 4,
    category_name: 'Fashion',
    supplier_id: 4,
    supplier_name: 'CampusWear'
  },
  {
    product_id: 11,
    sku: 'JEANS001',
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans with stretch fabric for comfort and style',
    short_description: 'Comfortable slim fit jeans',
    price: 59.99,
    compare_price: 79.99,
    currency: 'USD',
    stock_quantity: 40,
    stock_status: 'in_stock',
    image_url: '/images/fashion/jeans1.jpg',
    rating: 4.1,
    review_count: 45,
    is_featured: false,
    is_hot_deal: false,
    view_count: 180,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
    category_id: 4,
    category_name: 'Fashion',
    supplier_id: 4,
    supplier_name: 'CampusWear'
  },

  // Food & Beverages
  {
    product_id: 12,
    sku: 'COFFEE001',
    name: 'Premium Coffee Beans',
    description: 'Freshly roasted Arabica coffee beans, perfect for study sessions',
    short_description: 'Premium coffee beans',
    price: 24.99,
    compare_price: 29.99,
    currency: 'USD',
    stock_quantity: 60,
    stock_status: 'in_stock',
    image_url: '/images/food/coffee1.jpg',
    rating: 4.5,
    review_count: 89,
    is_featured: true,
    is_hot_deal: false,
    view_count: 400,
    created_at: '2024-01-06T10:00:00Z',
    updated_at: '2024-01-06T10:00:00Z',
    category_id: 5,
    category_name: 'Food',
    supplier_id: 5,
    supplier_name: 'CampusCafe'
  },
  {
    product_id: 13,
    sku: 'SNACK001',
    name: 'Energy Bar Pack',
    description: 'Pack of 12 energy bars perfect for quick snacks during study breaks',
    short_description: 'Healthy energy bars',
    price: 19.99,
    compare_price: 24.99,
    currency: 'USD',
    stock_quantity: 75,
    stock_status: 'in_stock',
    image_url: '/images/food/energybar1.jpg',
    rating: 4.3,
    review_count: 123,
    is_featured: false,
    is_hot_deal: true,
    view_count: 350,
    created_at: '2024-01-04T10:00:00Z',
    updated_at: '2024-01-04T10:00:00Z',
    category_id: 5,
    category_name: 'Food',
    supplier_id: 5,
    supplier_name: 'CampusCafe'
  },

  // Watches
  {
    product_id: 14,
    sku: 'WATCH001',
    name: 'Smart Watch Pro',
    description: 'Feature-rich smartwatch with fitness tracking, notifications, and GPS',
    short_description: 'Advanced smartwatch',
    price: 299.99,
    compare_price: 349.99,
    currency: 'USD',
    stock_quantity: 22,
    stock_status: 'in_stock',
    image_url: '/images/watches/smartwatch1.jpg',
    rating: 4.4,
    review_count: 56,
    is_featured: true,
    is_hot_deal: false,
    view_count: 220,
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-09T10:00:00Z',
    category_id: 6,
    category_name: 'Watches',
    supplier_id: 3,
    supplier_name: 'GameTech'
  },
  {
    product_id: 15,
    sku: 'WATCH002',
    name: 'Classic Analog Watch',
    description: 'Elegant analog watch with leather strap, perfect for formal occasions',
    short_description: 'Classic leather watch',
    price: 149.99,
    compare_price: 199.99,
    currency: 'USD',
    stock_quantity: 15,
    stock_status: 'in_stock',
    image_url: '/images/watches/analog1.jpg',
    rating: 4.6,
    review_count: 34,
    is_featured: false,
    is_hot_deal: false,
    view_count: 140,
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z',
    category_id: 6,
    category_name: 'Watches',
    supplier_id: 6,
    supplier_name: 'TimeStyle'
  }
];

// Get all products
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      min_price,
      max_price,
      sort = 'newest',
      featured
    } = req.query;

    // Try database first, fallback to mock data
    try {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const whereConditions = ['p.is_active = true'];
      const params = [];

      if (search) {
        whereConditions.push(`(p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`);
        params.push(`%${search}%`);
      }

      if (category) {
        whereConditions.push(`c.name = $${params.length + 1}`);
        params.push(category);
      }

      if (min_price) {
        whereConditions.push(`p.price >= $${params.length + 1}`);
        params.push(parseFloat(min_price));
      }

      if (max_price) {
        whereConditions.push(`p.price <= $${params.length + 1}`);
        params.push(parseFloat(max_price));
      }

      if (featured === 'true') {
        whereConditions.push('p.is_featured = true');
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      // Get total count
      const countSql = `SELECT COUNT(*) as total FROM products p LEFT JOIN category c ON p.category_id = c.category_id ${whereClause}`;
      const countResult = await db.getOne(countSql, params);
      const total = parseInt(countResult.total);

      // Get products
      const orderBy = {
        'price_low': 'p.price ASC',
        'price_high': 'p.price DESC',
        'name': 'p.name ASC',
        'rating': 'p.rating DESC',
        'popular': 'p.view_count DESC'
      }[sort] || 'p.created_at DESC';

      const productsSql = `
        SELECT
          p.product_id, p.sku, p.name, p.description, p.short_description,
          p.price, p.compare_price, p.currency, p.stock_quantity, p.stock_status,
          p.image_url, p.rating, p.review_count, p.is_featured, p.is_hot_deal,
          p.view_count, p.created_at, p.updated_at,
          c.category_id, c.name as category_name,
          s.supplier_id, s.supplier_name
        FROM products p
        LEFT JOIN category c ON p.category_id = c.category_id
        LEFT JOIN supplier s ON p.supplier_id = s.supplier_id
        ${whereClause}
        ORDER BY ${orderBy}
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `;

      params.push(parseInt(limit), offset);
      const products = await db.getAll(productsSql, params);

      res.json({
        status: 'success',
        message: 'Products retrieved successfully',
        data: {
          products,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (dbError) {
      // Database not available, use mock data
      console.log('Database not available, using mock data:', dbError.message);

      let filteredProducts = [...mockProducts];

      // Apply filters
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
        );
      }

      if (category) {
        filteredProducts = filteredProducts.filter(product =>
          product.category_name.toLowerCase() === category.toLowerCase()
        );
      }

      if (min_price) {
        filteredProducts = filteredProducts.filter(product =>
          product.price >= parseFloat(min_price)
        );
      }

      if (max_price) {
        filteredProducts = filteredProducts.filter(product =>
          product.price <= parseFloat(max_price)
        );
      }

      if (featured === 'true') {
        filteredProducts = filteredProducts.filter(product => product.is_featured);
      }

      // Apply sorting
      const sortFunctions = {
        'price_low': (a, b) => a.price - b.price,
        'price_high': (a, b) => b.price - a.price,
        'name': (a, b) => a.name.localeCompare(b.name),
        'rating': (a, b) => b.rating - a.rating,
        'newest': (a, b) => new Date(b.created_at) - new Date(a.created_at)
      };

      if (sortFunctions[sort]) {
        filteredProducts.sort(sortFunctions[sort]);
      }

      // Apply pagination
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;
      const paginatedProducts = filteredProducts.slice(offset, offset + limitNum);

      res.json({
        status: 'success',
        message: 'Products retrieved successfully (mock data)',
        data: {
          products: paginatedProducts,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / limitNum)
          }
        }
      });
    }
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get products: ' + error.message,
      data: null
    });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db.getOne(
      `SELECT 
        p.product_id, p.sku, p.name, p.description, p.short_description,
        p.price, p.compare_price, p.currency, p.stock_quantity, p.stock_status,
        p.image_url, p.additional_images, p.rating, p.review_count, 
        p.is_featured, p.is_hot_deal, p.view_count, p.created_at, p.updated_at,
        c.category_id, c.name as category_name,
        s.supplier_id, s.supplier_name
      FROM products p
      LEFT JOIN category c ON p.category_id = c.category_id
      LEFT JOIN supplier s ON p.supplier_id = s.supplier_id
      WHERE p.product_id = $1`,
      [id]
    );

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
        data: null
      });
    }

    // Increment view count
    await db.update(
      'UPDATE products SET view_count = view_count + 1 WHERE product_id = $1',
      [id]
    );

    res.json({
      status: 'success',
      message: 'Product retrieved successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get product: ' + error.message,
      data: null
    });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      description,
      short_description,
      price,
      category_id,
      supplier_id,
      stock_quantity = 0,
      is_featured = false,
      is_hot_deal = false
    } = req.body;

    if (!sku || !name || !price) {
      return res.status(400).json({
        status: 'error',
        message: 'SKU, name, and price are required',
        data: null
      });
    }

    // Check if SKU exists
    const existing = await db.getOne(
      'SELECT product_id FROM products WHERE sku = $1',
      [sku]
    );

    if (existing) {
      return res.status(409).json({
        status: 'error',
        message: 'Product with this SKU already exists',
        data: null
      });
    }

    // Upload image if provided
    let imageUrl = null;
    if (req.file) {
      const productId = Math.random().toString(36).substr(2, 9);
      const s3Result = await uploadtoS3(req.file, productId);
      imageUrl = s3Result.url;
    }

    // Create product
    const product = await db.insert(
      `INSERT INTO products 
       (sku, name, description, short_description, price, category_id, supplier_id,
        stock_quantity, image_url, is_featured, is_hot_deal, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [sku, name, description, short_description, price, category_id, supplier_id,
       stock_quantity, imageUrl, is_featured, is_hot_deal, true]
    );

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product: ' + error.message,
      data: null
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if product exists
    const product = await db.getOne(
      'SELECT * FROM products WHERE product_id = $1',
      [id]
    );

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
        data: null
      });
    }

    // Handle image upload
    if (req.file) {
      const s3Result = await uploadtoS3(req.file, id);
      updates.image_url = s3Result.url;

      // Delete old image if exists
      if (product.image_url) {
        try {
          await deleteFromS3(product.image_url);
        } catch (err) {
          console.error('Failed to delete old image:', err);
        }
      }
    }

    // Build update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update',
        data: null
      });
    }

    updateFields.push(`updated_at = NOW()`);
    values.push(id);

    const updatedProduct = await db.update(
      `UPDATE products SET ${updateFields.join(', ')} WHERE product_id = $${paramCount} RETURNING *`,
      values
    );

    res.json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product: ' + error.message,
      data: null
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db.getOne(
      'SELECT * FROM products WHERE product_id = $1',
      [id]
    );

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
        data: null
      });
    }

    // Delete image from S3
    if (product.image_url) {
      try {
        await deleteFromS3(product.image_url);
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }

    // Soft delete
    await db.update(
      'UPDATE products SET is_active = false, updated_at = NOW() WHERE product_id = $1',
      [id]
    );

    res.json({
      status: 'success',
      message: 'Product deleted successfully',
      data: { product_id: id }
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product: ' + error.message,
      data: null
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
