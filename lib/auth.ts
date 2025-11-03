/**
 * Simple authentication utilities
 */

const AUTH_TOKEN_KEY = 'fb_reply_auth_token'
const AUTH_USER_KEY = 'fb_reply_auth_user'

export interface User {
  username: string
}

export const auth = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    return !!token
  },

  /**
   * Get current user
   */
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(AUTH_USER_KEY)
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  /**
   * Login with credentials
   */
  login: async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem(AUTH_TOKEN_KEY, data.token)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user))
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  },

  /**
   * Logout
   */
  logout: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    window.location.href = '/login'
  },

  /**
   * Get auth token for API requests
   */
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },
}
