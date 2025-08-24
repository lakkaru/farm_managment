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
      req.body.irrigationMethod,
      farm.district,
      paddyVariety.duration
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
};
