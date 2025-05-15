const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Paths to mock data files
const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');
const ORDERS_FILE = path.join(__dirname, '../data/orders.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

// In-memory data for Vercel environment
let inMemoryProducts = [];
let inMemoryOrders = [];
let inMemoryUsers = [];

// Helper functions for data operations
const readDataFile = (filePath) => {
  try {
    // For Vercel environment, use in-memory data
    if (process.env.VERCEL) {
      if (filePath.includes('products.json')) return inMemoryProducts;
      if (filePath.includes('orders.json')) return inMemoryOrders;
      if (filePath.includes('users.json')) return inMemoryUsers;
      return [];
    }
    
    // For local development, use file system
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error reading data:`, error);
    return [];
  }
};

const writeDataFile = (filePath, data) => {
  try {
    // For Vercel environment, update in-memory data
    if (process.env.VERCEL) {
      if (filePath.includes('products.json')) inMemoryProducts = data;
      if (filePath.includes('orders.json')) inMemoryOrders = data;
      if (filePath.includes('users.json')) inMemoryUsers = data;
      return true;
    }
    
    // For local development, use file system
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing data:`, error);
    return false;
  }
};

// Ensure data directories exist
const ensureDataFilesExist = () => {
  // Skip file creation for Vercel environment
  if (process.env.VERCEL) {
    // Initialize in-memory data
    if (inMemoryProducts.length === 0) {
      inMemoryProducts = Array.from({ length: 25 }).map((_, index) => ({
        id: index + 1,
        name: `Book Title ${index + 1}`,
        sku: `SKU-${1000 + index}`,
        category: ['Fiction', 'Non-Fiction', 'Self-Help', 'Biography'][Math.floor(Math.random() * 4)],
        price: Math.floor(Math.random() * 1000) + 99,
        discount: Math.floor(Math.random() * 30),
        stock: Math.floor(Math.random() * 100),
        status: ['In Stock', 'Low Stock', 'Out of Stock'][Math.floor(Math.random() * 3)],
        image: `https://picsum.photos/seed/${index}/200/300`,
        author: `Author ${index + 1}`,
        featured: Math.random() > 0.7
      }));
    }
    
    if (inMemoryOrders.length === 0) {
      const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
      const paymentStatuses = ['Paid', 'Pending', 'Failed', 'Refunded'];
      const paymentMethods = ['Credit Card', 'PayTM', 'UPI', 'Cash on Delivery'];
      
      inMemoryOrders = Array.from({ length: 30 }).map((_, index) => {
        const numItems = Math.floor(Math.random() * 4) + 1;
        const orderItems = Array.from({ length: numItems }).map((_, itemIndex) => {
          const product = inMemoryProducts[Math.floor(Math.random() * inMemoryProducts.length)];
          return {
            id: itemIndex + 1,
            productId: product.id,
            product: product.name,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: product.price
          };
        });
        
        const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
          id: `ORD-${1000 + index}`,
          customerName: `Customer ${index + 1}`,
          customerEmail: `customer${index + 1}@example.com`,
          date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          total: total,
          status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
          paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          shippingAddress: `${Math.floor(Math.random() * 999) + 1} Example St, City, State ${Math.floor(Math.random() * 999999) + 100000}`,
          items: orderItems,
          trackingNumber: Math.random() > 0.5 ? `TRK-${Math.floor(Math.random() * 1000000)}` : null
        };
      });
    }
    
    if (inMemoryUsers.length === 0) {
      const roles = ['Admin', 'Customer', 'Seller'];
      const statusOptions = ['Active', 'Inactive', 'Banned', 'Pending'];
      
      inMemoryUsers = Array.from({ length: 25 }).map((_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        passwordHash: '$2a$10$yCJ66FGFKUkYc4JbLjuGv.sHsZJHeLJx/i6GWs3lIMuRoxyHV0qbG', // "password123"
        role: roles[Math.floor(Math.random() * roles.length)],
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
        joinDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        lastLogin: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
        orders: Math.floor(Math.random() * 20),
        verified: Math.random() > 0.3
      }));
      
      // Ensure there's always at least one admin user
      inMemoryUsers[0] = {
        id: 1,
        name: 'Admin User',
        email: 'admin@kitabey.com',
        passwordHash: '$2a$10$yCJ66FGFKUkYc4JbLjuGv.sHsZJHeLJx/i6GWs3lIMuRoxyHV0qbG', // "admin123"
        role: 'Admin',
        status: 'Active',
        joinDate: new Date(Date.now() - 10000000000).toISOString(),
        lastLogin: new Date().toISOString(),
        orders: 0,
        verified: true
      };
    }
    
    return;
  }
  
  // For local development, use filesystem
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Products data
  if (!fs.existsSync(PRODUCTS_FILE)) {
    const sampleProducts = Array.from({ length: 25 }).map((_, index) => ({
      id: index + 1,
      name: `Book Title ${index + 1}`,
      sku: `SKU-${1000 + index}`,
      category: ['Fiction', 'Non-Fiction', 'Self-Help', 'Biography'][Math.floor(Math.random() * 4)],
      price: Math.floor(Math.random() * 1000) + 99,
      discount: Math.floor(Math.random() * 30),
      stock: Math.floor(Math.random() * 100),
      status: ['In Stock', 'Low Stock', 'Out of Stock'][Math.floor(Math.random() * 3)],
      image: `https://picsum.photos/seed/${index}/200/300`,
      author: `Author ${index + 1}`,
      featured: Math.random() > 0.7
    }));
    writeDataFile(PRODUCTS_FILE, sampleProducts);
  }
  
  // Orders data
  if (!fs.existsSync(ORDERS_FILE)) {
    const products = readDataFile(PRODUCTS_FILE);
    const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const paymentStatuses = ['Paid', 'Pending', 'Failed', 'Refunded'];
    const paymentMethods = ['Credit Card', 'PayTM', 'UPI', 'Cash on Delivery'];
    
    const sampleOrders = Array.from({ length: 30 }).map((_, index) => {
      const numItems = Math.floor(Math.random() * 4) + 1;
      const orderItems = Array.from({ length: numItems }).map((_, itemIndex) => {
        const product = products[Math.floor(Math.random() * products.length)];
        return {
          id: itemIndex + 1,
          productId: product.id,
          product: product.name,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: product.price
        };
      });
      
      const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        id: `ORD-${1000 + index}`,
        customerName: `Customer ${index + 1}`,
        customerEmail: `customer${index + 1}@example.com`,
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        total: total,
        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        shippingAddress: `${Math.floor(Math.random() * 999) + 1} Example St, City, State ${Math.floor(Math.random() * 999999) + 100000}`,
        items: orderItems,
        trackingNumber: Math.random() > 0.5 ? `TRK-${Math.floor(Math.random() * 1000000)}` : null
      };
    });
    writeDataFile(ORDERS_FILE, sampleOrders);
  }
  
  // Users data
  if (!fs.existsSync(USERS_FILE)) {
    const roles = ['Admin', 'Customer', 'Seller'];
    const statusOptions = ['Active', 'Inactive', 'Banned', 'Pending'];
    
    const sampleUsers = Array.from({ length: 25 }).map((_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      passwordHash: '$2a$10$yCJ66FGFKUkYc4JbLjuGv.sHsZJHeLJx/i6GWs3lIMuRoxyHV0qbG', // "password123"
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
      joinDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      lastLogin: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
      orders: Math.floor(Math.random() * 20),
      verified: Math.random() > 0.3
    }));
    
    // Ensure there's always at least one admin user
    sampleUsers[0] = {
      id: 1,
      name: 'Admin User',
      email: 'admin@kitabey.com',
      passwordHash: '$2a$10$yCJ66FGFKUkYc4JbLjuGv.sHsZJHeLJx/i6GWs3lIMuRoxyHV0qbG', // "admin123"
      role: 'Admin',
      status: 'Active',
      joinDate: new Date(Date.now() - 10000000000).toISOString(),
      lastLogin: new Date().toISOString(),
      orders: 0,
      verified: true
    };
    
    writeDataFile(USERS_FILE, sampleUsers);
  }
};

