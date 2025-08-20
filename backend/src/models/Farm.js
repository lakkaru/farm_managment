const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true,
    maxlength: [100, 'Farm name cannot be more than 100 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'USA'
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    }
  },
  totalArea: {
    value: {
      type: Number,
      required: [true, 'Total area is required'],
      min: [0, 'Area cannot be negative']
    },
    unit: {
      type: String,
      enum: ['acres', 'hectares', 'square_feet', 'square_meters'],
      default: 'acres'
    }
  },
  farmType: {
    type: String,
    enum: ['crop', 'livestock', 'mixed', 'organic', 'dairy', 'poultry'],
    required: [true, 'Farm type is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  managers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  establishedDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date
  }],
  contactInfo: {
    phone: String,
    email: String,
    website: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for crops associated with this farm
farmSchema.virtual('crops', {
  ref: 'Crop',
  localField: '_id',
  foreignField: 'farm'
});

// Virtual for livestock associated with this farm
farmSchema.virtual('livestock', {
  ref: 'Livestock',
  localField: '_id',
  foreignField: 'farm'
});

// Index for geospatial queries
farmSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Farm', farmSchema);
