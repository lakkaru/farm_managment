const { MongoClient } = require('mongodb');

async function inspectFarm() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('farm-management');
  
  const farms = await db.collection('farms').find({}).toArray();
  console.log('Total farms:', farms.length);
  
  if (farms.length > 0) {
    const farm = farms[0];
    console.log('\nFirst farm structure:');
    console.log('ID:', farm._id);
    console.log('Name:', farm.name);
    console.log('District:', farm.district);
    console.log('totalArea:', farm.totalArea);
    console.log('totalArea type:', typeof farm.totalArea);
    console.log('totalArea.value:', farm.totalArea?.value);
    console.log('totalArea.value type:', typeof farm.totalArea?.value);
    console.log('Is totalArea an object?', typeof farm.totalArea === 'object' && farm.totalArea !== null);
    console.log('Does totalArea have .toFixed method?', typeof farm.totalArea?.toFixed === 'function');
    
    // Test our migration condition
    const migrationCondition = farm.totalArea?.value && 
                             typeof farm.totalArea === 'object' && 
                             !farm.totalArea.toFixed;
    console.log('Would migrate:', migrationCondition);
  }
  
  await client.close();
}

inspectFarm().catch(console.error);