// Initialize data files on server start
ensureDataFilesExist();

// Middleware to check admin authorization
const requireAdmin = (req, res, next) => {
  const userId = req.headers['user-id']; // In a real app, you'd use JWT tokens
  
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  
  const users = readDataFile(USERS_FILE);
  const user = users.find(u => u.id === parseInt(userId));
  
  if (!user || user.role !== 'Admin') {
    return res.status(403).json({ success: false, message: 'Admin privileges required' });
  }
  
  // For demo purposes, we'll attach the user to the request
  req.admin = user;
  next();
};

// Admin authentication route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  
  const users = readDataFile(USERS_FILE);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  // In a real app, you'd use bcrypt.compare for password verification
  if (!user || (email !== 'admin@kitabey.com' && password !== 'admin123')) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  
  if (user.status !== 'Active') {
    return res.status(403).json({ success: false, message: 'Account is not active' });
  }
  
  // Update last login time
  const updatedUsers = users.map(u => {
    if (u.id === user.id) {
      return { ...u, lastLogin: new Date().toISOString() };
    }
    return u;
  });
  writeDataFile(USERS_FILE, updatedUsers);
  
  // In a real app, you'd generate a JWT token here
  return res.json({
    success: true,
    message: 'Authentication successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Dashboard statistics
router.get('/dashboard/stats', requireAdmin, (req, res) => {
  try {
    const products = readDataFile(PRODUCTS_FILE);
    const orders = readDataFile(ORDERS_FILE);
    const users = readDataFile(USERS_FILE);
    
    const pendingOrders = orders.filter(o => o.status === 'Pending');
    const processingOrders = orders.filter(o => o.status === 'Processing');
    const lowStockProducts = products.filter(p => p.stock < 10 && p.stock > 0);
    const newUsers = users.filter(u => {
      const joinDate = new Date(u.joinDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return joinDate > thirtyDaysAgo;
    });
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      if (order.paymentStatus === 'Paid' || order.paymentStatus === 'Refunded') {
        return sum + order.total;
      }
      return sum;
    }, 0);
    
    // Get recent orders and top products
    const recentOrders = orders
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        customer: order.customerName,
        date: order.date,
        amount: order.total,
        status: order.status
      }));
    
    // Generate sales data for the last 30 days
    const salesData = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Find orders on this date
      const ordersOnDate = orders.filter(order => {
        const orderDate = new Date(order.date).toISOString().split('T')[0];
        return orderDate === dateString;
      });
      
      const salesOnDate = ordersOnDate.reduce((sum, order) => {
        if (order.paymentStatus === 'Paid' || order.paymentStatus === 'Refunded') {
          return sum + order.total;
        }
        return sum;
      }, 0);
      
      salesData.push({
        date: dateString,
        sales: salesOnDate,
        orders: ordersOnDate.length
      });
    }
    
    return res.json({
      success: true,
      data: {
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        recentOrders: recentOrders,
        salesData: salesData,
        pendingOrders: pendingOrders.length,
        processingOrders: processingOrders.length,
        lowStockProducts: lowStockProducts.length,
        newUsers: newUsers.length
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      data: {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: [],
        salesData: [],
        pendingOrders: 0,
        processingOrders: 0,
        lowStockProducts: 0,
        newUsers: 0
      }
    });
  }
});

