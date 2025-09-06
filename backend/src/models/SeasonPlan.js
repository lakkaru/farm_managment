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
  dailyRemarks: [{
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ['general', 'weather', 'pest', 'disease', 'fertilizer', 'irrigation', 'growth', 'other'],
      default: 'general',
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    images: [{
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  expenses: [{
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'seeds', 'fertilizer', 'pesticide', 'herbicide', 'fungicide',
        'labor', 'machinery', 'fuel', 'irrigation', 'transportation',
        'equipment', 'land_preparation', 'harvesting', 'storage',
        'certification', 'insurance', 'utilities', 'other'
      ],
    },
    subcategory: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      maxlength: 200,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be positive'],
    },
    quantity: {
      type: Number,
      min: [0, 'Quantity must be positive'],
    },
    unit: {
      type: String,
      enum: ['kg', 'g', 'L', 'ml', 'units', 'hours', 'days', 'acres', 'meters', 'other'],
    },
    unitPrice: {
      type: Number,
      min: [0, 'Unit price must be positive'],
    },
    vendor: {
      type: String,
      maxlength: 100,
    },
    receiptNumber: {
      type: String,
      maxlength: 50,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'check', 'card', 'credit', 'other'],
      default: 'cash',
    },
    remarks: {
      type: String,
      maxlength: 500,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }],
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

// Virtual for calculating total expenses
seasonPlanSchema.virtual('totalExpenses').get(function() {
  if (!this.expenses || this.expenses.length === 0) return 0;
  return this.expenses.reduce((total, expense) => total + expense.amount, 0);
});

// Virtual for calculating expenses by category
seasonPlanSchema.virtual('expensesByCategory').get(function() {
  if (!this.expenses || this.expenses.length === 0) return {};
  
  const categoryTotals = {};
  this.expenses.forEach(expense => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });
  
  return categoryTotals;
});

// Virtual for calculating cost per acre
seasonPlanSchema.virtual('costPerAcre').get(function() {
  const total = this.totalExpenses;
  if (total === 0 || !this.cultivatingArea) return 0;
  return total / this.cultivatingArea;
});

// Virtual for getting farm district
seasonPlanSchema.virtual('district').get(function() {
  return this.farmId?.district;
});

// Indexes for better query performance
seasonPlanSchema.index({ farmId: 1, userId: 1 });
seasonPlanSchema.index({ season: 1, cultivationDate: 1 });
seasonPlanSchema.index({ status: 1 });
seasonPlanSchema.index({ 'expenses.date': 1 });
seasonPlanSchema.index({ 'expenses.category': 1 });

const SeasonPlan = mongoose.model('SeasonPlan', seasonPlanSchema);

module.exports = SeasonPlan;
