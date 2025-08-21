const mongoose = require('mongoose');
const Farm = require('../src/models/Farm');

require('dotenv').config();

const inspectFarmData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find a farm and log its structure
    const farm = await Farm.findOne({}).lean();
    if (farm) {
      console.log('Farm data structure:');
      console.log(JSON.stringify(farm, null, 2));
    } else {
      console.log('No farms found in database');
    }
    
  } catch (error) {
    console.error('Inspection failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run inspection
inspectFarmData();
