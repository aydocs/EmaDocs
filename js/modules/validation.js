/**
 * EMADOCS - VALIDATION MODULE
 */
;((window) => {
  const EmaValidation = {
    email(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    },

    url(value) {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },

    phone(value) {
      return /^\+?[\d\s-()]+$/.test(value)
    },

    creditCard(value) {
      return /^\d{13,19}$/.test(value.replace(/\s/g, ""))
    },

    zipCode(value) {
      return /^\d{5}(-\d{4})?$/.test(value)
    },

    minLength(value, min) {
      return value.length >= min
    },

    maxLength(value, max) {
      return value.length <= max
    },

    pattern(value, regex) {
      return regex.test(value)
    },
  }

  window.EmaValidation = EmaValidation
})(window)
