// employeeService.js - Service specifically for employee-related API calls
import { loadConfig } from './config';

let API_BASE_URL = null;
let configLoaded = false;

// Initialize API URL once
const initApiUrl = async () => {
  if (!configLoaded) {
    const config = await loadConfig();
    API_BASE_URL = config.apiBaseUrl;
    configLoaded = true;
    console.log('Employee Service initialized with URL:', API_BASE_URL);
  }
  return API_BASE_URL;
};

/**
 * Fetch all employees with proper error handling and logging
 * This fixes the issue where employees/findAll returns 200 with null values
 */
export const fetchAllEmployees = async () => {
  try {
    // Ensure API URL is loaded
    const baseUrl = await initApiUrl();
    const token = localStorage.getItem("access_token");
    
    const url = `${baseUrl}/employees/findAll`;
    console.log('🔍 Fetching employees from:', url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('📡 employees/findAll response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      url: response.url
    });

    // Check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Invalid content-type:', contentType);
      const text = await response.text();
      console.error('Response body:', text);
      throw new Error(`Expected JSON but got ${contentType}`);
    }

    // Parse JSON
    const data = await response.json();
    console.log('✅ Employees data received:', data);

    // Validate data
    if (!Array.isArray(data)) {
      console.warn('⚠️  Expected array but got:', typeof data, data);
      return [];
    }

    return data;
  } catch (error) {
    console.error('❌ Error in fetchAllEmployees:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
};

// Initialize on module load
initApiUrl();