// PRODUCT ROUTES
// Get all products
router.get('/products', requireAdmin, (req, res) => {
  try {
    const products = readDataFile(PRODUCTS_FILE);
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products', products: [] });
  }
});

// Get a single product
router.get('/products/:id', requireAdmin, (req, res) => {
  try {
    const products = readDataFile(PRODUCTS_FILE);
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found', product: null });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product', product: null });
  }
});

// Create a new product
router.post('/products', requireAdmin, (req, res) => {
  try {
    const {
      name, sku, category, price, discount, stock, status, author, image, featured, description
    } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Name and category are required', product: null });
    }
    
    const products = readDataFile(PRODUCTS_FILE);
    
    // Generate SKU if not provided
    const generatedSku = sku || `SKU-${Math.floor(Math.random() * 10000) + 1000}`;
    
    // Check for duplicate SKU only if provided
    if (sku && products.some(p => p.sku === sku)) {
      return res.status(400).json({ success: false, message: 'SKU already exists', product: null });
    }
    
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name,
      sku: generatedSku,
      category,
      description: description || '',
      price: parseFloat(price) || 0,
      discount: parseFloat(discount) || 0,
      stock: parseInt(stock) || 0,
      status: status || 'active',
      author: author || 'Unknown Author',
      image: image || '',
      featured: featured !== undefined ? featured : true,
      createdAt: new Date().toISOString(),
      dateAdded: new Date().toISOString(),
      rating: 0,
      reviews: 0,
      sales: 0,
      isNew: true,
      isFeatured: true
    };
    
    products.push(newProduct);
    writeDataFile(PRODUCTS_FILE, products);
    
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product', product: null });
  }
});

// Update a product
router.put('/products/:id', requireAdmin, (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const products = readDataFile(PRODUCTS_FILE);
    
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found', product: null });
    }
    
    // Check for duplicate SKU (except for the current product)
    if (req.body.sku && products.some(p => p.sku === req.body.sku && p.id !== productId)) {
      return res.status(400).json({ success: false, message: 'SKU already exists', product: null });
    }
    
    const updatedProduct = {
      ...products[productIndex],
      ...req.body,
      id: productId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    products[productIndex] = updatedProduct;
    writeDataFile(PRODUCTS_FILE, products);
    
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product', product: null });
  }
});

// Delete a product
router.delete('/products/:id', requireAdmin, (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const products = readDataFile(PRODUCTS_FILE);
    
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found', product: null });
    }
    
    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);
    
    writeDataFile(PRODUCTS_FILE, products);
    
    res.json({ success: true, product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product', product: null });
  }
});

// ORDER ROUTES
// Get all orders
router.get('/orders', requireAdmin, (req, res) => {
  try {
    const orders = readDataFile(ORDERS_FILE);
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', orders: [] });
  }
});

// Get a single order
router.get('/orders/:id', requireAdmin, (req, res) => {
  try {
    const orders = readDataFile(ORDERS_FILE);
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found', order: null });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order', order: null });
  }
});

