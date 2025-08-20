const express = require('express');
const {
  getFarms,
  getFarm,
  createFarm,
  updateFarm,
  deleteFarm,
  addManager,
  removeManager,
  getFarmsInRadius
} = require('../controllers/farmController');

const { protect, authorize } = require('../middleware/auth');
const { validateFarm } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getFarms)
  .post(authorize('farm_owner', 'admin'), validateFarm, createFarm);

router
  .route('/:id')
  .get(getFarm)
  .put(authorize('farm_owner', 'farm_manager', 'admin'), updateFarm)
  .delete(authorize('farm_owner', 'admin'), deleteFarm);

router
  .route('/:id/managers')
  .post(authorize('farm_owner', 'admin'), addManager);

router
  .route('/:id/managers/:managerId')
  .delete(authorize('farm_owner', 'admin'), removeManager);

router
  .route('/radius/:zipcode/:distance')
  .get(getFarmsInRadius);

module.exports = router;
