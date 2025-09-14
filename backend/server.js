const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const farmRoutes = require('./src/routes/farmRoutes');
const cropRoutes = require('./src/routes/cropRoutes');
const livestockRoutes = require('./src/routes/livestockRoutes');
const userRoutes = require('./src/routes/userRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const paddyVarietyRoutes = require('./src/routes/paddyVarietyRoutes');
const seasonPlanRoutes = require('./src/routes/seasonPlanRoutes');
const diseaseDetectionRoutes = require('./src/routes/diseaseDetectionRoutes');
const adminDiseaseRoutes = require('./src/routes/adminDiseaseRoutes');

// Import middleware
const { errorHandler } = require('./src/middleware/errorHandler');
const { notFound } = require('./src/middleware/notFound');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Farm Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/livestock', livestockRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/paddy-varieties', paddyVarietyRoutes);
app.use('/api/season-plans', seasonPlanRoutes);
app.use('/api/disease-detection', diseaseDetectionRoutes);
app.use('/api/admin/diseases', adminDiseaseRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Check R2 configuration
const checkR2Config = () => {
  const r2Service = require('./src/services/r2Service');
  if (r2Service.isConfigured()) {
    console.log('✓ Cloudflare R2 storage configured successfully');
  } else {
    console.warn('⚠️  Cloudflare R2 not configured. Image uploads will fail.');
    console.warn('   Please set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in your .env file');
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  checkR2Config();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
// Updated for restart
