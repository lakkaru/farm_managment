const mongoose = require('mongoose');
const Farm = require('../src/models/Farm');

require('dotenv').config();

const migrateExistingFarms = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Use raw MongoDB collection to access documents with nested totalArea
    const db = mongoose.connection.db;
    const farmsCollection = db.collection('farms');

    // Find all farms with nested totalArea structure
    const farms = await farmsCollection.find({
      'totalArea.value': { $exists: true }
    }).toArray();
    
    console.log(`Found ${farms.length} farms with nested totalArea to migrate`);

    let updated = 0;
    for (const farm of farms) {
      const updateFields = {};

      // Migrate totalArea from nested structure to simple number
      if (farm.totalArea && typeof farm.totalArea === 'object' && farm.totalArea.value !== undefined) {
        updateFields.totalArea = farm.totalArea.value;
        console.log(`Migrating farm "${farm.name}": totalArea from ${JSON.stringify(farm.totalArea)} to ${farm.totalArea.value}`);
      }

      // Migrate district from location to top-level if not already present
      if (farm.location?.district && !farm.district) {
        updateFields.district = farm.location.district;
      }

      // Migrate cultivationZone from location to top-level if not already present
      if (farm.location?.cultivationZone && !farm.cultivationZone) {
        updateFields.cultivationZone = farm.location.cultivationZone;
      }

      // Set default soilType if not present
      if (!farm.soilType) {
        updateFields.soilType = 'Loamy';
      }

      if (Object.keys(updateFields).length > 0) {
        await farmsCollection.updateOne(
          { _id: farm._id },
          { $set: updateFields }
        );
        updated++;
        console.log(`Updated farm: ${farm.name}`);
      }
    }

    console.log(`Migration completed. Updated ${updated} farms.`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run migration
migrateExistingFarms();
