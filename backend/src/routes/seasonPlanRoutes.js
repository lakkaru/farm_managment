const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getSeasonPlans,
  getSeasonPlan,
  createSeasonPlan,
  updateSeasonPlan,
  deleteSeasonPlan,
} = require('../controllers/seasonPlanController');
const { protect } = require('../middleware/auth');

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

// Apply protect middleware to all routes
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

module.exports = router;
