/**
 * EMADOCS - GEOLOCATION MODULE
 */
;((window) => {
  const EmaGeo = {
    getCurrentPosition(options = {}) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      })
    },

    watchPosition(callback, options = {}) {
      return navigator.geolocation.watchPosition(callback, null, options)
    },

    clearWatch(watchId) {
      navigator.geolocation.clearWatch(watchId)
    },
  }

  window.EmaGeo = EmaGeo
})(window)
