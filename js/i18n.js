/**
 * ADIOX FRAMEWORK - INTERNATIONALIZATION
 * Simple i18n system with RTL support
 * @version 1.0.0
 */

;((window) => {
  const AdiI18n = {
    currentLocale: "en",
    fallbackLocale: "en",
    translations: {},
    rtlLocales: ["ar", "he", "fa", "ur"],

    /**
     * Initialize i18n system
     * @param {Object} options - Initialization options
     * @param {string} [options.locale='en'] - Initial locale
     * @param {string} [options.fallback='en'] - Fallback locale
     */
    init(options = {}) {
      this.currentLocale = options.locale || "en"
      this.fallbackLocale = options.fallback || "en"

      this.updateDirection()
      window.AdiCore.emit("i18n:initialized", { locale: this.currentLocale })
    },

    /**
     * Load translations
     * @param {string} locale - Locale code
     * @param {Object} translations - Translation object
     */
    load(locale, translations) {
      this.translations[locale] = {
        ...this.translations[locale],
        ...translations,
      }

      window.AdiCore.emit("i18n:loaded", { locale, translations })
    },

    /**
     * Load translations from URL
     * @param {string} locale - Locale code
     * @param {string} url - URL to JSON file
     * @returns {Promise<void>}
     */
    async loadFromURL(locale, url) {
      try {
        const response = await fetch(url)
        const translations = await response.json()
        this.load(locale, translations)
      } catch (error) {
        console.error(`[Adiox I18n] Failed to load translations for "${locale}":`, error)
      }
    },

    /**
     * Set current locale
     * @param {string} locale - Locale code
     */
    setLocale(locale) {
      if (!this.translations[locale]) {
        console.warn(`[Adiox I18n] Translations for "${locale}" not loaded`)
      }

      this.currentLocale = locale
      this.updateDirection()

      window.AdiCore.emit("i18n:locale-changed", { locale })
    },

    /**
     * Get current locale
     * @returns {string} Current locale
     */
    getLocale() {
      return this.currentLocale
    },

    /**
     * Translate key
     * @param {string} key - Translation key (supports dot notation)
     * @param {Object} [params] - Parameters for interpolation
     * @param {string} [locale] - Specific locale (defaults to current)
     * @returns {string} Translated string
     */
    t(key, params = {}, locale = null) {
      const loc = locale || this.currentLocale
      const translations = this.translations[loc] || this.translations[this.fallbackLocale] || {}

      // Get translation using dot notation
      const keys = key.split(".")
      let translation = translations

      for (const k of keys) {
        if (translation && typeof translation === "object") {
          translation = translation[k]
        } else {
          break
        }
      }

      // If not found, return key
      if (typeof translation !== "string") {
        console.warn(`[Adiox I18n] Translation not found for key "${key}"`)
        return key
      }

      // Interpolate parameters
      return this.interpolate(translation, params)
    },

    /**
     * Interpolate parameters in string
     * @param {string} str - String with placeholders
     * @param {Object} params - Parameters object
     * @returns {string} Interpolated string
     */
    interpolate(str, params) {
      return str.replace(/\{(\w+)\}/g, (match, key) => {
        return params[key] !== undefined ? params[key] : match
      })
    },

    /**
     * Check if locale is RTL
     * @param {string} [locale] - Locale to check (defaults to current)
     * @returns {boolean} True if RTL
     */
    isRTL(locale = null) {
      const loc = locale || this.currentLocale
      return this.rtlLocales.includes(loc)
    },

    /**
     * Update document direction based on locale
     */
    updateDirection() {
      const dir = this.isRTL() ? "rtl" : "ltr"
      document.documentElement.setAttribute("dir", dir)
      document.documentElement.setAttribute("lang", this.currentLocale)
    },

    /**
     * Get available locales
     * @returns {Array<string>} Array of locale codes
     */
    getAvailableLocales() {
      return Object.keys(this.translations)
    },

    /**
     * Check if locale is available
     * @param {string} locale - Locale code
     * @returns {boolean} True if available
     */
    hasLocale(locale) {
      return !!this.translations[locale]
    },
  }

  // Export to window
  window.AdiI18n = AdiI18n
})(window)
