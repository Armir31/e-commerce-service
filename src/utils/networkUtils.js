// Network utility functions
export const checkBackendStatus = async () => {
  try {
    const response = await fetch('/api/category', { 
      method: 'GET',
      mode: 'cors',
      timeout: 5000
    });
    return { status: 'online', response };
  } catch (error) {
    return { status: 'offline', error: error.message };
  }
};

export const testBackendConnection = async () => {
  const endpoints = [
    '/api/category',
    '/api/product',
    '/api/costumer',
    '/api/order',
    '/api/payment',
    '/api/business'
  ];

  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { 
        method: 'GET',
        mode: 'cors',
        timeout: 3000
      });
      results[endpoint] = { status: response.status, accessible: true };
    } catch (error) {
      results[endpoint] = { status: 'error', accessible: false, error: error.message };
    }
  }
  
  return results;
};

export const getConnectionStatus = () => {
  return {
    frontend: 'http://localhost:3000',
    backend: 'http://localhost:8080',
    proxy: process.env.NODE_ENV === 'development' ? 'Enabled (package.json)' : 'Disabled',
    cors: process.env.NODE_ENV === 'development' ? 'Handled by proxy' : 'CORS proxy required'
  };
};

export const switchToDirectConnection = () => {
  // This function can be used to dynamically switch connection methods
  console.log('Switching to direct connection...');
  console.log('Make sure your backend has CORS configured for http://localhost:3000');
};

export const switchToProxyConnection = () => {
  // This function can be used to dynamically switch to proxy
  console.log('Switching to proxy connection...');
  console.log('This will route requests through a CORS proxy');
};
