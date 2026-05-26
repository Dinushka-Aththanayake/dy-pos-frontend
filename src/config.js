// config.js - Runtime configuration loader
let config = null;

export const loadConfig = async () => {
  if (config) {
    console.log('✅ Config already loaded:', config);
    return config;
  }
  
  try {
    console.log('📡 Loading config.json...');
    const response = await fetch('./config.json');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    config = await response.json();
    console.log('✅ Config loaded successfully:', config);
    return config;
  } catch (error) {
    console.error('❌ Failed to load config.json:', error);
    console.log('⚠️  Using fallback configuration');
    
    // Fallback to environment variable or default
    config = {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    };
    
    console.log('⚠️  Fallback config:', config);
    return config;
  }
};

export const getApiBaseUrl = () => {
  if (!config) {
    throw new Error('Config not loaded. Call loadConfig() first.');
  }
  return config.apiBaseUrl;
};

export const getConfig = () => config;
