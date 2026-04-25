const axios = require('axios');

const testRegister = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/auth/register', {
      name: 'Test User',
      email: 'test' + Date.now() + '@example.com',
      password: 'password123'
    });
    console.log('Registration successful:', res.data);
  } catch (err) {
    console.error('Registration failed:', err.response?.status, err.response?.data);
  }
};

testRegister();
