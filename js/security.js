/**
 * Adiox Security Module
 * Security utilities (XSS prevention, CSRF, CSP)
 * @module Adiox.Security
 */

;(() => {
  const Security = {
    /**
     * Sanitize HTML to prevent XSS
     * @param {string} html - HTML string
     * @returns {string}
     */
    sanitizeHTML(html) {
      const div = document.createElement("div")
      div.textContent = html
      return div.innerHTML
    },

    /**
     * Escape HTML entities
     * @param {string} str - String to escape
     * @returns {string}
     */
    escapeHTML(str) {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;",
      }
      return str.replace(/[&<>"'/]/g, (char) => map[char])
    },

    /**
     * Generate CSRF token
     * @returns {string}
     */
    generateCSRFToken() {
      const token = this._randomString(32)
      sessionStorage.setItem("adiox_csrf_token", token)
      return token
    },

    /**
     * Validate CSRF token
     * @param {string} token - Token to validate
     * @returns {boolean}
     */
    validateCSRFToken(token) {
      const stored = sessionStorage.getItem("adiox_csrf_token")
      return stored === token
    },

    /**
     * Add CSRF token to form
     * @param {HTMLFormElement} form - Form element
     */
    addCSRFToForm(form) {
      const token = this.generateCSRFToken()
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = "_csrf"
      input.value = token
      form.appendChild(input)
    },

    /**
     * Validate URL to prevent open redirect
     * @param {string} url - URL to validate
     * @param {Array} allowedDomains - Allowed domains
     * @returns {boolean}
     */
    validateURL(url, allowedDomains = []) {
      try {
        const parsed = new URL(url, window.location.origin)

        // Check protocol
        if (!["http:", "https:"].includes(parsed.protocol)) {
          return false
        }

        // Check domain if allowlist provided
        if (allowedDomains.length > 0) {
          return allowedDomains.some((domain) => parsed.hostname.endsWith(domain))
        }

        return true
      } catch (error) {
        return false
      }
    },

    /**
     * Content Security Policy helper
     * @param {Object} policy - CSP policy object
     * @returns {string}
     */
    generateCSP(policy = {}) {
      const defaults = {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:"],
        "font-src": ["'self'"],
        "connect-src": ["'self'"],
        "frame-ancestors": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
      }

      const merged = { ...defaults, ...policy }

      return Object.entries(merged)
        .map(([key, values]) => `${key} ${values.join(" ")}`)
        .join("; ")
    },

    /**
     * Rate limiting helper
     * @param {string} key - Rate limit key
     * @param {number} maxAttempts - Max attempts
     * @param {number} windowMs - Time window in ms
     * @returns {boolean}
     */
    checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
      const now = Date.now()
      const storageKey = `adiox_ratelimit_${key}`

      let attempts = []
      try {
        const stored = sessionStorage.getItem(storageKey)
        if (stored) {
          attempts = JSON.parse(stored)
        }
      } catch (error) {
        console.error("[Adiox Security] Rate limit error:", error)
      }

      // Remove old attempts
      attempts = attempts.filter((time) => now - time < windowMs)

      // Check limit
      if (attempts.length >= maxAttempts) {
        return false
      }

      // Add new attempt
      attempts.push(now)
      sessionStorage.setItem(storageKey, JSON.stringify(attempts))

      return true
    },

    /**
     * Generate random string
     * @private
     */
    _randomString(length) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      let result = ""
      const randomValues = new Uint8Array(length)
      crypto.getRandomValues(randomValues)

      for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % chars.length]
      }
      return result
    },
  }

  // Attach to Adiox
  if (typeof window.Adiox !== "undefined") {
    window.Adiox.Security = Security
  } else {
    console.warn("[Adiox Security] Adiox core not found")
  }
})()
