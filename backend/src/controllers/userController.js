const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, profile } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  if (!profile || !profile.firstName || !profile.lastName) {
    return res.status(400).json({
      success: false,
      message: 'Please provide first name and last name',
    });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists',
    });
  }

  // Create user
  const user = await User.create({
    email,
    password, // Let the pre-save hook handle hashing
    profile: {
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
    contact: {
      phone: profile.phone || '',
    },
    role: profile.role || 'farm_owner',
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        profile: user.profile,
        token: generateToken(user._id),
      },
      message: 'User registered successfully',
    });
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid user data',
    });
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check password using the User model's method
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Update last login
  user.lastLogin = new Date();
  user.resetLoginAttempts();
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      email: user.email,
      profile: user.profile,
      role: user.role,
      token: generateToken(user._id),
    },
    message: 'Login successful',
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        profile: user.profile,
        createdAt: user.createdAt,
      },
    });
  } else {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.email = req.body.email || user.email;
    user.profile.firstName = req.body.profile?.firstName || user.profile.firstName;
    user.profile.lastName = req.body.profile?.lastName || user.profile.lastName;
    user.profile.phone = req.body.profile?.phone || user.profile.phone;
    user.profile.role = req.body.profile?.role || user.profile.role;

    // Update password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        email: updatedUser.email,
        profile: updatedUser.profile,
        token: generateToken(updatedUser._id),
      },
      message: 'Profile updated successfully',
    });
  } else {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
};
