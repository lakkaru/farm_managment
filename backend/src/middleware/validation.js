const Joi = require('joi');
const AppError = require('../utils/AppError');
const { SRI_LANKAN_DISTRICTS } = require('../constants/districts');
const { SOIL_TYPE_NAMES } = require('../constants/soilTypes');

// Get list of valid district names
const validDistricts = SRI_LANKAN_DISTRICTS.map(d => d.name);

// Farm validation schema
const farmSchema = Joi.object({
  name: Joi.string().required().max(100).trim(),
  description: Joi.string().max(500).allow(''), // Allow empty strings
  farmType: Joi.string().required().valid('crop', 'livestock', 'mixed', 'organic', 'dairy', 'poultry'),
  
  // Root level district and zone fields (new structure)
  district: Joi.string().required().valid(...validDistricts).trim(),
  cultivationZone: Joi.string().valid(
    'WL1', 'WL2', 'WL3', 'WM1', 'WM2', 'WM3', 'WU1',
    'DL1', 'DL2', 'DL3', 'IL1', 'IM1'
  ).trim(),
  
  // Soil type field (new)
  soilType: Joi.string().valid(...SOIL_TYPE_NAMES).trim(),
  
  location: Joi.object({
    address: Joi.string().required().trim(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90),
      longitude: Joi.number().min(-180).max(180)
    }),
    country: Joi.string().trim().default('Sri Lanka'),
    zipCode: Joi.string().trim().allow('')
  }).required(),
  
  totalArea: Joi.object({
    value: Joi.number().required().min(0),
    unit: Joi.string().valid('acres', 'hectares', 'sq meters', 'sq feet').default('acres')
  }).required(),
  
  cultivatedArea: Joi.object({
    value: Joi.number().min(0),
    unit: Joi.string().valid('acres', 'hectares', 'sq meters', 'sq feet').default('acres')
  }),
  
  establishedDate: Joi.date(),
  certifications: Joi.array().items(Joi.object({
    name: Joi.string(),
    issuedBy: Joi.string(),
    issuedDate: Joi.date(),
    expiryDate: Joi.date()
  })),
  contactInfo: Joi.object({
    phone: Joi.string(),
    email: Joi.string().email(),
    website: Joi.string().uri()
  })
});

// Crop validation schema
const cropSchema = Joi.object({
  name: Joi.string().required().trim(),
  variety: Joi.string().required().trim(),
  category: Joi.string().required().valid('grains', 'vegetables', 'fruits', 'legumes', 'herbs', 'flowers', 'other'),
  farm: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/), // MongoDB ObjectId
  field: Joi.object({
    name: Joi.string().required().trim(),
    area: Joi.object({
      value: Joi.number().required().min(0),
      unit: Joi.string().valid('acres', 'hectares', 'square_feet', 'square_meters').default('acres')
    }).required(),
    soilType: Joi.string().valid('clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky')
  }).required(),
  plantingDate: Joi.date().required(),
  expectedHarvestDate: Joi.date().required(),
  actualHarvestDate: Joi.date(),
  quantity: Joi.object({
    planted: Joi.object({
      value: Joi.number(),
      unit: Joi.string()
    }),
    harvested: Joi.object({
      value: Joi.number(),
      unit: Joi.string()
    })
  }),
  status: Joi.string().valid('planned', 'planted', 'growing', 'harvested', 'failed').default('planned'),
  irrigation: Joi.object({
    method: Joi.string().valid('drip', 'sprinkler', 'flood', 'furrow', 'manual')
  }),
  costs: Joi.object({
    seeds: Joi.number().min(0),
    fertilizers: Joi.number().min(0),
    pesticides: Joi.number().min(0),
    irrigation: Joi.number().min(0),
    labor: Joi.number().min(0),
    equipment: Joi.number().min(0),
    other: Joi.number().min(0)
  }),
  notes: Joi.string(),
  images: Joi.array().items(Joi.string())
});

// User registration validation schema
const userRegistrationSchema = Joi.object({
  profile: Joi.object({
    firstName: Joi.string().required().max(50).trim(),
    lastName: Joi.string().required().max(50).trim(),
    dateOfBirth: Joi.date(),
    gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say')
  }).required(),
  email: Joi.string().required().email().lowercase().trim(),
  password: Joi.string().required().min(6),
  role: Joi.string().valid('admin', 'farm_owner', 'farm_manager', 'worker', 'viewer').default('farm_owner'),
  contact: Joi.object({
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      zipCode: Joi.string()
    })
  })
});

// User login validation schema
const userLoginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required()
});

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      throw new AppError(errors.join(', '), 400);
    }
    
    next();
  };
};

// Specific validation middleware functions
const validateFarm = validate(farmSchema);
const validateCrop = validate(cropSchema);
const validateUserRegistration = validate(userRegistrationSchema);
const validateUserLogin = validate(userLoginSchema);

module.exports = {
  validate,
  validateFarm,
  validateCrop,
  validateUserRegistration,
  validateUserLogin,
  farmSchema,
  cropSchema,
  userRegistrationSchema,
  userLoginSchema
};
