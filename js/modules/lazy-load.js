/**
 * EMADOCS - LAZY LOAD MODULE
 */
;((window) => {
  const EmaLazyLoad = {
    observer: null,

    init(options = {}) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src
            img.classList.add("loaded")
            this.observer.unobserve(img)
          }
        })
      }, options)
    },

    observe(selector) {
      if (!this.observer) this.init()

      document.querySelectorAll(selector).forEach((img) => {
        this.observer.observe(img)
      })
    },
  }

  window.EmaLazyLoad = EmaLazyLoad
})(window)
