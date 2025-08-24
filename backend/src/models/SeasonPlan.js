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
  // Remove district requirement as it will come from farm
  climateZone: {
    type: String,
    required: [true, 'Climate zone is required'],
  },
  irrigationMethod: {
    type: String,
    required: [true, 'Irrigation method is required'],
    enum: ['Rain fed', 'Under irrigation'],
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
    actualStartDate: Date,
    actualEndDate: Date,
    implementedDate: Date, // Single date for when the stage was actually implemented
    notes: String,
  }],
  fertilizerSchedule: [{
    stage: String,
    date: Date,
    fertilizers: {
      urea: Number,
      tsp: Number,
      mop: Number,
      zincSulphate: Number,
    },
    description: String,
    applied: {
      type: Boolean,
      default: false,
    },
    applicationDate: Date, // Planned date
    implementedDate: Date, // Actual date when applied
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

// Virtual for getting farm district
seasonPlanSchema.virtual('district').get(function() {
  return this.farmId?.district;
});

const SeasonPlan = mongoose.model('SeasonPlan', seasonPlanSchema);

module.exports = SeasonPlan;
