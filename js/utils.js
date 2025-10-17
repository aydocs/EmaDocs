/**
 * ADIOX FRAMEWORK - UTILITY FUNCTIONS
 * Helper functions and utilities
 * @version 1.0.0
 */

;((window) => {
  const AdiUtils = {
    /**
     * HTML sanitizer to prevent XSS attacks
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized HTML
     */
    sanitizeHTML(html) {
      const temp = document.createElement("div")
      temp.textContent = html
      return temp.innerHTML
    },

    /**
     * Safely set innerHTML with sanitization
     * @param {HTMLElement} element - Target element
     * @param {string} html - HTML content
     * @param {boolean} [sanitize=true] - Whether to sanitize
     */
    setHTML(element, html, sanitize = true) {
      if (sanitize) {
        element.textContent = html
      } else {
        element.innerHTML = html
      }
    },

    /**
     * Generate unique ID
     * @param {string} [prefix='adi'] - ID prefix
     * @returns {string} Unique ID
     */
    generateId(prefix = "adi") {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    },

    /**
     * Format date
     * @param {Date|string|number} date - Date to format
     * @param {string} [format='YYYY-MM-DD'] - Format string
     * @returns {string} Formatted date
     */
    formatDate(date, format = "YYYY-MM-DD") {
      const d = new Date(date)

      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")
      const hours = String(d.getHours()).padStart(2, "0")
      const minutes = String(d.getMinutes()).padStart(2, "0")
      const seconds = String(d.getSeconds()).padStart(2, "0")

      return format
        .replace("YYYY", year)
        .replace("MM", month)
        .replace("DD", day)
        .replace("HH", hours)
        .replace("mm", minutes)
        .replace("ss", seconds)
    },

    /**
     * Parse query string
     * @param {string} [search=window.location.search] - Query string
     * @returns {Object} Parsed query parameters
     */
    parseQuery(search = window.location.search) {
      const params = new URLSearchParams(search)
      const result = {}

      for (const [key, value] of params) {
        result[key] = value
      }

      return result
    },

    /**
     * Build query string
     * @param {Object} params - Query parameters
     * @returns {string} Query string
     */
    buildQuery(params) {
      const searchParams = new URLSearchParams()

      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.append(key, value)
        }
      })

      return searchParams.toString()
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @param {number} [offset=0] - Offset in pixels
     * @returns {boolean} True if in viewport
     */
    isInViewport(element, offset = 0) {
      const rect = element.getBoundingClientRect()

      return (
        rect.top >= -offset &&
        rect.left >= -offset &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
      )
    },

    /**
     * Scroll to element smoothly
     * @param {HTMLElement|string} element - Element or selector
     * @param {Object} [options] - Scroll options
     * @param {string} [options.behavior='smooth'] - Scroll behavior
     * @param {string} [options.block='start'] - Vertical alignment
     * @param {number} [options.offset=0] - Offset in pixels
     */
    scrollTo(element, options = {}) {
      const el = typeof element === "string" ? document.querySelector(element) : element

      if (!el) return

      const offset = options.offset || 0
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: options.behavior || "smooth",
      })
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<void>}
     */
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement("textarea")
        textarea.value = text
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()

        try {
          document.execCommand("copy")
          document.body.removeChild(textarea)
          return true
        } catch (e) {
          document.body.removeChild(textarea)
          return false
        }
      }
    },

    /**
     * Format file size
     * @param {number} bytes - File size in bytes
     * @param {number} [decimals=2] - Number of decimals
     * @returns {string} Formatted file size
     */
    formatFileSize(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes"

      const k = 1024
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
    },

    /**
     * Truncate string
     * @param {string} str - String to truncate
     * @param {number} length - Maximum length
     * @param {string} [suffix='...'] - Suffix to add
     * @returns {string} Truncated string
     */
    truncate(str, length, suffix = "...") {
      if (str.length <= length) return str
      return str.substring(0, length - suffix.length) + suffix
    },

    /**
     * Capitalize first letter
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },

    /**
     * Convert to kebab-case
     * @param {string} str - String to convert
     * @returns {string} Kebab-case string
     */
    kebabCase(str) {
      return str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase()
    },

    /**
     * Convert to camelCase
     * @param {string} str - String to convert
     * @returns {string} CamelCase string
     */
    camelCase(str) {
      return str.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    },

    /**
     * Check if object is empty
     * @param {Object} obj - Object to check
     * @returns {boolean} True if empty
     */
    isEmpty(obj) {
      return Object.keys(obj).length === 0
    },

    /**
     * Get random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },

    /**
     * Shuffle array
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffle(array) {
      const arr = [...array]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    },

    /**
     * Group array by key
     * @param {Array} array - Array to group
     * @param {string|Function} key - Key or function to group by
     * @returns {Object} Grouped object
     */
    groupBy(array, key) {
      return array.reduce((result, item) => {
        const group = typeof key === "function" ? key(item) : item[key]
        ;(result[group] = result[group] || []).push(item)
        return result
      }, {})
    },

    /**
     * Remove duplicates from array
     * @param {Array} array - Array with duplicates
     * @returns {Array} Array without duplicates
     */
    unique(array) {
      return [...new Set(array)]
    },

    /**
     * Check if value is valid email
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    isEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },

    /**
     * Check if value is valid URL
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid
     */
    isURL(url) {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    },

    /**
     * Wait for condition to be true
     * @param {Function} condition - Condition function
     * @param {number} [timeout=5000] - Timeout in ms
     * @param {number} [interval=100] - Check interval in ms
     * @returns {Promise<void>}
     */
    waitFor(condition, timeout = 5000, interval = 100) {
      return new Promise((resolve, reject) => {
        const startTime = Date.now()

        const check = () => {
          if (condition()) {
            resolve()
          } else if (Date.now() - startTime > timeout) {
            reject(new Error("Timeout waiting for condition"))
          } else {
            setTimeout(check, interval)
          }
        }

        check()
      })
    },
  }

  // Export to window
  window.AdiUtils = AdiUtils
})(window)
