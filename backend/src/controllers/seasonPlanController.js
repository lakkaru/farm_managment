const SeasonPlan = require('../models/SeasonPlan');
const PaddyVariety = require('../models/PaddyVariety');
const { validationResult } = require('express-validator');

// @desc    Get all season plans for user
// @route   GET /api/season-plans
// @access  Private
const getSeasonPlans = async (req, res) => {
  try {
    const { season, status, farmId } = req.query;
    
    const filter = { userId: req.user.id };
    
    if (season) filter.season = season;
    if (status) filter.status = status;
    if (farmId) filter.farmId = farmId;

    const plans = await SeasonPlan.find(filter)
      .populate('farmId', 'name location district cultivationZone totalArea')
      .populate('paddyVariety', 'name duration type characteristics')
      .sort({ cultivationDate: -1 });
    
    res.json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    console.error('Get season plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching season plans',
      error: error.message,
    });
  }
};

// @desc    Get single season plan
// @route   GET /api/season-plans/:id
// @access  Private
const getSeasonPlan = async (req, res) => {
  try {
    const plan = await SeasonPlan.findById(req.params.id)
      .populate('farmId', 'name location district cultivationZone totalArea')
      .populate('paddyVariety', 'name duration type characteristics');
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Season plan not found',
      });
    }

    // Check ownership
    if (plan.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this season plan',
      });
    }

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error('Get season plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching season plan',
      error: error.message,
    });
  }
};

// @desc    Create new season plan
// @route   POST /api/season-plans
// @access  Private
const createSeasonPlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    // Get the farm to extract district and climate zone
    const Farm = require('../models/Farm');
    const farm = await Farm.findById(req.body.farmId);
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found',
      });
    }

    // Get paddy variety details
    const paddyVariety = await PaddyVariety.findById(req.body.paddyVariety);
    if (!paddyVariety) {
      return res.status(404).json({
        success: false,
        message: 'Paddy variety not found',
      });
    }

    // Generate season plan data with farm's district and climate zone
    const planData = {
      ...req.body,
      userId: req.user.id,
      // Use climate zone from farm's cultivationZone, or use a default based on district
      climateZone: farm.cultivationZone || getDefaultClimateZone(farm.district),
    };

    // Generate growing stages
    planData.growingStages = generateGrowingStages(req.body.cultivationDate, paddyVariety.duration);
    
    // Generate fertilizer schedule
    planData.fertilizerSchedule = generateFertilizerSchedule(
      req.body.cultivationDate, 
      req.body.cultivatingArea,
      req.body.soilCondition
    );

    // Set expected harvest date - extract numeric duration from string
    const durationMatch = paddyVariety.duration.match(/(\d+)(?:-(\d+))?/);
    let durationDays = 105; // default fallback
    if (durationMatch) {
      const minDuration = parseInt(durationMatch[1]);
      const maxDuration = durationMatch[2] ? parseInt(durationMatch[2]) : minDuration;
      durationDays = Math.round((minDuration + maxDuration) / 2);
    }
    
    const harvestDate = new Date(req.body.cultivationDate);
    harvestDate.setDate(harvestDate.getDate() + durationDays);
    planData.expectedHarvest = {
      date: harvestDate,
      estimatedYield: calculateEstimatedYield(req.body.cultivatingArea, paddyVariety.characteristics?.yield || 4),
    };

    console.log('Creating season plan with data:', JSON.stringify(planData, null, 2));

    const plan = await SeasonPlan.create(planData);
    
    const populatedPlan = await SeasonPlan.findById(plan._id)
      .populate('farmId', 'name district cultivationZone')
      .populate('paddyVariety', 'name duration type');
    
    res.status(201).json({
      success: true,
      data: populatedPlan,
      message: 'Season plan created successfully',
    });
  } catch (error) {
    console.error('Create season plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating season plan',
      error: error.message,
    });
  }
};

// @desc    Update season plan
// @route   PUT /api/season-plans/:id
// @access  Private
const updateSeasonPlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const plan = await SeasonPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Season plan not found',
      });
    }

    // Check ownership
    if (plan.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this season plan',
      });
    }

    const updatedPlan = await SeasonPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('farmId', 'name location district cultivationZone totalArea')
     .populate('paddyVariety', 'name duration type characteristics');

    res.json({
      success: true,
      data: updatedPlan,
      message: 'Season plan updated successfully',
    });
  } catch (error) {
    console.error('Update season plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating season plan',
      error: error.message,
    });
  }
};

// @desc    Delete season plan
// @route   DELETE /api/season-plans/:id
// @access  Private
const deleteSeasonPlan = async (req, res) => {
  try {
    const plan = await SeasonPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Season plan not found',
      });
    }

    // Check ownership
    if (plan.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this season plan',
      });
    }

    await SeasonPlan.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Season plan deleted successfully',
    });
  } catch (error) {
    console.error('Delete season plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting season plan',
      error: error.message,
    });
  }
};

