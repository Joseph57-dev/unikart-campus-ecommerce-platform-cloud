// Simple test to verify frontend-backend connection
async function testConnection() {
  try {
    console.log('Testing backend connection...');

    // Test health endpoint
    const healthResponse = await fetch('http://unikart-alb-296069847.eu-north-1.elb.amazonaws.com/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);

    // Test products endpoint
    const productsResponse = await fetch('http://unikart-alb-296069847.eu-north-1.elb.amazonaws.com/api/products');
    const productsData = await productsResponse.json();
    console.log('Products API:', productsData);

    console.log('✅ Frontend-backend connection successful!');
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
