/**
 * EMADOCS - DEBOUNCE/THROTTLE MODULE
 */
;((window) => {
  const EmaDebounce = {
    debounce(func, wait) {
      let timeout
      return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), wait)
      }
    },

    throttle(func, limit) {
      let inThrottle
      return function (...args) {
        if (!inThrottle) {
          func.apply(this, args)
          inThrottle = true
          setTimeout(() => (inThrottle = false), limit)
        }
      }
    },
  }

  window.EmaDebounce = EmaDebounce
})(window)
