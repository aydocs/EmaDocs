/**
 * @module Analytics
 * @description Analytics and tracking utilities
 */

window.Adiox = window.Adiox || {}

window.Adiox.Analytics = {
  providers: new Map(),
  queue: [],
  initialized: false,

  /**
   * Initialize analytics
   */
  init(config = {}) {
    this.config = config
    this.initialized = true

    // Process queued events
    this.queue.forEach((event) => this.track(event.name, event.data))
    this.queue = []

    // Auto-track page views
    if (config.autoTrack !== false) {
      this.trackPageView()

      // Track SPA navigation
      window.Adiox.Core.on("route:change", (data) => {
        this.trackPageView(data.path)
      })
    }
  },

  /**
   * Add analytics provider
   */
  addProvider(name, provider) {
    this.providers.set(name, provider)
  },

  /**
   * Track event
   */
  track(eventName, data = {}) {
    if (!this.initialized) {
      this.queue.push({ name: eventName, data })
      return
    }

    const event = {
      name: eventName,
      data,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    }

    // Send to all providers
    this.providers.forEach((provider, name) => {
      try {
        provider.track(event)
      } catch (error) {
        console.error(`[Adiox Analytics] Provider ${name} error:`, error)
      }
    })

    // Emit event
    window.Adiox.Core.emit("analytics:track", event)
  },

  /**
   * Track page view
   */
  trackPageView(path = window.location.pathname) {
    this.track("page_view", {
      path,
      title: document.title,
      referrer: document.referrer,
    })
  },

  /**
   * Track click
   */
  trackClick(element, data = {}) {
    this.track("click", {
      element: element.tagName,
      text: element.textContent?.trim(),
      ...data,
    })
  },

  /**
   * Track form submission
   */
  trackFormSubmit(formId, data = {}) {
    this.track("form_submit", {
      formId,
      ...data,
    })
  },

  /**
   * Track error
   */
  trackError(error, context = {}) {
    this.track("error", {
      message: error.message,
      stack: error.stack,
      ...context,
    })
  },

  /**
   * Set user properties
   */
  setUser(userId, properties = {}) {
    this.userId = userId
    this.userProperties = properties

    this.providers.forEach((provider) => {
      if (provider.setUser) {
        provider.setUser(userId, properties)
      }
    })
  },

  /**
   * Console provider (for debugging)
   */
  consoleProvider: {
    track(event) {
      console.log("[Analytics]", event.name, event.data)
    },
    setUser(userId, properties) {
      console.log("[Analytics] User:", userId, properties)
    },
  },
}
