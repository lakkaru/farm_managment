// Simple script to test authentication and farm creation
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAuth() {
  console.log('Testing authentication and farm creation...\n');
  
  try {
    // Test login with sample credentials
    console.log('1. Testing login endpoint...');
    const loginResponse = await axios.post(`${API_BASE}/users/login`, {
      email: 'test@example.com', // You'll need to use your actual credentials
      password: 'password123'
    });
    
    console.log('✅ Login successful');
    console.log('User ID:', loginResponse.data.data._id);
    console.log('Token exists:', !!loginResponse.data.data.token);
    
    const token = loginResponse.data.data.token;
    
    // Test farm creation
    console.log('\n2. Testing farm creation...');
    const farmData = {
      name: 'Test Farm Debug',
      farmType: 'crop',
      location: {
        address: '123 Test Street',
        city: 'Colombo',
        state: 'Western',
        country: 'Sri Lanka',
        zipCode: '10001'
      },
      totalArea: {
        value: 10,
        unit: 'acres'
      }
    };
    
    const farmResponse = await axios.post(`${API_BASE}/farms`, farmData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Farm creation successful');
    console.log('Farm ID:', farmResponse.data.data._id);
    console.log('Farm Name:', farmResponse.data.data.name);
    
  } catch (error) {
    console.log('❌ Error occurred:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data.message);
      console.log('Full response:', error.response.data);
    } else if (error.request) {
      console.log('Network error - no response received');
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Add note about usage
console.log('Note: Update the email/password in this script with your actual credentials before running');
console.log('Run with: node debug-auth.js\n');

// Uncomment the next line to run the test
// testAuth();
