const SeasonPlan = require('../models/SeasonPlan');
const PaddyVariety = require('../models/PaddyVariety');
const { validationResult } = require('express-validator');
const r2Service = require('../services/r2Service');
const imageProcessingService = require('../services/imageProcessingService');

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
      req.body.irrigationMethod,
      farm.district,
      paddyVariety.duration
    );

    // Set expected harvest date
    let expectedHarvestDate;
    
    if (req.body.expectedHarvest && req.body.expectedHarvest.date) {
      // Use provided expected harvest date
      expectedHarvestDate = new Date(req.body.expectedHarvest.date);
    } else {
      // Calculate expected harvest date from cultivation date and variety duration
      const durationMatch = paddyVariety.duration.match(/(\d+)(?:-(\d+))?/);
      let durationDays = 105; // default fallback
      if (durationMatch) {
        const minDuration = parseInt(durationMatch[1]);
        const maxDuration = durationMatch[2] ? parseInt(durationMatch[2]) : minDuration;
        durationDays = Math.round((minDuration + maxDuration) / 2);
      }
      
      expectedHarvestDate = new Date(req.body.cultivationDate);
      expectedHarvestDate.setDate(expectedHarvestDate.getDate() + durationDays);
    }
    
    planData.expectedHarvest = {
      date: expectedHarvestDate,
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
    { stage: 'First Plowing', startDay: -21, endDay: -21, description: 'First plowing - breaking the soil' },
    { stage: 'Second Plowing & Field Leveling', startDay: -7, endDay: -1, description: 'Second plowing and field leveling for proper water management' },
    { stage: 'Nursery/Sowing', startDay: 0, endDay: 21, description: 'Seed sowing in nursery or direct seeding' },
    { stage: 'Transplanting', startDay: 11, endDay: 14, description: 'Transplanting seedlings to main field' },
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

const generateFertilizerSchedule = (cultivationDate, areaInAcres, irrigationMethod, district, durationString) => {
  // Convert area from acres to hectares (1 acre = 0.404686 hectares)
  const areaHa = areaInAcres * 0.404686;
  
  // Determine zone based on district
  const wetZoneDistricts = ['Kegalle', 'Gampaha', 'Colombo', 'Galle', 'Kalutara'];
  const isWetZone = wetZoneDistricts.includes(district);
  
  // Determine if irrigated or rainfed - simplified to only two methods
  const isIrrigated = irrigationMethod === 'Under irrigation';
  
  // Extract duration in days and categorize
  let durationDays = 105; // default fallback
  const durationMatch = durationString.match(/(\d+)(?:-(\d+))?/);
  if (durationMatch) {
    const minDuration = parseInt(durationMatch[1]);
    const maxDuration = durationMatch[2] ? parseInt(durationMatch[2]) : minDuration;
    durationDays = Math.round((minDuration + maxDuration) / 2);
  }
  
  // Categorize duration: 3 months (~90 days), 3.5 months (~105 days), 4 months (~120 days)
  let ageGroup;
  if (durationDays <= 95) {
    ageGroup = '3_month';
  } else if (durationDays <= 110) {
    ageGroup = '3_5_month';
  } else {
    ageGroup = '4_month';
  }

  // Fertilizer recommendations (kg/ha)
  const recommendations = {
    wet_zone: {
      rainfed: {
        '3_month': {
          total: { urea: 100, tsp: 55, mop: 110, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 25, tsp: 0, mop: 35, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 30, tsp: 0, mop: 45, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 25, tsp: 0, mop: 30, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '3_5_month': {
          total: { urea: 100, tsp: 55, mop: 110, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 25, tsp: 0, mop: 35, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 30, tsp: 0, mop: 45, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 25, tsp: 0, mop: 30, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '4_month': {
          total: { urea: 100, tsp: 55, mop: 110, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 25, tsp: 0, mop: 35, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 30, tsp: 0, mop: 45, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 25, tsp: 0, mop: 30, zinc: 0 },
            { week: 9, stage: '9 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        }
      },
      irrigated: {
        '3_month': {
          total: { urea: 140, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 55, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 45, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '3_5_month': {
          total: { urea: 140, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 55, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 45, tsp: 0, mop: 25, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '4_month': {
          total: { urea: 140, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 55, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 45, tsp: 0, mop: 25, zinc: 0 },
            { week: 9, stage: '9 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        }
      }
    },
    intermediate_dry_zone: {
      rainfed: {
        '3_month': {
          total: { urea: 175, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 65, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 50, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '3_5_month': {
          total: { urea: 175, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 65, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 50, tsp: 0, mop: 25, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '4_month': {
          total: { urea: 175, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 65, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 50, tsp: 0, mop: 25, zinc: 0 },
            { week: 9, stage: '9 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 }
          ]
        }
      },
      irrigated: {
        '3_month': {
          total: { urea: 225, tsp: 55, mop: 60, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 50, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 75, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 65, tsp: 0, mop: 35, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 35, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '3_5_month': {
          total: { urea: 225, tsp: 55, mop: 60, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 50, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 75, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 65, tsp: 0, mop: 35, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 35, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '4_month': {
          total: { urea: 225, tsp: 55, mop: 60, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 50, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 75, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 65, tsp: 0, mop: 35, zinc: 0 },
            { week: 9, stage: '9 Weeks', urea: 35, tsp: 0, mop: 0, zinc: 0 }
          ]
        }
      }
    }
  };

  // Select appropriate recommendation
  const zoneType = isWetZone ? 'wet_zone' : 'intermediate_dry_zone';
  const conditionType = isIrrigated ? 'irrigated' : 'rainfed';
  const selectedRecommendation = recommendations[zoneType][conditionType][ageGroup];

  // Generate schedule
  return selectedRecommendation.schedule.map(app => {
    const applicationDate = new Date(cultivationDate);
    applicationDate.setDate(applicationDate.getDate() + (app.week * 7)); // Convert weeks to days

    const fertilizers = {
      urea: Math.round(app.urea * areaHa * 100) / 100, // kg for the area
      tsp: Math.round(app.tsp * areaHa * 100) / 100,
      mop: Math.round(app.mop * areaHa * 100) / 100,
      zincSulphate: Math.round(app.zinc * areaHa * 100) / 100
    };

    return {
      stage: app.stage,
      date: applicationDate,
      fertilizers,
      description: `${app.stage} - Apply as per Sri Lankan fertilizer recommendations for ${zoneType.replace('_', ' ')} ${conditionType} conditions`,
      recommendations: {
        zone: zoneType.replace('_', ' ').toUpperCase(),
        condition: conditionType.charAt(0).toUpperCase() + conditionType.slice(1),
        ageGroup: ageGroup.replace('_', '.') + ' months',
        totalRecommended: selectedRecommendation.total
      }
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

// @desc    Update fertilizer application implementation
// @route   PUT /api/season-plans/:id/fertilizer/:applicationIndex
// @access  Private
const updateFertilizerImplementation = async (req, res) => {
  try {
    const { id, applicationIndex } = req.params;
    const { applied, implementedDate, notes, actualFertilizers } = req.body;

    const plan = await SeasonPlan.findById(id);
    
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

    // Check if application index exists
    if (!plan.fertilizerSchedule[applicationIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Fertilizer application not found',
      });
    }

    // Update the specific fertilizer application
    if (applied !== undefined) plan.fertilizerSchedule[applicationIndex].applied = applied;
    if (implementedDate) plan.fertilizerSchedule[applicationIndex].implementedDate = implementedDate;
    if (notes !== undefined) plan.fertilizerSchedule[applicationIndex].notes = notes;
    if (actualFertilizers) {
      plan.fertilizerSchedule[applicationIndex].actualFertilizers = actualFertilizers;
    }

    // Set status to active if it's still planned and something has been implemented
    if (plan.status === 'planned' && applied) {
      plan.status = 'active';
    }

    await plan.save();

    const populatedPlan = await SeasonPlan.findById(id)
      .populate('farmId', 'name district cultivationZone')
      .populate('paddyVariety', 'name duration type');

    res.json({
      success: true,
      data: populatedPlan,
      message: 'Fertilizer implementation updated successfully',
    });
  } catch (error) {
    console.error('Update fertilizer implementation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating fertilizer implementation',
      error: error.message,
    });
  }
};

// @desc    Update growing stage implementation
// @route   PUT /api/season-plans/:id/stage/:stageIndex
// @access  Private
const updateStageImplementation = async (req, res) => {
  try {
    const { id, stageIndex } = req.params;
    const { completed, notes, actualStartDate, actualEndDate } = req.body;

    const plan = await SeasonPlan.findById(id);
    
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

    // Check if stage index exists
    if (!plan.growingStages[stageIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Growing stage not found',
      });
    }

    // Update the specific growing stage
    if (completed !== undefined) plan.growingStages[stageIndex].completed = completed;
    if (notes !== undefined) plan.growingStages[stageIndex].notes = notes;
    if (actualStartDate) plan.growingStages[stageIndex].actualStartDate = actualStartDate;
    if (actualEndDate) plan.growingStages[stageIndex].actualEndDate = actualEndDate;

    // Set status to active if it's still planned and a stage has been completed
    if (plan.status === 'planned' && completed) {
      plan.status = 'active';
    }

    // Check if all growing stages are completed and update plan status
    const allStagesCompleted = plan.growingStages.every(stage => stage.completed);
    if (allStagesCompleted && plan.status !== 'completed') {
      plan.status = 'completed';
    } else if (!allStagesCompleted && plan.status === 'completed') {
      // If a stage was unmarked as completed, revert status to active
      plan.status = 'active';
    }

    await plan.save();

    const populatedPlan = await SeasonPlan.findById(id)
      .populate('farmId', 'name district cultivationZone')
      .populate('paddyVariety', 'name duration type');

    res.json({
      success: true,
      data: populatedPlan,
      message: 'Growing stage implementation updated successfully',
    });
  } catch (error) {
    console.error('Update stage implementation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating growing stage implementation',
      error: error.message,
    });
  }
};

// Update harvest data
const updateHarvest = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, actualYield, quality, notes } = req.body;

    const plan = await SeasonPlan.findById(id);
    
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

    // Update harvest data
    plan.actualHarvest = {
      date: date || plan.actualHarvest?.date,
      actualYield: actualYield !== undefined ? actualYield : plan.actualHarvest?.actualYield,
      quality: quality !== undefined ? quality : plan.actualHarvest?.quality,
      notes: notes !== undefined ? notes : plan.actualHarvest?.notes,
    };

    // If harvest is recorded and all stages are completed, ensure status is completed
    if (date && plan.growingStages.every(stage => stage.completed)) {
      plan.status = 'completed';
    }

    await plan.save();

    const populatedPlan = await SeasonPlan.findById(id)
      .populate('farmId', 'name district cultivationZone')
      .populate('paddyVariety', 'name duration type');

    res.json({
      success: true,
      data: populatedPlan,
      message: 'Harvest data updated successfully',
    });
  } catch (error) {
    console.error('Update harvest error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating harvest data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Add LCC-based urea application to fertilizer schedule
// @route   POST /api/season-plans/:id/lcc-fertilizer
// @access  Private
const addLCCFertilizerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { plantAge, leafColorIndex, recommendedUrea, notes } = req.body;

    const plan = await SeasonPlan.findById(id);
    
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

    // Calculate the application date based on plant age (weeks from cultivation date)
    const applicationDate = new Date(plan.cultivationDate);
    applicationDate.setDate(applicationDate.getDate() + (plantAge * 7)); // Convert weeks to days

    // Calculate urea amount for the cultivating area (convert from per acre to total amount)
    const totalUreaAmount = recommendedUrea * plan.cultivatingArea;

    // Create new LCC-based fertilizer application
    const lccApplication = {
      stage: `LCC Application - Week ${plantAge}`,
      date: applicationDate,
      fertilizers: {
        urea: Math.round(totalUreaAmount * 100) / 100,
        tsp: 0,
        mop: 0,
        zincSulphate: 0
      },
      description: `Urea application based on Leaf Color Chart - Plant Age: ${plantAge} weeks, Leaf Color Index: ${leafColorIndex}`,
      applied: false,
      implementedDate: null,
      notes: notes || '',
      lccData: {
        plantAge: plantAge,
        leafColorIndex: leafColorIndex,
        recommendedPerAcre: recommendedUrea,
        totalArea: plan.cultivatingArea
      },
      isLCCBased: true
    };

    // Add to fertilizer schedule
    plan.fertilizerSchedule.push(lccApplication);

    // Sort fertilizer schedule by date
    plan.fertilizerSchedule.sort((a, b) => new Date(a.date) - new Date(b.date));

    await plan.save();

    const populatedPlan = await SeasonPlan.findById(id)
      .populate('farmId', 'name district cultivationZone')
      .populate('paddyVariety', 'name duration type');

    res.status(201).json({
      success: true,
      data: populatedPlan,
      message: 'LCC-based urea application added successfully',
    });
  } catch (error) {
    console.error('Add LCC fertilizer application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding LCC-based fertilizer application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Delete fertilizer application
// @route   DELETE /api/season-plans/:id/fertilizer/:applicationIndex
// @access  Private
const deleteFertilizerApplication = async (req, res) => {
  try {
    const { id, applicationIndex } = req.params;
    
    const plan = await SeasonPlan.findById(id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Season plan not found',
      });
    }

    // Check if user owns the season plan
    if (plan.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this season plan',
      });
    }

    const appIndex = parseInt(applicationIndex);
    
    if (appIndex < 0 || appIndex >= plan.fertilizerSchedule.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fertilizer application index',
      });
    }

    // Check if the application has been implemented (applied)
    const application = plan.fertilizerSchedule[appIndex];
    if (application.applied) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an applied fertilizer application',
      });
    }

    // Remove the fertilizer application
    plan.fertilizerSchedule.splice(appIndex, 1);
    
    await plan.save();
    
    // Populate the response
    const populatedPlan = await SeasonPlan.findById(id)
      .populate('farmId', 'name location district cultivationZone totalArea')
      .populate('paddyVariety', 'name duration type characteristics');
    
    res.json({
      success: true,
      data: populatedPlan,
      message: 'Fertilizer application deleted successfully',
    });
  } catch (error) {
    console.error('Delete fertilizer application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting fertilizer application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Add daily remark
// @route   POST /api/season-plans/:id/remarks
// @access  Private
const addDailyRemark = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, category, title, description } = req.body;

    if (!date || !description) {
      return res.status(400).json({
        success: false,
        message: 'Date and description are required',
      });
    }

    const plan = await SeasonPlan.findById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Season plan not found',
      });
    }

    // Check if user owns this plan
    if (plan.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this season plan',
      });
    }

    // Handle uploaded images with Cloudflare R2 and image processing
    let imageObjects = [];
    if (req.files && req.files.length > 0) {
      try {
        // Process and upload images to Cloudflare R2
        const uploadPromises = req.files.map(async (file) => {
          console.log(`Processing image: ${file.originalname} (${file.mimetype})`);
          
          // Validate image
          const validation = await imageProcessingService.validateImage(
            file.buffer, 
            file.mimetype, 
            file.originalname
          );
          
          if (!validation.isValid) {
            throw new Error(`Invalid image ${file.originalname}: ${validation.error}`);
          }
          
          // Process image (convert HEIC to JPEG, optimize, resize)
          const processedImage = await imageProcessingService.processImage(
            file.buffer,
            file.mimetype,
            {
              maxWidth: 1920,
              maxHeight: 1080,
              quality: 85,
              format: 'jpeg'
            },
            file.originalname // Pass filename for better HEIC detection
          );
          
          console.log(`Image processed: ${file.originalname} - Size: ${processedImage.originalSize} → ${processedImage.processedSize} bytes (${processedImage.compressionRatio}% reduction)`);
          
          // Generate new filename with correct extension
          const fileNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, '');
          const processedFileName = `${fileNameWithoutExt}${processedImage.fileExtension}`;
          
          // Upload processed image to R2
          const uploadResult = await r2Service.uploadFile(
            processedImage.buffer,
            processedFileName,
            processedImage.mimeType,
            'daily-remarks'
          );
          
          return {
            filename: uploadResult.key, // R2 key as filename
            originalName: file.originalname, // Keep original name for reference
            mimetype: processedImage.mimeType, // Use processed MIME type
            size: processedImage.processedSize,
            url: uploadResult.url, // R2 public URL
            uploadDate: new Date(),
            processed: {
              originalSize: processedImage.originalSize,
              compressionRatio: processedImage.compressionRatio,
              dimensions: `${processedImage.width}x${processedImage.height}`
            }
          };
        });

        imageObjects = await Promise.all(uploadPromises);
        console.log(`Successfully processed and uploaded ${imageObjects.length} images`);
      } catch (error) {
        console.error('Image processing/upload error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to process and upload images',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
      }
    }

    // Create new remark
    const newRemark = {
      date: new Date(date),
      category: category || 'general',
      title: title.trim(),
      description: description.trim(),
      images: imageObjects,
    };

    plan.dailyRemarks.push(newRemark);
    await plan.save();

    const populatedPlan = await SeasonPlan.findById(id)
      .populate('farmId', 'name location district cultivationZone totalArea')
      .populate('paddyVariety', 'name duration type characteristics');

    res.status(201).json({
      success: true,
      data: populatedPlan,
      message: 'Daily remark added successfully',
      remarkId: plan.dailyRemarks[plan.dailyRemarks.length - 1]._id,
    });
  } catch (error) {
    console.error('Add daily remark error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding daily remark',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update daily remark
// @route   PUT /api/season-plans/:id/remarks/:remarkId
// @access  Private
const updateDailyRemark = async (req, res) => {
  try {
    const { id, remarkId } = req.params;
    const { date, category, title, description } = req.body;

    const plan = await SeasonPlan.findById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Season plan not found',
      });
    }

    // Check if user owns this plan
    if (plan.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this season plan',
      });
    }

    const remark = plan.dailyRemarks.id(remarkId);
    if (!remark) {
      return res.status(404).json({
        success: false,
        message: 'Daily remark not found',
      });
    }

    // Update remark fields if provided
    if (date) remark.date = new Date(date);
    if (category) remark.category = category;
    if (title) remark.title = title.trim();
    if (description) remark.description = description.trim();

    // Handle uploaded images with Cloudflare R2 and image processing
    if (req.files && req.files.length > 0) {
      try {
        // Process and upload new images to Cloudflare R2
        const uploadPromises = req.files.map(async (file) => {
          console.log(`Processing image: ${file.originalname} (${file.mimetype})`);
          
          // Validate image
          const validation = await imageProcessingService.validateImage(
            file.buffer, 
            file.mimetype, 
            file.originalname
          );
          
          if (!validation.isValid) {
            throw new Error(`Invalid image ${file.originalname}: ${validation.error}`);
          }
          
          // Process image (convert HEIC to JPEG, optimize, resize)
          const processedImage = await imageProcessingService.processImage(
            file.buffer,
            file.mimetype,
            {
              maxWidth: 1920,
              maxHeight: 1080,
              quality: 85,
              format: 'jpeg'
            },
            file.originalname // Pass filename for better HEIC detection
          );
          
          console.log(`Image processed: ${file.originalname} - Size: ${processedImage.originalSize} → ${processedImage.processedSize} bytes (${processedImage.compressionRatio}% reduction)`);
          
          // Generate new filename with correct extension
          const fileNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, '');
          const processedFileName = `${fileNameWithoutExt}${processedImage.fileExtension}`;
          
          // Upload processed image to R2
          const uploadResult = await r2Service.uploadFile(
            processedImage.buffer,
            processedFileName,
            processedImage.mimeType,
            'daily-remarks'
          );
          
          return {
            filename: uploadResult.key, // R2 key as filename
            originalName: file.originalname, // Keep original name for reference
            mimetype: processedImage.mimeType, // Use processed MIME type
            size: processedImage.processedSize,
            url: uploadResult.url, // R2 public URL
            uploadDate: new Date(),
            processed: {
              originalSize: processedImage.originalSize,
              compressionRatio: processedImage.compressionRatio,
              dimensions: `${processedImage.width}x${processedImage.height}`
            }
          };
        });

        const newImageObjects = await Promise.all(uploadPromises);
        console.log(`Successfully processed and uploaded ${newImageObjects.length} images`);
        // Add new images to existing ones (don't replace, append)
        remark.images = [...(remark.images || []), ...newImageObjects];
      } catch (error) {
        console.error('Image processing/upload error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to process and upload images',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
      }
    }

    await plan.save();

    const populatedPlan = await SeasonPlan.findById(id)
      .populate('farmId', 'name location district cultivationZone totalArea')
      .populate('paddyVariety', 'name duration type characteristics');

    res.json({
      success: true,
      data: populatedPlan,
      message: 'Daily remark updated successfully',
    });
  } catch (error) {
    console.error('Update daily remark error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating daily remark',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Delete daily remark
// @route   DELETE /api/season-plans/:id/remarks/:remarkId
// @access  Private
const deleteDailyRemark = async (req, res) => {
  try {
    const { id, remarkId } = req.params;

    const plan = await SeasonPlan.findById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Season plan not found',
      });
    }

    // Check if user owns this plan
    if (plan.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this season plan',
      });
    }

    const remark = plan.dailyRemarks.id(remarkId);
    if (!remark) {
      return res.status(404).json({
        success: false,
        message: 'Daily remark not found',
      });
    }

    // Delete associated images from Cloudflare R2
    if (remark.images && remark.images.length > 0) {
      try {
        const deletePromises = remark.images.map(image => 
          r2Service.deleteFile(image.filename)
        );
        await Promise.all(deletePromises);
        console.log(`Deleted ${remark.images.length} images from R2 for remark ${remarkId}`);
      } catch (error) {
        console.log('Warning: Some images could not be deleted from R2:', error.message);
        // Continue with remark deletion even if R2 cleanup fails
      }
    }

    plan.dailyRemarks.pull(remarkId);
    await plan.save();

    const populatedPlan = await SeasonPlan.findById(id)
      .populate('farmId', 'name location district cultivationZone totalArea')
      .populate('paddyVariety', 'name duration type characteristics');

    res.json({
      success: true,
      data: populatedPlan,
      message: 'Daily remark deleted successfully',
    });
  } catch (error) {
    console.error('Delete daily remark error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting daily remark',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Remove specific image from daily remark
const removeRemarkImage = async (req, res) => {
  try {
    const { id, remarkId } = req.params;
    const { imageFilename } = req.body;
    
    console.log('=== REMOVE IMAGE DEBUG ===');
    console.log('Season plan ID:', id);
    console.log('Remark ID:', remarkId);
    console.log('Image filename from body:', imageFilename);
    console.log('==========================');
    
    if (!imageFilename) {
      return res.status(400).json({
        success: false,
        message: 'Image filename is required',
      });
    }
    
    const plan = await SeasonPlan.findById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Season plan not found',
      });
    }

    // Check authorization
    if (plan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this season plan',
      });
    }

    // Find the daily remark
    const remark = plan.dailyRemarks.id(remarkId);
    if (!remark) {
      return res.status(404).json({
        success: false,
        message: 'Daily remark not found',
      });
    }

    // Find and remove the specific image
    const imageIndex = remark.images.findIndex(img => img.filename === imageFilename);
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found in remark',
      });
    }

    // Remove the image from the array
    remark.images.splice(imageIndex, 1);
    
    await plan.save();

    // Delete the image from Cloudflare R2
    try {
      await r2Service.deleteFile(imageFilename);
      console.log('Image deleted from R2:', imageFilename);
    } catch (error) {
      console.log('Warning: Could not delete image from R2:', imageFilename, error.message);
      // Continue execution even if R2 deletion fails
    }

    const populatedPlan = await SeasonPlan.findById(id)
      .populate('farmId', 'name district cultivationZone')
      .populate('paddyVariety', 'name duration type');

    res.json({
      success: true,
      data: populatedPlan,
      message: 'Image removed successfully',
    });
  } catch (error) {
    console.error('Remove remark image error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Add expense to season plan
// @route   POST /api/season-plans/:id/expenses
// @access  Private
const addExpense = async (req, res) => {
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

    // Check if user owns this season plan
    if (plan.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this season plan',
      });
    }

    const { 
      date, 
      category, 
      subcategory,
      description, 
      amount, 
      quantity,
      unit,
      unitPrice,
      vendor,
      receiptNumber,
      paymentMethod,
      remarks 
    } = req.body;

    // Calculate unit price if not provided
    let calculatedUnitPrice = unitPrice;
    if (!calculatedUnitPrice && quantity && quantity > 0) {
      calculatedUnitPrice = amount / quantity;
    }

    const newExpense = {
      date: new Date(date),
      category,
      subcategory,
      description,
      amount: parseFloat(amount),
      quantity: quantity ? parseFloat(quantity) : undefined,
      unit,
      unitPrice: calculatedUnitPrice,
      vendor,
      receiptNumber,
      paymentMethod: paymentMethod || 'cash',
      remarks,
    };

    plan.expenses.push(newExpense);
    await plan.save();

    // Get the added expense with its ID
    const addedExpense = plan.expenses[plan.expenses.length - 1];

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: {
        expense: addedExpense,
        totalExpenses: plan.totalExpenses,
        expensesByCategory: plan.expensesByCategory,
        costPerAcre: plan.costPerAcre,
      },
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding expense',
      error: error.message,
    });
  }
};

