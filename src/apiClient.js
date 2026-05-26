// apiClient.js - Centralized API client with runtime config
import { loadConfig } from './config';

let API_BASE_URL = null;
let configPromise = null;
let isInitialized = false;

// Initialize configuration once
const initConfig = () => {
  if (!configPromise) {
    configPromise = loadConfig()
      .then(config => {
        API_BASE_URL = config.apiBaseUrl;
        isInitialized = true;
        console.log('✅ API Client initialized with URL:', API_BASE_URL);
        return API_BASE_URL;
      })
      .catch(error => {
        console.error('❌ Failed to load API config:', error);
        // Fallback to environment variable
        API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        isInitialized = true;
        console.log('⚠️  Using fallback URL:', API_BASE_URL);
        return API_BASE_URL;
      });
  }
  return configPromise;
};

// Ensure config is loaded before making API calls
export const getApiUrl = async () => {
  if (!isInitialized) {
    await initConfig();
  }
  return API_BASE_URL;
};

// Synchronous getter (only use after initialization)
export const getApiUrlSync = () => {
  if (!isInitialized) {
    console.warn('⚠️  API not initialized yet, using fallback');
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  }
  return API_BASE_URL;
};

// Helper function to make API calls with proper headers
export const apiRequest = async (endpoint, options = {}) => {
  const baseUrl = await getApiUrl();
  const token = localStorage.getItem("access_token");
  
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const url = `${baseUrl}${endpoint}`;
  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error(`❌ Network Error:`, error);
    throw error;
  }
};

// Helper for GET requests
export const apiGet = async (endpoint) => {
  return apiRequest(endpoint, { method: 'GET' });
};

// Helper for POST requests
export const apiPost = async (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Helper for PUT requests
export const apiPut = async (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Helper for DELETE requests
export const apiDelete = async (endpoint) => {
  return apiRequest(endpoint, { method: 'DELETE' });
};

// Wait for initialization
export const waitForInit = () => {
  return initConfig();
};

// Initialize on module load
initConfig();
