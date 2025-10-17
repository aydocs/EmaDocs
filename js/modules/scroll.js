/**
 * EMADOCS - SCROLL MODULE
 */
;((window) => {
  const EmaScroll = {
    to(target, options = {}) {
      const element = typeof target === "string" ? document.querySelector(target) : target
      if (!element) return

      element.scrollIntoView({
        behavior: options.behavior || "smooth",
        block: options.block || "start",
      })
    },

    toTop(smooth = true) {
      window.scrollTo({
        top: 0,
        behavior: smooth ? "smooth" : "auto",
      })
    },

    getPosition() {
      return {
        x: window.pageXOffset,
        y: window.pageYOffset,
      }
    },

    onScroll(callback, throttle = 100) {
      let ticking = false
      let lastTime = 0

      const handler = () => {
        const now = Date.now()
        if (now - lastTime < throttle) return

        if (!ticking) {
          window.requestAnimationFrame(() => {
            callback(this.getPosition())
            ticking = false
            lastTime = now
          })
          ticking = true
        }
      }

      window.addEventListener("scroll", handler)
      return () => window.removeEventListener("scroll", handler)
    },
  }

  window.EmaScroll = EmaScroll
})(window)