// @desc    Update expense in season plan
// @route   PUT /api/season-plans/:id/expenses/:expenseId
// @access  Private
const updateExpense = async (req, res) => {
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

    // Check if user owns this season plan
    if (plan.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this season plan',
      });
    }

    const expense = plan.expenses.id(req.params.expenseId);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    const { 
      date, 
      category, 
      subcategory,
      description, 
      amount, 
      quantity,
      unit,
      unitPrice,
      vendor,
      receiptNumber,
      paymentMethod,
      remarks 
    } = req.body;

    // Calculate unit price if not provided
    let calculatedUnitPrice = unitPrice;
    if (!calculatedUnitPrice && quantity && quantity > 0) {
      calculatedUnitPrice = amount / quantity;
    }

    // Update expense fields
    expense.date = new Date(date);
    expense.category = category;
    expense.subcategory = subcategory;
    expense.description = description;
    expense.amount = parseFloat(amount);
    expense.quantity = quantity ? parseFloat(quantity) : undefined;
    expense.unit = unit;
    expense.unitPrice = calculatedUnitPrice;
    expense.vendor = vendor;
    expense.receiptNumber = receiptNumber;
    expense.paymentMethod = paymentMethod || expense.paymentMethod;
    expense.remarks = remarks;
    expense.updatedAt = new Date();

    await plan.save();

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: {
        expense,
        totalExpenses: plan.totalExpenses,
        expensesByCategory: plan.expensesByCategory,
        costPerAcre: plan.costPerAcre,
      },
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating expense',
      error: error.message,
    });
  }
};

