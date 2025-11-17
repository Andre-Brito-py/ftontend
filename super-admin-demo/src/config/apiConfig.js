// API Configuration
const API_CONFIG = {
  // Backend API URL
  BASE_URL: 'http://localhost:4002/api',
  
  // Google OAuth Configuration
  GOOGLE: {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Google Client ID
    SCOPE: 'email profile',
    THEME: 'outline',
    SIZE: 'large'
  },
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/system/super-admin/login',
    LOGOUT: '/system/super-admin/logout',
    CHECK_SUPER_ADMIN: '/system/super-admin/check',
    GOOGLE_LOGIN: '/system/super-admin/login/google',
    
    // Stores
    STORES: '/system/stores',
    STORE: (id) => `/system/stores/${id}`,
    STORE_STATUS: (id) => `/system/stores/${id}/status`,
    
    // Users
    USERS: '/system/users',
    USER: (id) => `/system/users/${id}`,
    USER_STATUS: (id) => `/system/users/${id}/status`,
    
    // System
    SETTINGS: '/system/settings',
    STATS: '/system/stats',
    ANALYTICS: '/system/analytics',
    LOGS: '/system/logs',
    API_KEYS: '/system/api-keys',
    
    // Financial
    FINANCIAL: '/system/financial',
    REVENUE: '/system/revenue'
  },
  
  // Request Configuration
  REQUEST: {
    TIMEOUT: 30000, // 30 seconds
    RETRIES: 3,
    RETRY_DELAY: 1000 // 1 second
  },
  
  // Response Configuration
  RESPONSE: {
    SUCCESS_CODES: [200, 201, 202],
    ERROR_CODES: [400, 401, 403, 404, 500, 502, 503]
  }
}

// Environment-based configuration
const getApiConfig = () => {
  const env = import.meta.env
  
  return {
    ...API_CONFIG,
    BASE_URL: env.VITE_BACKEND_URL || API_CONFIG.BASE_URL,
    GOOGLE: {
      ...API_CONFIG.GOOGLE,
      CLIENT_ID: env.VITE_GOOGLE_CLIENT_ID || API_CONFIG.GOOGLE.CLIENT_ID
    }
  }
}

export default getApiConfig()
export { API_CONFIG }