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
    body('category').optional().isIn(['general', 'weather', 'pest', 'disease', 'fertilizer', 'irrigation', 'growth', 'other']).withMessage('Invalid category'),
    body('title').isLength({ min: 1, max: 100 }).withMessage('Title must be between 1-100 characters'),
    body('description').isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1-1000 characters'),
  ], addDailyRemark);

router
  .route('/:id/daily-remarks/:remarkId')
  .put(remarkUpload.array('images', 5), [
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('category').optional().isIn(['general', 'weather', 'pest', 'disease', 'fertilizer', 'irrigation', 'growth', 'other']).withMessage('Invalid category'),
    body('title').optional().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1-100 characters'),
    body('description').optional().isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1-1000 characters'),
  ], updateDailyRemark)
  .delete(deleteDailyRemark);

module.exports = router;
