/**
 * Adiox Feature Flags Module
 * Feature flag management system
 * @module Adiox.FeatureFlags
 */

;(() => {
  const FeatureFlags = {
    _flags: {},
    _listeners: {},

    /**
     * Initialize feature flags
     * @param {Object} flags - Initial flags
     */
    init(flags = {}) {
      this._flags = { ...flags }
      this._loadFromStorage()
    },

    /**
     * Check if feature is enabled
     * @param {string} feature - Feature name
     * @param {boolean} defaultValue - Default value if not set
     * @returns {boolean}
     */
    isEnabled(feature, defaultValue = false) {
      return this._flags[feature] !== undefined ? this._flags[feature] : defaultValue
    },

    /**
     * Enable feature
     * @param {string} feature - Feature name
     */
    enable(feature) {
      this._flags[feature] = true
      this._saveToStorage()
      this._notify(feature, true)
    },

    /**
     * Disable feature
     * @param {string} feature - Feature name
     */
    disable(feature) {
      this._flags[feature] = false
      this._saveToStorage()
      this._notify(feature, false)
    },

    /**
     * Toggle feature
     * @param {string} feature - Feature name
     */
    toggle(feature) {
      this._flags[feature] = !this._flags[feature]
      this._saveToStorage()
      this._notify(feature, this._flags[feature])
    },

    /**
     * Set multiple flags
     * @param {Object} flags - Flags object
     */
    setFlags(flags) {
      this._flags = { ...this._flags, ...flags }
      this._saveToStorage()
      Object.keys(flags).forEach((feature) => {
        this._notify(feature, flags[feature])
      })
    },

    /**
     * Get all flags
     * @returns {Object}
     */
    getAll() {
      return { ...this._flags }
    },

    /**
     * Watch feature changes
     * @param {string} feature - Feature name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    watch(feature, callback) {
      if (!this._listeners[feature]) {
        this._listeners[feature] = []
      }
      this._listeners[feature].push(callback)

      return () => {
        this._listeners[feature] = this._listeners[feature].filter((cb) => cb !== callback)
      }
    },

    /**
     * Load flags from localStorage
     * @private
     */
    _loadFromStorage() {
      try {
        const stored = localStorage.getItem("adiox_feature_flags")
        if (stored) {
          this._flags = { ...this._flags, ...JSON.parse(stored) }
        }
      } catch (error) {
        console.error("[Adiox FeatureFlags] Load error:", error)
      }
    },

    /**
     * Save flags to localStorage
     * @private
     */
    _saveToStorage() {
      try {
        localStorage.setItem("adiox_feature_flags", JSON.stringify(this._flags))
      } catch (error) {
        console.error("[Adiox FeatureFlags] Save error:", error)
      }
    },

    /**
     * Notify listeners
     * @private
     */
    _notify(feature, value) {
      if (this._listeners[feature]) {
        this._listeners[feature].forEach((callback) => callback(value))
      }
    },
  }

  // Attach to Adiox
  if (typeof window.Adiox !== "undefined") {
    window.Adiox.FeatureFlags = FeatureFlags
  } else {
    console.warn("[Adiox FeatureFlags] Adiox core not found")
  }
})()
