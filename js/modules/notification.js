/**
 * EMADOCS - NOTIFICATION MODULE
 */
;((window) => {
  const EmaNotification = {
    async requestPermission() {
      if (!("Notification" in window)) return false
      const permission = await Notification.requestPermission()
      return permission === "granted"
    },

    show(title, options = {}) {
      if (Notification.permission === "granted") {
        return new Notification(title, options)
      }
    },
  }

  window.EmaNotification = EmaNotification
})(window)
