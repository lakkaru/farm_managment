const PaddyVariety = require('../models/PaddyVariety');
const { validationResult } = require('express-validator');

// @desc    Get all paddy varieties
// @route   GET /api/paddy-varieties
// @access  Private
const getPaddyVarieties = async (req, res) => {
  try {
    const { type, zone, active = true } = req.query;
    
    const filter = { isActive: active === 'true' };
    
    if (type) {
      filter.type = type;
    }
    
    if (zone) {
      filter['characteristics.suitableZones'] = { $in: [zone] };
    }

    const varieties = await PaddyVariety.find(filter).sort({ type: 1, duration: 1 });
    
    res.json({
      success: true,
      count: varieties.length,
      data: varieties,
    });
  } catch (error) {
    console.error('Get paddy varieties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching paddy varieties',
      error: error.message,
    });
  }
};

// @desc    Get single paddy variety
// @route   GET /api/paddy-varieties/:id
// @access  Private
const getPaddyVariety = async (req, res) => {
  try {
    const variety = await PaddyVariety.findById(req.params.id);
    
    if (!variety) {
      return res.status(404).json({
        success: false,
        message: 'Paddy variety not found',
      });
    }

    res.json({
      success: true,
      data: variety,
    });
  } catch (error) {
    console.error('Get paddy variety error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching paddy variety',
      error: error.message,
    });
  }
};

// @desc    Create new paddy variety
// @route   POST /api/paddy-varieties
// @access  Private (Admin only)
const createPaddyVariety = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const variety = await PaddyVariety.create(req.body);
    
    res.status(201).json({
      success: true,
      data: variety,
      message: 'Paddy variety created successfully',
    });
  } catch (error) {
    console.error('Create paddy variety error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Paddy variety with this name already exists',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating paddy variety',
      error: error.message,
    });
  }
};

// @desc    Update paddy variety
// @route   PUT /api/paddy-varieties/:id
// @access  Private (Admin only)
const updatePaddyVariety = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const variety = await PaddyVariety.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!variety) {
      return res.status(404).json({
        success: false,
        message: 'Paddy variety not found',
      });
    }

    res.json({
      success: true,
      data: variety,
      message: 'Paddy variety updated successfully',
    });
  } catch (error) {
    console.error('Update paddy variety error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating paddy variety',
      error: error.message,
    });
  }
};

// @desc    Delete paddy variety (soft delete)
// @route   DELETE /api/paddy-varieties/:id
// @access  Private (Admin only)
const deletePaddyVariety = async (req, res) => {
  try {
    const variety = await PaddyVariety.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!variety) {
      return res.status(404).json({
        success: false,
        message: 'Paddy variety not found',
      });
    }

    res.json({
      success: true,
      message: 'Paddy variety deactivated successfully',
    });
  } catch (error) {
    console.error('Delete paddy variety error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting paddy variety',
      error: error.message,
    });
  }
};

module.exports = {
  getPaddyVarieties,
  getPaddyVariety,
  createPaddyVariety,
  updatePaddyVariety,
  deletePaddyVariety,
};
