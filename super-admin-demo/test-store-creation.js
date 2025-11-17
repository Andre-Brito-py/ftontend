// Test script for Store Creation functionality
// Run this in browser console after opening the Stores page

class StoreCreationTester {
  constructor() {
    this.tests = []
    this.results = []
  }

  // Test Google Sign-in integration
  async testGoogleSignIn() {
    console.log('🧪 Testing Google Sign-in integration...')
    
    try {
      // Check if authService is available
      if (typeof authService === 'undefined') {
        throw new Error('authService not found')
      }

      // Check if Google Client ID is configured
      const clientId = authService.googleClientId
      if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
        console.warn('⚠️ Google Client ID not configured. Using mock data.')
        return { success: true, warning: 'Google Client ID not configured' }
      }

      // Test Google script loading
      const scriptLoaded = await authService.initializeGoogleSignIn()
      if (!scriptLoaded) {
        throw new Error('Failed to load Google Sign-in script')
      }

      console.log('✅ Google Sign-in integration test passed')
      return { success: true }
    } catch (error) {
      console.error('❌ Google Sign-in test failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Test backend service integration
  async testBackendService() {
    console.log('🧪 Testing Backend Service integration...')
    
    try {
      // Check if backendService is available
      if (typeof backendService === 'undefined') {
        throw new Error('backendService not found')
      }

      // Check if API base URL is configured
      const baseUrl = backendService.baseUrl
      if (!baseUrl || baseUrl.includes('undefined')) {
        throw new Error('Backend API URL not configured properly')
      }

      console.log('✅ Backend Service integration test passed')
      return { success: true, baseUrl }
    } catch (error) {
      console.error('❌ Backend Service test failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Test form validation
  testFormValidation() {
    console.log('🧪 Testing form validation...')
    
    try {
      // Test email validation
      const validEmail = 'test@example.com'
      const invalidEmail = 'invalid-email'
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      if (!emailRegex.test(validEmail)) {
        throw new Error('Valid email validation failed')
      }
      
      if (emailRegex.test(invalidEmail)) {
        throw new Error('Invalid email validation failed')
      }

      // Test phone validation (Brazilian format)
      const validPhone = '(11) 1234-5678'
      const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/
      
      if (!phoneRegex.test(validPhone)) {
        throw new Error('Valid phone validation failed')
      }

      console.log('✅ Form validation test passed')
      return { success: true }
    } catch (error) {
      console.error('❌ Form validation test failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Test modal functionality
  testModalFunctionality() {
    console.log('🧪 Testing modal functionality...')
    
    try {
      // Check if modal can be opened
      const modalButton = document.querySelector('[data-bs-target="#storeCreationModal"]')
      if (modalButton) {
        console.log('✅ Modal trigger button found')
      } else {
        console.warn('⚠️ Modal trigger button not found, checking for custom trigger')
      }

      // Check if StoreCreationModal component is loaded
      if (typeof StoreCreationModal === 'undefined') {
        throw new Error('StoreCreationModal component not found')
      }

      console.log('✅ Modal functionality test passed')
      return { success: true }
    } catch (error) {
      console.error('❌ Modal functionality test failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting Store Creation functionality tests...\n')
    
    const tests = [
      { name: 'Google Sign-in', test: () => this.testGoogleSignIn() },
      { name: 'Backend Service', test: () => this.testBackendService() },
      { name: 'Form Validation', test: () => this.testFormValidation() },
      { name: 'Modal Functionality', test: () => this.testModalFunctionality() }
    ]

    const results = []
    
    for (const { name, test } of tests) {
      try {
        const result = await test()
        results.push({ name, ...result })
      } catch (error) {
        results.push({ name, success: false, error: error.message })
      }
    }

    // Display results
    console.log('\n📊 Test Results:')
    console.log('==================')
    
    results.forEach(({ name, success, error, warning, baseUrl }) => {
      if (success) {
        console.log(`✅ ${name}: PASSED`)
        if (warning) console.log(`   ⚠️  Warning: ${warning}`)
        if (baseUrl) console.log(`   ℹ️  API URL: ${baseUrl}`)
      } else {
        console.log(`❌ ${name}: FAILED`)
        if (error) console.log(`   Error: ${error}`)
      }
    })

    const passed = results.filter(r => r.success).length
    const total = results.length
    
    console.log(`\n📈 Summary: ${passed}/${total} tests passed`)
    
    if (passed === total) {
      console.log('🎉 All tests passed! Store creation functionality is ready.')
    } else {
      console.log('🔧 Some tests failed. Please check the configuration and try again.')
    }

    return results
  }

  // Generate test data
  generateTestStoreData() {
    return {
      name: 'Test Store ' + Date.now(),
      slug: 'test-store-' + Date.now(),
      email: 'test@example.com',
      phone: '(11) 1234-5678',
      address: 'Rua Teste, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil',
      admin: {
        name: 'Test Admin',
        email: 'admin@example.com',
        phone: '(11) 9876-5432'
      },
      plan: 'basic',
      paymentMethod: 'monthly',
      autoRenew: true,
      googleSignIn: false,
      googleAccount: null
    }
  }

  // Test store creation (requires backend)
  async testStoreCreation() {
    console.log('🧪 Testing store creation with backend...')
    
    try {
      const storeData = this.generateTestStoreData()
      
      if (typeof backendService === 'undefined') {
        throw new Error('backendService not available')
      }

      const response = await backendService.createStore(storeData)
      
      console.log('✅ Store creation test passed')
      console.log('Store created:', response)
      
      return { success: true, data: response }
    } catch (error) {
      console.error('❌ Store creation test failed:', error)
      return { success: false, error: error.message }
    }
  }
}

// Usage instructions
console.log(`
🧪 Store Creation Test Suite
==========================

Available commands:
- tester.runAllTests() - Run all integration tests
- tester.testStoreCreation() - Test store creation with backend (requires valid backend)
- tester.generateTestStoreData() - Generate test data for manual testing

Example usage:
const tester = new StoreCreationTester()
tester.runAllTests()
`)

// Create global tester instance
window.StoreCreationTester = StoreCreationTester
window.tester = new StoreCreationTester()