// Update order status
router.put('/orders/:id/status', requireAdmin, (req, res) => {
  try {
    const { status, paymentStatus, trackingNumber } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    
    const orders = readDataFile(ORDERS_FILE);
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, message: 'Order not found', order: null });
    }
    
    const updatedOrder = {
      ...orders[orderIndex],
      status,
      paymentStatus: paymentStatus || orders[orderIndex].paymentStatus,
      trackingNumber: trackingNumber || orders[orderIndex].trackingNumber,
      updatedAt: new Date().toISOString()
    };
    
    orders[orderIndex] = updatedOrder;
    writeDataFile(ORDERS_FILE, orders);
    
    // Send email notification to customer about status change
    const emailNotification = {
      to: updatedOrder.customerEmail,
      subject: `Your Order ${updatedOrder.id} has been updated`,
      orderId: updatedOrder.id,
      customerName: updatedOrder.customerName,
      status: updatedOrder.status,
      trackingNumber: updatedOrder.trackingNumber
    };
    
    // In a real app, you'd call a notification service here
    console.log('Sending order update notification:', emailNotification);
    
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status', order: null });
  }
});

// USER ROUTES
// Get all users
router.get('/users', requireAdmin, (req, res) => {
  try {
    const users = readDataFile(USERS_FILE);
    
    // Remove sensitive information
    const safeUsers = users.map(user => {
      const { passwordHash, ...safeUser } = user;
      return safeUser;
    });
    
    res.json({ success: true, users: safeUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users', users: [] });
  }
});

// Get a single user
router.get('/users/:id', requireAdmin, (req, res) => {
  try {
    const users = readDataFile(USERS_FILE);
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', user: null });
    }
    
    // Remove sensitive information
    const { passwordHash, ...safeUser } = user;
    
    res.json({ success: true, user: safeUser });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user', user: null });
  }
});

// Create a new user
router.post('/users', requireAdmin, (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }
    
    const users = readDataFile(USERS_FILE);
    
    // Check for duplicate email
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    
    // In a real app, you'd hash the password using bcrypt
    const passwordHash = `$2a$10$hash_placeholder_${uuidv4()}`;
    
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      passwordHash,
      role,
      status: status || 'Active',
      joinDate: new Date().toISOString(),
      lastLogin: null,
      orders: 0,
      verified: false
    };
    
    users.push(newUser);
    writeDataFile(USERS_FILE, users);
    
    // Remove sensitive information
    const { passwordHash: _, ...safeUser } = newUser;
    
    res.status(201).json({ success: true, user: safeUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Failed to create user', user: null });
  }
});

// Update a user
router.put('/users/:id', requireAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = readDataFile(USERS_FILE);
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found', user: null });
    }
    
    // Check for duplicate email (except for the current user)
    if (req.body.email && users.some(u => u.email.toLowerCase() === req.body.email.toLowerCase() && u.id !== userId)) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    
    let updatedUser = { ...users[userIndex] };
    
    // Update fields
    if (req.body.name) updatedUser.name = req.body.name;
    if (req.body.email) updatedUser.email = req.body.email;
    if (req.body.role) updatedUser.role = req.body.role;
    if (req.body.status) updatedUser.status = req.body.status;
    
    // Update password if provided
    if (req.body.password) {
      // In a real app, you'd hash the password using bcrypt
      updatedUser.passwordHash = `$2a$10$hash_placeholder_${uuidv4()}`;
    }
    
    updatedUser.updatedAt = new Date().toISOString();
    
    users[userIndex] = updatedUser;
    writeDataFile(USERS_FILE, users);
    
    // Remove sensitive information
    const { passwordHash, ...safeUser } = updatedUser;
    
    res.json({ success: true, user: safeUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Failed to update user', user: null });
  }
});

// Delete a user
router.delete('/users/:id', requireAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = readDataFile(USERS_FILE);
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found', user: null });
    }
    
    // Prevent deleting your own account
    if (userId === req.admin.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    
    writeDataFile(USERS_FILE, users);
    
    // Remove sensitive information
    const { passwordHash, ...safeUser } = deletedUser;
    
    res.json({ success: true, user: safeUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user', user: null });
  }
});

// Public routes that don't require authentication
// Get featured products (no authentication required)
router.get('/public/featured-products', (req, res) => {
  try {
    const products = readDataFile(PRODUCTS_FILE);
    // Filter to include only featured products
    const featuredProducts = products.filter(product => 
      product.featured === true || product.isFeatured === true
    );
    
    // Sort by most recently added products first
    featuredProducts.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    
    console.log(`Found ${featuredProducts.length} featured products out of ${products.length} total`);
    
    res.json({ 
      success: true, 
      products: featuredProducts 
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch featured products', 
      products: [] 
    });
  }
});

module.exports = router; 