// @desc    Delete expense from season plan
// @route   DELETE /api/season-plans/:id/expenses/:expenseId
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const plan = await SeasonPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Season plan not found',
      });
    }

    // Check if user owns this season plan
    if (plan.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this season plan',
      });
    }

    const expense = plan.expenses.id(req.params.expenseId);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    expense.deleteOne();
    await plan.save();

    res.json({
      success: true,
      message: 'Expense deleted successfully',
      data: {
        totalExpenses: plan.totalExpenses,
        expensesByCategory: plan.expensesByCategory,
        costPerAcre: plan.costPerAcre,
      },
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting expense',
      error: error.message,
    });
  }
};

// @desc    Get expense summary for season plan
// @route   GET /api/season-plans/:id/expenses/summary
// @access  Private
const getExpenseSummary = async (req, res) => {
  try {
    const plan = await SeasonPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Season plan not found',
      });
    }

    // Check if user owns this season plan
    if (plan.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this season plan',
      });
    }

    // Calculate monthly expenses
    const monthlyExpenses = {};
    plan.expenses.forEach(expense => {
      const monthKey = expense.date.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyExpenses[monthKey]) {
        monthlyExpenses[monthKey] = 0;
      }
      monthlyExpenses[monthKey] += expense.amount;
    });

    // Calculate average expense per category
    const categoryStats = {};
    plan.expenses.forEach(expense => {
      if (!categoryStats[expense.category]) {
        categoryStats[expense.category] = { total: 0, count: 0, items: [] };
      }
      categoryStats[expense.category].total += expense.amount;
      categoryStats[expense.category].count += 1;
      categoryStats[expense.category].items.push({
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
      });
    });

    // Calculate averages
    Object.keys(categoryStats).forEach(category => {
      categoryStats[category].average = categoryStats[category].total / categoryStats[category].count;
    });

    res.json({
      success: true,
      data: {
        totalExpenses: plan.totalExpenses,
        expensesByCategory: plan.expensesByCategory,
        costPerAcre: plan.costPerAcre,
        monthlyExpenses,
        categoryStats,
        expenseCount: plan.expenses.length,
        cultivatingArea: plan.cultivatingArea,
      },
    });
  } catch (error) {
    console.error('Get expense summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expense summary',
      error: error.message,
    });
  }
};

module.exports = {
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
};
