const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const {
  getSeasonPlans,
  getSeasonPlan,
  createSeasonPlan,
  updateSeasonPlan,
  deleteSeasonPlan,
  updateFertilizerImplementation,
  updateStageImplementation,
  updateHarvest,
  addLCCFertilizerApplication,
  deleteFertilizerApplication,
  addDailyRemark,
  updateDailyRemark,
  deleteDailyRemark,
  removeRemarkImage,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} = require('../controllers/seasonPlanController');
const { protect } = require('../middleware/auth');

// Configure multer for daily remark images
const remarkStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/remarks');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const uniqueName = `remark_${timestamp}_${random}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const remarkUpload = multer({
  storage: remarkStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per image
    files: 5 // Maximum 5 images per remark
  },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Validation rules
const seasonPlanValidation = [
  body('farmId')
    .isMongoId()
    .withMessage('Valid farm ID is required'),
  body('season')
    .isIn(['maha', 'yala'])
    .withMessage('Season must be either maha or yala'),
  // climateZone will be auto-populated from farm
  body('irrigationMethod')
    .isIn(['Rain fed', 'Under irrigation'])
    .withMessage('Invalid irrigation method'),
  body('soilCondition')
    .isIn(['Sandy', 'Clay', 'Loam', 'Sandy Loam', 'Clay Loam', 'Silt Loam'])
    .withMessage('Invalid soil condition'),
  body('paddyVariety')
    .isMongoId()
    .withMessage('Valid paddy variety ID is required'),
  body('cultivatingArea')
    .isFloat({ min: 0.1 })
    .withMessage('Cultivating area must be at least 0.1 acres'),
  body('cultivationDate')
    .isISO8601()
    .withMessage('Valid cultivation date is required'),
];

// Serve remark images (no authentication required)
router.get('/remark-image/:filename', (req, res) => {
  const imagePath = path.join(__dirname, '../../uploads/remarks', req.params.filename);
  console.log('Serving remark image:', req.params.filename);
  console.log('Image path:', imagePath);
  
  // Set CORS headers for images
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  // Check if file exists
  const fs = require('fs');
  if (!fs.existsSync(imagePath)) {
    console.log('Image file not found:', imagePath);
    return res.status(404).json({ error: 'Image not found' });
  }
  
  res.sendFile(imagePath);
});

// Apply protect middleware to all other routes
router.use(protect);

// Routes
router
  .route('/')
  .get(getSeasonPlans)
  .post(seasonPlanValidation, createSeasonPlan);

router
  .route('/:id')
  .get(getSeasonPlan)
  .put(seasonPlanValidation, updateSeasonPlan)
  .delete(deleteSeasonPlan);

// Implementation tracking routes
router
  .route('/:id/fertilizer/:applicationIndex')
  .put(updateFertilizerImplementation);

router
  .route('/:id/stage/:stageIndex')
  .put(updateStageImplementation);

// Harvest tracking route
router
  .route('/:id/harvest')
  .put(updateHarvest);

// LCC-based fertilizer application route
router
  .route('/:id/lcc-fertilizer')
  .post([
    body('plantAge').isInt({ min: 2, max: 8 }).withMessage('Plant age must be between 2-8 weeks'),
    body('leafColorIndex').isInt({ min: 2, max: 4 }).withMessage('Leaf color index must be between 2-4'),
    body('recommendedUrea').isFloat({ min: 0 }).withMessage('Recommended urea must be a positive number'),
  ], addLCCFertilizerApplication);

// Delete fertilizer application route
router
  .route('/:id/fertilizer/:applicationIndex')
  .delete(deleteFertilizerApplication);

// Daily remarks routes
router
  .route('/:id/daily-remarks')
  .post(remarkUpload.array('images', 5), [
    body('date').isISO8601().withMessage('Valid date is required'),
    body('category').optional().isIn(['general', 'weather', 'field_preparation', 'pest', 'disease', 'fertilizer', 'irrigation', 'growth', 'other']).withMessage('Invalid category'),
    body('title').isLength({ min: 1, max: 100 }).withMessage('Title must be between 1-100 characters'),
    body('description').isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1-1000 characters'),
  ], addDailyRemark);

router
  .route('/:id/daily-remarks/:remarkId')
  .put(remarkUpload.array('images', 5), [
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('category').optional().isIn(['general', 'weather', 'field_preparation', 'pest', 'disease', 'fertilizer', 'irrigation', 'growth', 'other']).withMessage('Invalid category'),
    body('title').optional().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1-100 characters'),
    body('description').optional().isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1-1000 characters'),
  ], updateDailyRemark)
  .delete(deleteDailyRemark);

// Route to remove specific image from daily remark
router
  .route('/:id/daily-remarks/:remarkId/images/:imageFilename')
  .delete(removeRemarkImage);

// Expense management routes
router
  .route('/:id/expenses')
  .post([
    body('date').isISO8601().withMessage('Valid date is required'),
    body('category').isIn([
      'seeds', 'fertilizer', 'pesticide', 'herbicide', 'fungicide',
      'labor', 'machinery', 'fuel', 'irrigation', 'transportation',
      'equipment', 'land_preparation', 'harvesting', 'storage',
      'certification', 'insurance', 'utilities', 'other'
    ]).withMessage('Invalid expense category'),
    body('description').isLength({ min: 1, max: 200 }).withMessage('Description must be between 1-200 characters'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
    body('unitPrice').optional().isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
    body('subcategory').optional().isLength({ max: 50 }).withMessage('Subcategory must be 50 characters or less'),
    body('vendor').optional().isLength({ max: 100 }).withMessage('Vendor must be 100 characters or less'),
    body('receiptNumber').optional().isLength({ max: 50 }).withMessage('Receipt number must be 50 characters or less'),
    body('paymentMethod').optional().isIn(['cash', 'bank_transfer', 'check', 'card', 'credit', 'other']).withMessage('Invalid payment method'),
    body('remarks').optional().isLength({ max: 500 }).withMessage('Remarks must be 500 characters or less'),
  ], addExpense);

router
  .route('/:id/expenses/summary')
  .get(getExpenseSummary);

router
  .route('/:id/expenses/:expenseId')
  .put([
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('category').optional().isIn([
      'seeds', 'fertilizer', 'pesticide', 'herbicide', 'fungicide',
      'labor', 'machinery', 'fuel', 'irrigation', 'transportation',
      'equipment', 'land_preparation', 'harvesting', 'storage',
      'certification', 'insurance', 'utilities', 'other'
    ]).withMessage('Invalid expense category'),
    body('description').optional().isLength({ min: 1, max: 200 }).withMessage('Description must be between 1-200 characters'),
    body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
    body('unitPrice').optional().isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
    body('subcategory').optional().isLength({ max: 50 }).withMessage('Subcategory must be 50 characters or less'),
    body('vendor').optional().isLength({ max: 100 }).withMessage('Vendor must be 100 characters or less'),
    body('receiptNumber').optional().isLength({ max: 50 }).withMessage('Receipt number must be 50 characters or less'),
    body('paymentMethod').optional().isIn(['cash', 'bank_transfer', 'check', 'card', 'credit', 'other']).withMessage('Invalid payment method'),
    body('remarks').optional().isLength({ max: 500 }).withMessage('Remarks must be 500 characters or less'),
  ], updateExpense)
  .delete(deleteExpense);

module.exports = router;
