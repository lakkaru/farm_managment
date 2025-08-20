const mongoose = require('mongoose');
const PaddyVariety = require('../src/models/PaddyVariety');
require('dotenv').config();

const paddyVarieties = [
  {
    name: 'BG 300',
    duration: 105,
    type: 'Short Duration',
    characteristics: {
      yield: 4.5,
      resistance: ['Brown Plant Hopper', 'Bacterial Leaf Blight'],
      suitableZones: ['WL1', 'WL2', 'WM1', 'DL1'],
    },
    description: 'High-yielding short-duration variety suitable for both seasons',
  },
  {
    name: 'BG 352',
    duration: 110,
    type: 'Short Duration',
    characteristics: {
      yield: 4.2,
      resistance: ['Blast', 'Brown Plant Hopper'],
      suitableZones: ['WL1', 'WL2', 'WM1', 'WM2'],
    },
    description: 'Disease-resistant variety with good grain quality',
  },
  {
    name: 'BG 360',
    duration: 115,
    type: 'Medium Duration',
    characteristics: {
      yield: 4.8,
      resistance: ['Blast', 'Bacterial Leaf Blight'],
      suitableZones: ['WL1', 'WL2', 'WM1'],
    },
    description: 'High-yielding variety with excellent grain quality',
  },
  {
    name: 'BG 366',
    duration: 120,
    type: 'Medium Duration',
    characteristics: {
      yield: 5.0,
      resistance: ['Brown Plant Hopper', 'Sheath Blight'],
      suitableZones: ['WL1', 'WL2', 'WM1', 'WM2'],
    },
    description: 'Premium quality rice with high market value',
  },
  {
    name: 'BG 379-2',
    duration: 125,
    type: 'Medium Duration',
    characteristics: {
      yield: 4.6,
      resistance: ['Blast', 'Brown Plant Hopper', 'White Backed Plant Hopper'],
      suitableZones: ['WL1', 'WL2', 'WM1', 'DL1'],
    },
    description: 'Multi-resistant variety suitable for various conditions',
  },
  {
    name: 'BG 94-1',
    duration: 130,
    type: 'Long Duration',
    characteristics: {
      yield: 5.2,
      resistance: ['Blast', 'Bacterial Leaf Blight'],
      suitableZones: ['WL1', 'WL2'],
    },
    description: 'High-yielding traditional variety',
  },
  {
    name: 'AT 362',
    duration: 120,
    type: 'Medium Duration',
    characteristics: {
      yield: 4.7,
      resistance: ['Blast', 'Brown Plant Hopper'],
      suitableZones: ['WM1', 'WM2', 'WM3'],
    },
    description: 'Suitable for intermediate climate zones',
  },
  {
    name: 'AT 405',
    duration: 110,
    type: 'Short Duration',
    characteristics: {
      yield: 4.3,
      resistance: ['Blast', 'Bacterial Leaf Blight'],
      suitableZones: ['WM1', 'WM2', 'WU1'],
    },
    description: 'Cold-tolerant variety for up-country regions',
  },
  {
    name: 'H 4',
    duration: 135,
    type: 'Long Duration',
    characteristics: {
      yield: 5.5,
      resistance: ['Blast'],
      suitableZones: ['WL1', 'WL2', 'WL3'],
    },
    description: 'Traditional high-yielding variety for wet zones',
  },
  {
    name: 'H 7',
    duration: 140,
    type: 'Long Duration',
    characteristics: {
      yield: 5.3,
      resistance: ['Blast', 'Bacterial Leaf Blight'],
      suitableZones: ['WL1', 'WL2'],
    },
    description: 'Long-duration variety with excellent eating quality',
  },
];

const seedPaddyVarieties = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await PaddyVariety.deleteMany();
    console.log('Cleared existing paddy varieties');

    // Insert seed data
    await PaddyVariety.insertMany(paddyVarieties);
    console.log('Paddy varieties seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedPaddyVarieties();
