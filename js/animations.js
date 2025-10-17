/**
 * ADIOX FRAMEWORK - ANIMATIONS MODULE
 * Hardware-accelerated animations with Web Animations API
 * @version 1.0.0
 */

;((window) => {
  const AdiAnimations = {
    // Animation presets
    presets: {
      fadeIn: {
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        options: { duration: 300, easing: "ease" },
      },
      fadeOut: {
        keyframes: [{ opacity: 1 }, { opacity: 0 }],
        options: { duration: 300, easing: "ease" },
      },
      slideUp: {
        keyframes: [
          { opacity: 0, transform: "translateY(30px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        options: { duration: 300, easing: "ease-out" },
      },
      slideDown: {
        keyframes: [
          { opacity: 0, transform: "translateY(-30px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        options: { duration: 300, easing: "ease-out" },
      },
      slideLeft: {
        keyframes: [
          { opacity: 0, transform: "translateX(30px)" },
          { opacity: 1, transform: "translateX(0)" },
        ],
        options: { duration: 300, easing: "ease-out" },
      },
      slideRight: {
        keyframes: [
          { opacity: 0, transform: "translateX(-30px)" },
          { opacity: 1, transform: "translateX(0)" },
        ],
        options: { duration: 300, easing: "ease-out" },
      },
      scale: {
        keyframes: [
          { opacity: 0, transform: "scale(0.9)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        options: { duration: 300, easing: "ease-out" },
      },
      scaleUp: {
        keyframes: [{ transform: "scale(1)" }, { transform: "scale(1.05)" }, { transform: "scale(1)" }],
        options: { duration: 400, easing: "ease-in-out" },
      },
      bounce: {
        keyframes: [
          { transform: "translateY(0)" },
          { transform: "translateY(-20px)" },
          { transform: "translateY(0)" },
          { transform: "translateY(-10px)" },
          { transform: "translateY(0)" },
        ],
        options: { duration: 600, easing: "ease-in-out" },
      },
      shake: {
        keyframes: [
          { transform: "translateX(0)" },
          { transform: "translateX(-10px)" },
          { transform: "translateX(10px)" },
          { transform: "translateX(-10px)" },
          { transform: "translateX(10px)" },
          { transform: "translateX(0)" },
        ],
        options: { duration: 500, easing: "ease-in-out" },
      },
      pulse: {
        keyframes: [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(1.05)", opacity: 0.9 },
          { transform: "scale(1)", opacity: 1 },
        ],
        options: { duration: 500, easing: "ease-in-out" },
      },
      spin: {
        keyframes: [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
        options: { duration: 1000, easing: "linear", iterations: Number.POSITIVE_INFINITY },
      },
      flip: {
        keyframes: [
          { transform: "perspective(400px) rotateY(0)" },
          { transform: "perspective(400px) rotateY(180deg)" },
        ],
        options: { duration: 600, easing: "ease-in-out" },
      },
      zoomIn: {
        keyframes: [
          { opacity: 0, transform: "scale(0.5)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        options: { duration: 300, easing: "ease-out" },
      },
      zoomOut: {
        keyframes: [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(0.5)" },
        ],
        options: { duration: 300, easing: "ease-in" },
      },
      rotate: {
        keyframes: [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
        options: { duration: 600, easing: "ease-in-out" },
      },
      swing: {
        keyframes: [
          { transform: "rotate(0deg)" },
          { transform: "rotate(15deg)" },
          { transform: "rotate(-10deg)" },
          { transform: "rotate(5deg)" },
          { transform: "rotate(-5deg)" },
          { transform: "rotate(0deg)" },
        ],
        options: { duration: 800, easing: "ease-in-out" },
      },
    },

    // Active animations registry
    activeAnimations: new Map(),

    /**
     * Check if reduced motion is preferred
     * @returns {boolean} True if reduced motion is preferred
     */
    prefersReducedMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    },

    /**
     * Apply animation to element
     * @param {HTMLElement|string} element - Element or selector
     * @param {string|Object} animation - Animation name or custom config
     * @param {Object} [options] - Animation options
     * @param {number} [options.duration] - Duration in ms
     * @param {string} [options.easing] - Easing function
     * @param {number} [options.delay] - Delay in ms
     * @param {number} [options.iterations] - Number of iterations
     * @param {string} [options.fill] - Fill mode
     * @returns {Promise<Animation>} Promise that resolves when animation completes
     */
    async apply(element, animation, options = {}) {
      // Get element
      const el = typeof element === "string" ? document.querySelector(element) : element

      if (!el) {
        console.error("[Adiox Animations] Element not found")
        return Promise.reject(new Error("Element not found"))
      }

      // Check for reduced motion
      if (this.prefersReducedMotion()) {
        return Promise.resolve(null)
      }

      // Get animation config
      let config
      if (typeof animation === "string") {
        config = this.presets[animation]
        if (!config) {
          console.error(`[Adiox Animations] Animation "${animation}" not found`)
          return Promise.reject(new Error("Animation not found"))
        }
      } else {
        config = animation
      }

      // Merge options
      const animOptions = {
        ...config.options,
        ...options,
        fill: options.fill || "both",
      }

      // Create animation
      const anim = el.animate(config.keyframes, animOptions)

      // Store animation
      const animId = `${el.id || "el"}-${Date.now()}`
      this.activeAnimations.set(animId, anim)

      // Emit event
      window.AdiCore.emit("animation:started", { element: el, animation, animId })

      // Return promise
      return new Promise((resolve) => {
        anim.onfinish = () => {
          this.activeAnimations.delete(animId)
          window.AdiCore.emit("animation:finished", { element: el, animation, animId })
          resolve(anim)
        }

        anim.oncancel = () => {
          this.activeAnimations.delete(animId)
          window.AdiCore.emit("animation:cancelled", { element: el, animation, animId })
          resolve(anim)
        }
      })
    },

    /**
     * Animate multiple elements in sequence
     * @param {Array} animations - Array of {element, animation, options}
     * @param {number} [stagger=100] - Delay between animations in ms
     * @returns {Promise<void>}
     */
    async sequence(animations, stagger = 100) {
      for (let i = 0; i < animations.length; i++) {
        const { element, animation, options = {} } = animations[i]
        await this.apply(element, animation, options)
        if (i < animations.length - 1) {
          await this.delay(stagger)
        }
      }
    },

    /**
     * Animate multiple elements in parallel with stagger
     * @param {Array} animations - Array of {element, animation, options}
     * @param {number} [stagger=100] - Delay between start times in ms
     * @returns {Promise<void>}
     */
    async stagger(animations, stagger = 100) {
      const promises = animations.map((config, index) => {
        return this.delay(index * stagger).then(() => {
          return this.apply(config.element, config.animation, config.options)
        })
      })

      await Promise.all(promises)
    },

    /**
     * Animate multiple elements in parallel
     * @param {Array} animations - Array of {element, animation, options}
     * @returns {Promise<void>}
     */
    async parallel(animations) {
      const promises = animations.map((config) => {
        return this.apply(config.element, config.animation, config.options)
      })

      await Promise.all(promises)
    },

    /**
     * Cancel all animations on an element
     * @param {HTMLElement|string} element - Element or selector
     */
    cancel(element) {
      const el = typeof element === "string" ? document.querySelector(element) : element

      if (!el) return

      // Cancel Web Animations API animations
      const animations = el.getAnimations()
      animations.forEach((anim) => anim.cancel())

      // Remove from registry
      this.activeAnimations.forEach((anim, id) => {
        if (anim.effect?.target === el) {
          anim.cancel()
          this.activeAnimations.delete(id)
        }
      })
    },

    /**
     * Pause all animations on an element
     * @param {HTMLElement|string} element - Element or selector
     */
    pause(element) {
      const el = typeof element === "string" ? document.querySelector(element) : element

      if (!el) return

      const animations = el.getAnimations()
      animations.forEach((anim) => anim.pause())
    },

    /**
     * Resume all animations on an element
     * @param {HTMLElement|string} element - Element or selector
     */
    resume(element) {
      const el = typeof element === "string" ? document.querySelector(element) : element

      if (!el) return

      const animations = el.getAnimations()
      animations.forEach((anim) => anim.play())
    },

    /**
     * Create a delay promise
     * @param {number} ms - Delay in milliseconds
     * @returns {Promise<void>}
     */
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },

    /**
     * Register custom animation preset
     * @param {string} name - Animation name
     * @param {Object} config - Animation configuration
     * @param {Array} config.keyframes - Animation keyframes
     * @param {Object} config.options - Animation options
     */
    register(name, config) {
      if (this.presets[name]) {
        console.warn(`[Adiox Animations] Animation "${name}" already exists`)
      }

      this.presets[name] = config
      window.AdiCore.emit("animation:registered", { name })
    },

    /**
     * Shorthand methods for common animations
     */
    fadeIn(element, options) {
      return this.apply(element, "fadeIn", options)
    },

    fadeOut(element, options) {
      return this.apply(element, "fadeOut", options)
    },

    slideUp(element, options) {
      return this.apply(element, "slideUp", options)
    },

    slideDown(element, options) {
      return this.apply(element, "slideDown", options)
    },

    slideLeft(element, options) {
      return this.apply(element, "slideLeft", options)
    },

    slideRight(element, options) {
      return this.apply(element, "slideRight", options)
    },

    scale(element, options) {
      return this.apply(element, "scale", options)
    },

    bounce(element, options) {
      return this.apply(element, "bounce", options)
    },

    shake(element, options) {
      return this.apply(element, "shake", options)
    },

    pulse(element, options) {
      return this.apply(element, "pulse", options)
    },

    spin(element, options) {
      return this.apply(element, "spin", options)
    },

    /**
     * Scroll-triggered animations
     * @param {HTMLElement|string} element - Element or selector
     * @param {string|Object} animation - Animation name or config
     * @param {Object} [options] - Options
     * @param {number} [options.threshold=0.1] - Intersection threshold
     * @param {boolean} [options.once=true] - Animate only once
     */
    onScroll(element, animation, options = {}) {
      const el = typeof element === "string" ? document.querySelector(element) : element

      if (!el) {
        console.error("[Adiox Animations] Element not found")
        return
      }

      const threshold = options.threshold || 0.1
      const once = options.once !== false

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.apply(entry.target, animation, options)

              if (once) {
                observer.unobserve(entry.target)
              }
            }
          })
        },
        { threshold },
      )

      observer.observe(el)

      return observer
    },

    /**
     * Animate on hover
     * @param {HTMLElement|string} element - Element or selector
     * @param {string|Object} animation - Animation name or config
     * @param {Object} [options] - Animation options
     */
    onHover(element, animation, options = {}) {
      const el = typeof element === "string" ? document.querySelector(element) : element

      if (!el) {
        console.error("[Adiox Animations] Element not found")
        return
      }

      el.addEventListener("mouseenter", () => {
        this.apply(el, animation, options)
      })
    },

    /**
     * Get all active animations
     * @returns {Map} Active animations map
     */
    getActiveAnimations() {
      return this.activeAnimations
    },

    /**
     * Cancel all active animations
     */
    cancelAll() {
      this.activeAnimations.forEach((anim) => anim.cancel())
      this.activeAnimations.clear()
    },
  }

  // Export to window
  window.AdiAnimations = AdiAnimations

  // EMADOCS FRAMEWORK - ANIMATIONS MODULE
  const EmaAnimations = {
    presets: {
      fadeIn: {
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        options: { duration: 300, easing: "ease" },
      },
      fadeOut: {
        keyframes: [{ opacity: 1 }, { opacity: 0 }],
        options: { duration: 300, easing: "ease" },
      },
      slideUp: {
        keyframes: [
          { opacity: 0, transform: "translateY(30px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        options: { duration: 300, easing: "ease-out" },
      },
      slideDown: {
        keyframes: [
          { opacity: 0, transform: "translateY(-30px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        options: { duration: 300, easing: "ease-out" },
      },
      slideLeft: {
        keyframes: [
          { opacity: 0, transform: "translateX(30px)" },
          { opacity: 1, transform: "translateX(0)" },
        ],
        options: { duration: 300, easing: "ease-out" },
      },
      slideRight: {
        keyframes: [
          { opacity: 0, transform: "translateX(-30px)" },
          { opacity: 1, transform: "translateX(0)" },
        ],
        options: { duration: 300, easing: "ease-out" },
      },
      scale: {
        keyframes: [
          { opacity: 0, transform: "scale(0.9)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        options: { duration: 300, easing: "ease-out" },
      },
      scaleUp: {
        keyframes: [{ transform: "scale(1)" }, { transform: "scale(1.05)" }, { transform: "scale(1)" }],
        options: { duration: 400, easing: "ease-in-out" },
      },
      bounce: {
        keyframes: [
          { transform: "translateY(0)" },
          { transform: "translateY(-20px)" },
          { transform: "translateY(0)" },
          { transform: "translateY(-10px)" },
          { transform: "translateY(0)" },
        ],
        options: { duration: 600, easing: "ease-in-out" },
      },
      shake: {
        keyframes: [
          { transform: "translateX(0)" },
          { transform: "translateX(-10px)" },
          { transform: "translateX(10px)" },
          { transform: "translateX(-10px)" },
          { transform: "translateX(10px)" },
          { transform: "translateX(0)" },
        ],
        options: { duration: 500, easing: "ease-in-out" },
      },
      pulse: {
        keyframes: [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(1.05)", opacity: 0.9 },
          { transform: "scale(1)", opacity: 1 },
        ],
        options: { duration: 500, easing: "ease-in-out" },
      },
      spin: {
        keyframes: [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
        options: { duration: 1000, easing: "linear", iterations: Number.POSITIVE_INFINITY },
      },
      flip: {
        keyframes: [
          { transform: "perspective(400px) rotateY(0)" },
          { transform: "perspective(400px) rotateY(180deg)" },
        ],
        options: { duration: 600, easing: "ease-in-out" },
      },
      zoomIn: {
        keyframes: [
          { opacity: 0, transform: "scale(0.5)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        options: { duration: 300, easing: "ease-out" },
      },
      zoomOut: {
        keyframes: [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(0.5)" },
        ],
        options: { duration: 300, easing: "ease-in" },
      },
      rotate: {
        keyframes: [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
        options: { duration: 600, easing: "ease-in-out" },
      },
      swing: {
        keyframes: [
          { transform: "rotate(0deg)" },
          { transform: "rotate(15deg)" },
          { transform: "rotate(-10deg)" },
          { transform: "rotate(5deg)" },
          { transform: "rotate(-5deg)" },
          { transform: "rotate(0deg)" },
        ],
        options: { duration: 800, easing: "ease-in-out" },
      },
    },

    activeAnimations: new Map(),

    prefersReducedMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    },

    async apply(element, animation, options = {}) {
      const el = typeof element === "string" ? document.querySelector(element) : element

      if (!el) {
        console.error("[Emadocs Animations] Element not found")
        return Promise.reject(new Error("Element not found"))
      }

      if (this.prefersReducedMotion()) {
        return Promise.resolve(null)
      }

      let config
      if (typeof animation === "string") {
        config = this.presets[animation]
        if (!config) {
          console.error(`[Emadocs Animations] Animation "${animation}" not found`)
          return Promise.reject(new Error("Animation not found"))
        }
      } else {
        config = animation
      }

      const animOptions = {
        ...config.options,
        ...options,
        fill: options.fill || "both",
      }

      const anim = el.animate(config.keyframes, animOptions)

      const animId = `${el.id || "el"}-${Date.now()}`
      this.activeAnimations.set(animId, anim)

      window.EmaCore.emit("animation:started", { element: el, animation, animId })

      return new Promise((resolve) => {
        anim.onfinish = () => {
          this.activeAnimations.delete(animId)
          window.EmaCore.emit("animation:finished", { element: el, animation, animId })
          resolve(anim)
        }

        anim.oncancel = () => {
          this.activeAnimations.delete(animId)
          window.EmaCore.emit("animation:cancelled", { element: el, animation, animId })
          resolve(anim)
        }
      })
    },

    async sequence(animations, stagger = 100) {
      for (let i = 0; i < animations.length; i++) {
        const { element, animation, options = {} } = animations[i]
        await this.apply(element, animation, options)
        if (i < animations.length - 1) {
          await this.delay(stagger)
        }
      }
    },

    async stagger(animations, stagger = 100) {
      const promises = animations.map((config, index) => {
        return this.delay(index * stagger).then(() => {
          return this.apply(config.element, config.animation, config.options)
        })
      })

      await Promise.all(promises)
    },

    async parallel(animations) {
      const promises = animations.map((config) => {
        return this.apply(config.element, config.animation, config.options)
      })

      await Promise.all(promises)
    },

    cancel(element) {
      const el = typeof element === "string" ? document.querySelector(element) : element

      if (!el) return

      const animations = el.getAnimations()
      animations.forEach((anim) => anim.cancel())

      this.activeAnimations.forEach((anim, id) => {
        if (anim.effect?.target === el) {
          anim.cancel()
          this.activeAnimations.delete(id)
        }
      })
    },

    pause(element) {
      const el = typeof element === "string" ? document.querySelector(element) : element

      if (!el) return

      const animations = el.getAnimations()
      animations.forEach((anim) => anim.pause())
    },

    resume(element) {
      const el = typeof element === "string" ? document.querySelector(element) : element

      if (!el) return

      const animations = el.getAnimations()
      animations.forEach((anim) => anim.play())
    },

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },

    register(name, config) {
      if (this.presets[name]) {
        console.warn(`[Emadocs Animations] Animation "${name}" already exists`)
      }

      this.presets[name] = config
      window.EmaCore.emit("animation:registered", { name })
    },

    fadeIn(element, options) {
      return this.apply(element, "fadeIn", options)
    },

    fadeOut(element, options) {
      return this.apply(element, "fadeOut", options)
    },

    slideUp(element, options) {
      return this.apply(element, "slideUp", options)
    },

    slideDown(element, options) {
      return this.apply(element, "slideDown", options)
    },

    slideLeft(element, options) {
      return this.apply(element, "slideLeft", options)
    },

    slideRight(element, options) {
      return this.apply(element, "slideRight", options)
    },

    scale(element, options) {
      return this.apply(element, "scale", options)
    },

    bounce(element, options) {
      return this.apply(element, "bounce", options)
    },

    shake(element, options) {
      return this.apply(element, "shake", options)
    },

    pulse(element, options) {
      return this.apply(element, "pulse", options)
    },

    spin(element, options) {
      return this.apply(element, "spin", options)
    },

    onScroll(element, animation, options = {}) {
      const el = typeof element === "string" ? document.querySelector(element) : element

      if (!el) {
        console.error("[Emadocs Animations] Element not found")
        return
      }

      const threshold = options.threshold || 0.1
      const once = options.once !== false

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.apply(entry.target, animation, options)

              if (once) {
                observer.unobserve(entry.target)
              }
            }
          })
        },
        { threshold },
      )

      observer.observe(el)

      return observer
    },

    onHover(element, animation, options = {}) {
      const el = typeof element === "string" ? document.querySelector(element) : element

      if (!el) {
        console.error("[Emadocs Animations] Element not found")
        return
      }

      el.addEventListener("mouseenter", () => {
        this.apply(el, animation, options)
      })
    },

    getActiveAnimations() {
      return this.activeAnimations
    },

    cancelAll() {
      this.activeAnimations.forEach((anim) => anim.cancel())
      this.activeAnimations.clear()
    },
  }

  window.EmaAnimations = EmaAnimations
})(window)
