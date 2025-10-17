/**
 * EMADOCS - DEVICE MODULE
 */
;((window) => {
  const EmaDevice = {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    },

    isTablet() {
      return /iPad|Android/i.test(navigator.userAgent) && !this.isMobile()
    },

    isDesktop() {
      return !this.isMobile() && !this.isTablet()
    },

    getOS() {
      const ua = navigator.userAgent
      if (/Windows/i.test(ua)) return "Windows"
      if (/Mac/i.test(ua)) return "MacOS"
      if (/Linux/i.test(ua)) return "Linux"
      if (/Android/i.test(ua)) return "Android"
      if (/iOS/i.test(ua)) return "iOS"
      return "Unknown"
    },

    getBrowser() {
      const ua = navigator.userAgent
      if (/Chrome/i.test(ua)) return "Chrome"
      if (/Firefox/i.test(ua)) return "Firefox"
      if (/Safari/i.test(ua)) return "Safari"
      if (/Edge/i.test(ua)) return "Edge"
      return "Unknown"
    },

    getScreenSize() {
      return {
        width: window.screen.width,
        height: window.screen.height,
      }
    },

    getViewportSize() {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
  }

  window.EmaDevice = EmaDevice
})(window)
