/**
 * EMADOCS - STORAGE MODULE
 */
;((window) => {
  const EmaStorage = {
    local: {
      set(key, value) {
        localStorage.setItem(key, JSON.stringify(value))
      },
      get(key) {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      },
      remove(key) {
        localStorage.removeItem(key)
      },
      clear() {
        localStorage.clear()
      },
    },

    session: {
      set(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value))
      },
      get(key) {
        const item = sessionStorage.getItem(key)
        return item ? JSON.parse(item) : null
      },
      remove(key) {
        sessionStorage.removeItem(key)
      },
      clear() {
        sessionStorage.clear()
      },
    },
  }

  window.EmaStorage = EmaStorage
})(window)
