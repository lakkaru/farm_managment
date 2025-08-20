const mongoose = require('mongoose');

const seasonPlanSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: [true, 'Farm ID is required'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  season: {
    type: String,
    required: [true, 'Season is required'],
    enum: ['maha', 'yala'],
  },
  district: {
    type: String,
    required: [true, 'District is required'],
  },
  climateZone: {
    type: String,
    required: [true, 'Climate zone is required'],
  },
  irrigationMethod: {
    type: String,
    required: [true, 'Irrigation method is required'],
    enum: ['Rain-fed', 'Irrigated (Tank)', 'Irrigated (River)', 'Irrigated (Tube well)', 'Irrigated (Canal)'],
  },
  soilCondition: {
    type: String,
    required: [true, 'Soil condition is required'],
    enum: ['Sandy', 'Clay', 'Loam', 'Sandy Loam', 'Clay Loam', 'Silt Loam'],
  },
  paddyVariety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaddyVariety',
    required: [true, 'Paddy variety is required'],
  },
  cultivatingArea: {
    type: Number,
    required: [true, 'Cultivating area is required'],
    min: [0.1, 'Cultivating area must be at least 0.1 acres'],
  },
  cultivationDate: {
    type: Date,
    required: [true, 'Cultivation date is required'],
  },
  growingStages: [{
    stage: String,
    startDate: Date,
    endDate: Date,
    description: String,
    completed: {
      type: Boolean,
      default: false,
    },
    notes: String,
  }],
  fertilizerSchedule: [{
    stage: String,
    date: Date,
    fertilizers: {
      urea: Number,
      tsp: Number,
      mop: Number,
    },
    totalCost: Number,
    description: String,
    applied: {
      type: Boolean,
      default: false,
    },
    applicationDate: Date,
    notes: String,
  }],
  status: {
    type: String,
    enum: ['planned', 'active', 'completed', 'cancelled'],
    default: 'planned',
  },
  expectedHarvest: {
    date: Date,
    estimatedYield: Number,
  },
  actualHarvest: {
    date: Date,
    actualYield: Number,
    quality: String,
    notes: String,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for calculating total fertilizer cost
seasonPlanSchema.virtual('totalFertilizerCost').get(function() {
  return this.fertilizerSchedule.reduce((total, app) => total + (app.totalCost || 0), 0);
});

// Virtual for calculating plan duration
seasonPlanSchema.virtual('planDuration').get(function() {
  if (this.expectedHarvest?.date && this.cultivationDate) {
    const diffTime = Math.abs(this.expectedHarvest.date - this.cultivationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Indexes for better query performance
seasonPlanSchema.index({ farmId: 1, userId: 1 });
seasonPlanSchema.index({ season: 1, cultivationDate: 1 });
seasonPlanSchema.index({ status: 1 });
seasonPlanSchema.index({ district: 1, climateZone: 1 });

const SeasonPlan = mongoose.model('SeasonPlan', seasonPlanSchema);

module.exports = SeasonPlan;