// Helper functions
const generateGrowingStages = (cultivationDate, durationString) => {
  // Extract numeric duration from string (e.g., "90-95 days" -> 92.5)
  let duration = 105; // default fallback
  const durationMatch = durationString.match(/(\d+)(?:-(\d+))?/);
  if (durationMatch) {
    const minDuration = parseInt(durationMatch[1]);
    const maxDuration = durationMatch[2] ? parseInt(durationMatch[2]) : minDuration;
    duration = Math.round((minDuration + maxDuration) / 2);
  }

  const stages = [
    { stage: 'Land Preparation', startDay: -14, endDay: 0, description: 'Plowing, harrowing, and field preparation' },
    { stage: 'Nursery/Sowing', startDay: 0, endDay: 21, description: 'Seed sowing in nursery or direct seeding' },
    { stage: 'Transplanting', startDay: 21, endDay: 28, description: 'Transplanting seedlings to main field' },
    { stage: 'Tillering', startDay: 28, endDay: 45, description: 'Formation of tillers and vegetative growth' },
    { stage: 'Panicle Initiation', startDay: 45, endDay: 65, description: 'Panicle development begins' },
    { stage: 'Flowering', startDay: 65, endDay: 85, description: 'Flowering and pollination' },
    { stage: 'Grain Filling', startDay: 85, endDay: duration - 15, description: 'Grain development and filling' },
    { stage: 'Maturity', startDay: duration - 15, endDay: duration, description: 'Grain maturity and harvest preparation' },
    { stage: 'Harvesting', startDay: duration, endDay: duration + 7, description: 'Harvesting and post-harvest activities' },
  ];

  return stages.map(stage => {
    const startDate = new Date(cultivationDate);
    startDate.setDate(startDate.getDate() + stage.startDay);
    const endDate = new Date(cultivationDate);
    endDate.setDate(endDate.getDate() + stage.endDay);

    return {
      stage: stage.stage,
      startDate,
      endDate,
      description: stage.description,
    };
  });
};

const generateFertilizerSchedule = (cultivationDate, area, soilCondition) => {
  // Base fertilizer recommendations (kg per acre)
  let baseFertilizer = {
    urea: 50,
    tsp: 25,
    mop: 25,
  };

  // Adjust based on soil condition
  const soilAdjustments = {
    'Sandy': { urea: 1.2, tsp: 1.1, mop: 1.0 },
    'Clay': { urea: 0.9, tsp: 1.0, mop: 1.1 },
    'Loam': { urea: 1.0, tsp: 1.0, mop: 1.0 },
    'Sandy Loam': { urea: 1.1, tsp: 1.0, mop: 1.0 },
    'Clay Loam': { urea: 0.95, tsp: 1.0, mop: 1.05 },
    'Silt Loam': { urea: 1.0, tsp: 0.9, mop: 1.0 },
  };

  if (soilAdjustments[soilCondition]) {
    const adj = soilAdjustments[soilCondition];
    baseFertilizer.urea *= adj.urea;
    baseFertilizer.tsp *= adj.tsp;
    baseFertilizer.mop *= adj.mop;
  }

  const applications = [
    {
      stage: 'Basal Application',
      days: -1,
      description: 'Apply before transplanting',
      percentage: { urea: 0.3, tsp: 1.0, mop: 0.5 },
    },
    {
      stage: 'First Top Dressing',
      days: 21,
      description: 'Active tillering stage',
      percentage: { urea: 0.35, tsp: 0, mop: 0.5 },
    },
    {
      stage: 'Second Top Dressing',
      days: 45,
      description: 'Panicle initiation stage',
      percentage: { urea: 0.35, tsp: 0, mop: 0 },
    },
  ];

  const prices = { urea: 80, tsp: 120, mop: 100 }; // LKR per kg

  return applications.map(app => {
    const applicationDate = new Date(cultivationDate);
    applicationDate.setDate(applicationDate.getDate() + app.days);

    const fertilizers = {
      urea: Math.round(baseFertilizer.urea * app.percentage.urea * area),
      tsp: Math.round(baseFertilizer.tsp * app.percentage.tsp * area),
      mop: Math.round(baseFertilizer.mop * app.percentage.mop * area),
    };

    const totalCost = Object.entries(fertilizers).reduce((total, [type, amount]) => {
      return total + (amount * prices[type]);
    }, 0);

    return {
      stage: app.stage,
      date: applicationDate,
      fertilizers,
      totalCost,
      description: app.description,
    };
  });
};

const calculateEstimatedYield = (area, yieldPerAcre = 4) => {
  return Math.round(area * yieldPerAcre * 100) / 100; // tons
};

// Helper function to get default climate zone based on district
const getDefaultClimateZone = (district) => {
  // This is a simplified mapping - you might want to use your districts constants
  const zoneMapping = {
    'Colombo': 'WL1',
    'Gampaha': 'WL1', 
    'Kalutara': 'WL2',
    'Kandy': 'WM1',
    'Matale': 'WM2',
    'Nuwara Eliya': 'WU1',
    'Kurunegala': 'IM1',
    'Puttalam': 'DL1',
    'Anuradhapura': 'DL1',
    'Polonnaruwa': 'DL2',
    'Batticaloa': 'DL3',
    'Ampara': 'DL3',
    'Trincomalee': 'DL2',
    'Vavuniya': 'DL1',
    'Mannar': 'DL1',
    'Jaffna': 'DL1',
    'Kilinochchi': 'DL1',
    'Mullaitivu': 'DL1',
    'Galle': 'WL2',
    'Matara': 'WL2',
    'Hambantota': 'DL3',
    'Ratnapura': 'WL3',
    'Kegalle': 'WM1',
    'Badulla': 'IL1',
    'Moneragala': 'IL1'
  };
  return zoneMapping[district] || 'WL1'; // Default to WL1 if district not found
};

module.exports = {
  getSeasonPlans,
  getSeasonPlan,
  createSeasonPlan,
  updateSeasonPlan,
  deleteSeasonPlan,
};
