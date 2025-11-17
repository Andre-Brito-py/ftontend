// Authentication service with Google integration

import apiConfig from '../config/apiConfig.js'

class AuthService {
  constructor() {
    this.googleClientId = apiConfig.GOOGLE.CLIENT_ID // Replace with actual Google Client ID
    this.googleScriptLoaded = false
    this.authToken = null
  }

  // Initialize Google Sign-in
  async initializeGoogleSignIn() {
    if (this.googleScriptLoaded) return true

    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      
      script.onload = () => {
        this.googleScriptLoaded = true
        
        // Initialize Google Identity Services
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: this.googleClientId,
            callback: window.handleGoogleSignInCallback || this.handleGoogleSignIn.bind(this)
          })
        }
        
        resolve(true)
      }
      
      script.onerror = () => {
        console.error('Failed to load Google Sign-in script')
        resolve(false)
      }
      
      document.head.appendChild(script)
    })
  }

  // Handle Google Sign-in response
  handleGoogleSignIn(response) {
    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]))
      
      const userInfo = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        givenName: payload.given_name,
        familyName: payload.family_name,
        verified: payload.email_verified
      }
      
      // Store user info in localStorage
      localStorage.setItem('googleUser', JSON.stringify(userInfo))
      localStorage.setItem('googleToken', response.credential)
      
      return userInfo
    } catch (error) {
      console.error('Error decoding Google token:', error)
      throw new Error('Failed to decode Google sign-in response')
    }
  }

  // Render Google Sign-in button
  renderGoogleButton(elementId, options = {}) {
    if (!this.googleScriptLoaded) {
      console.warn('Google Sign-in not initialized')
      return
    }

    const defaultOptions = {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      width: '100%',
      locale: 'pt_BR'
    }

    const buttonOptions = { ...defaultOptions, ...options }

    const buttonDiv = document.getElementById(elementId)
    if (buttonDiv && window.google && window.google.accounts) {
      window.google.accounts.id.renderButton(buttonDiv, buttonOptions)
    }
  }

  // Get current Google user
  getGoogleUser() {
    const googleUser = localStorage.getItem('googleUser')
    return googleUser ? JSON.parse(googleUser) : null
  }

  // Get Google token
  getGoogleToken() {
    return localStorage.getItem('googleToken')
  }

  // Sign out from Google
  async signOutGoogle() {
    if (window.google && window.google.accounts) {
      try {
        await window.google.accounts.id.revoke(localStorage.getItem('googleUser'))
      } catch (error) {
        console.warn('Error revoking Google token:', error)
      }
    }
    
    localStorage.removeItem('googleUser')
    localStorage.removeItem('googleToken')
  }

  // Backend authentication
  async loginWithBackend(credentials) {
    try {
      const response = await fetch(`${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      
      if (data.success) {
        this.authToken = data.token
        localStorage.setItem('superAdminToken', data.token)
        localStorage.setItem('userRole', 'super_admin')
        return data
      } else {
        throw new Error(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Backend login error:', error)
      throw error
    }
  }

  // Login with Google to backend
  async loginWithGoogleToBackend(googleToken) {
    try {
      const response = await fetch(`${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.GOOGLE_LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          googleToken: googleToken
        })
      })

      const data = await response.json()
      
      if (data.success) {
        this.authToken = data.token
        localStorage.setItem('superAdminToken', data.token)
        localStorage.setItem('userRole', 'super_admin')
        return data
      } else {
        throw new Error(data.message || 'Google login failed')
      }
    } catch (error) {
      console.error('Google backend login error:', error)
      throw error
    }
  }

  // Get auth token
  getAuthToken() {
    if (this.authToken) return this.authToken
    return localStorage.getItem('superAdminToken') || localStorage.getItem('token')
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getAuthToken()
    if (!token) return false

    try {
      // Simple JWT validation (check expiration)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expirationTime = payload.exp * 1000
      return Date.now() < expirationTime
    } catch (error) {
      return false
    }
  }

  // Logout
  logout() {
    this.authToken = null
    localStorage.removeItem('superAdminToken')
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('googleUser')
    localStorage.removeItem('googleToken')
  }

  // Get current user role
  getUserRole() {
    return localStorage.getItem('userRole')
  }

  // Check if user is super admin
  isSuperAdmin() {
    return this.getUserRole() === 'super_admin'
  }

  // Validate JWT token
  validateToken(token) {
    if (!token || typeof token !== 'string') return false
    
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return false
      
      // Check if all parts are valid base64
      parts.every(part => {
        try {
          atob(part)
          return true
        } catch {
          return false
        }
      })
      
      return true
    } catch {
      return false
    }
  }
}

// Create singleton instance
const authService = new AuthService()

export default authService
export { AuthService }