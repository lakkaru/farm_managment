const mongoose = require('mongoose');
const Farm = require('./src/models/Farm');

async function inspectFarms() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://lakkaru:bYPUhnq7OYqcYLQq@cluster0.thbzlwh.mongodb.net/farm_mgt?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB');
    
    // Get farms from database
    const farms = await Farm.find({});
    console.log(`Found ${farms.length} farms`);
    
    if (farms.length > 0) {
      const farm = farms[0];
      console.log('\nFirst farm raw data:');
      console.log('_id:', farm._id);
      console.log('name:', farm.name);
      console.log('totalArea:', farm.totalArea);
      console.log('totalArea type:', typeof farm.totalArea);
      console.log('district:', farm.district);
      console.log('cultivationZone:', farm.cultivationZone);
      
      console.log('\nFull farm object:');
      console.log(JSON.stringify(farm.toJSON(), null, 2));
      
      // Also check raw MongoDB document
      console.log('\nChecking raw MongoDB document:');
      const rawFarm = await mongoose.connection.collection('farms').findOne({});
      console.log('Raw totalArea:', rawFarm.totalArea);
      console.log('Raw totalArea type:', typeof rawFarm.totalArea);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

inspectFarms();
