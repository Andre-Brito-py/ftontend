// Backend service for API integration
import apiConfig from '../config/apiConfig.js'

class BackendService {
  constructor() {
    this.baseUrl = apiConfig.BASE_URL
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('superAdminToken') || localStorage.getItem('token')
  }

  // Make API request with proper headers
  async makeRequest(endpoint, options = {}) {
    const token = this.getAuthToken()
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Store Management
  async createStore(storeData) {
    return this.makeRequest('/system/stores', {
      method: 'POST',
      body: JSON.stringify(storeData)
    })
  }

  async getStores() {
    return this.makeRequest('/system/stores')
  }

  async getStore(storeId) {
    return this.makeRequest(`/system/stores/${storeId}`)
  }

  async updateStore(storeId, storeData) {
    return this.makeRequest(`/system/stores/${storeId}`, {
      method: 'PUT',
      body: JSON.stringify(storeData)
    })
  }

  async deleteStore(storeId) {
    return this.makeRequest(`/system/stores/${storeId}`, {
      method: 'DELETE'
    })
  }

  async updateStoreStatus(storeId, status) {
    return this.makeRequest(`/system/stores/${storeId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  }

  // User Management
  async createUser(userData) {
    return this.makeRequest('/system/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async getUsers() {
    return this.makeRequest('/system/users')
  }

  async updateUser(userId, userData) {
    return this.makeRequest(`/system/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  }

  async updateUserStatus(userId, status) {
    return this.makeRequest(`/system/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  }

  async deleteUser(userId) {
    return this.makeRequest(`/system/users/${userId}`, {
      method: 'DELETE'
    })
  }

  // System Settings
  async getSystemSettings() {
    return this.makeRequest('/system/settings')
  }

  async updateSystemSettings(settings) {
    return this.makeRequest('/system/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    })
  }

  // Analytics
  async getSystemStats() {
    return this.makeRequest('/system/stats')
  }

  async getSystemAnalytics() {
    return this.makeRequest('/system/analytics')
  }

  // Logs
  async getSystemLogs(filters = {}) {
    const queryString = new URLSearchParams(filters).toString()
    return this.makeRequest(`/system/logs${queryString ? `?${queryString}` : ''}`)
  }

  // API Keys
  async getApiKeys() {
    return this.makeRequest('/system/api-keys')
  }

  async createApiKey(keyData) {
    return this.makeRequest('/system/api-keys', {
      method: 'POST',
      body: JSON.stringify(keyData)
    })
  }

  async deleteApiKey(keyId) {
    return this.makeRequest(`/system/api-keys/${keyId}`, {
      method: 'DELETE'
    })
  }

  // Authentication
  async superAdminLogin(credentials) {
    return this.makeRequest('/system/super-admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  }

  async checkSuperAdmin() {
    return this.makeRequest('/system/super-admin/check')
  }

  // Google Sign-in integration
  async createStoreWithGoogle(storeData, googleToken) {
    return this.makeRequest('/system/stores/google', {
      method: 'POST',
      body: JSON.stringify({
        ...storeData,
        googleToken
      })
    })
  }

  // Financial data
  async getFinancialData() {
    return this.makeRequest('/system/financial')
  }

  async getRevenueData(period = 'month') {
    return this.makeRequest(`/system/revenue?period=${period}`)
  }

  // Utility methods
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  // Error handling
  handleError(error, defaultMessage = 'Ocorreu um erro') {
    if (error.message) {
      return error.message
    }
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message
    }
    return defaultMessage
  }
}

// Create singleton instance
const backendService = new BackendService()

export default backendService
export { BackendService }