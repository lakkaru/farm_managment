const axios = require('axios');

// Test user registration
const testRegistration = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/users/register', {
      email: 'test@example.com',
      password: '123456',
      profile: {
        firstName: 'Test',
        lastName: 'User',
        role: 'farm_owner',
        phone: '1234567890'
      }
    });
    
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    return null;
  }
};

// Test user login
const testLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/users/login', {
      email: 'test@example.com',
      password: '123456'
    });
    
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    return null;
  }
};

// Run tests
const runTests = async () => {
  console.log('Testing Farm Management API...\n');
  
  console.log('1. Testing User Registration:');
  const registerResult = await testRegistration();
  
  console.log('\n2. Testing User Login:');
  const loginResult = await testLogin();
  
  console.log('\nTests completed.');
};

runTests();
