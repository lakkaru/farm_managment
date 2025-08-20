const mongoose = require('mongoose');

const paddyVarietySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Paddy variety name is required'],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [90, 'Duration must be at least 90 days'],
    max: [180, 'Duration cannot exceed 180 days'],
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['Short Duration', 'Medium Duration', 'Long Duration'],
  },
  characteristics: {
    yield: {
      type: Number,
      min: 0,
    },
    resistance: [String], // Disease/pest resistance
    suitableZones: [String], // Climate zones suitable for this variety
  },
  description: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for harvest date calculation
paddyVarietySchema.virtual('harvestDate').get(function() {
  if (this.plantingDate) {
    const harvest = new Date(this.plantingDate);
    harvest.setDate(harvest.getDate() + this.duration);
    return harvest;
  }
  return null;
});

// Index for better search performance
paddyVarietySchema.index({ name: 1, type: 1 });
paddyVarietySchema.index({ duration: 1 });
paddyVarietySchema.index({ isActive: 1 });

const PaddyVariety = mongoose.model('PaddyVariety', paddyVarietySchema);

module.exports = PaddyVariety;
