// API Configuration with multiple CORS proxy options
const API_CONFIGS = {
  // Direct connection (requires backend CORS configuration)
  direct: 'http://localhost:8080',
  
  // CORS proxy options
  corsProxy1: 'https://cors-anywhere.herokuapp.com/http://localhost:8080',
  corsProxy2: 'https://api.allorigins.win/raw?url=http://localhost:8080',
  corsProxy3: 'https://thingproxy.freeboard.io/fetch/http://localhost:8080',
  
  // Local development proxy (if using Create React App proxy)
  localProxy: '/api'
};

// Environment-based configuration
const getApiBaseUrl = () => {
  // Check if we're in development and if backend is accessible
  if (process.env.NODE_ENV === 'development') {
    // Try direct connection first, fallback to proxy
    return API_CONFIGS.direct;
  }
  
  // Production - use direct connection
  return API_CONFIGS.direct;
};

// CORS proxy fallback
const getCorsProxyUrl = (fallbackIndex = 0) => {
  const proxies = [
    API_CONFIGS.corsProxy1,
    API_CONFIGS.corsProxy2,
    API_CONFIGS.corsProxy3
  ];
  
  return proxies[fallbackIndex] || API_CONFIGS.direct;
};

export const API_BASE_URL = getApiBaseUrl();
export const CORS_PROXY_URL = getCorsProxyUrl();

// Helper function to switch between different proxy options
export const switchToProxy = (proxyIndex = 0) => {
  return getCorsProxyUrl(proxyIndex);
};

export default {
  API_BASE_URL,
  CORS_PROXY_URL,
  switchToProxy,
  configs: API_CONFIGS
};
