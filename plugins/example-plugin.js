/**
 * Example Adiox Plugin
 *
 * Demonstrates how to create a plugin for the Adiox framework.
 * This plugin adds a simple analytics tracking system.
 *
 * @example
 * // Register the plugin
 * Adiox.use(AnalyticsPlugin, {
 *   trackingId: 'UA-XXXXX-Y',
 *   debug: true
 * });
 *
 * // Use the plugin
 * Adiox.Analytics.track('page_view', { page: '/home' });
 */

const AnalyticsPlugin = {
  name: "Analytics",
  version: "1.0.0",

  /**
   * Plugin installation method
   * Called when plugin is registered with Adiox.use()
   *
   * @param {Object} Adiox - The Adiox framework instance
   * @param {Object} options - Plugin configuration options
   */
  install(Adiox, options = {}) {
    const config = {
      trackingId: options.trackingId || "",
      debug: options.debug || false,
      autoTrack: options.autoTrack !== false,
    }

    // Event queue for tracking
    const eventQueue = []
    let isInitialized = false

    /**
     * Initialize analytics
     */
    const init = () => {
      if (isInitialized) return

      if (config.debug) {
        console.log("[Analytics Plugin] Initialized with config:", config)
      }

      // Auto-track page views if enabled
      if (config.autoTrack) {
        trackPageView()

        // Track route changes
        Adiox.on("route:change", (data) => {
          trackPageView(data.path)
        })
      }

      isInitialized = true
    }

    /**
     * Track custom event
     *
     * @param {string} eventName - Name of the event
     * @param {Object} data - Event data
     */
    const track = (eventName, data = {}) => {
      const event = {
        name: eventName,
        data,
        timestamp: Date.now(),
        url: window.location.href,
      }

      eventQueue.push(event)

      if (config.debug) {
        console.log("[Analytics Plugin] Event tracked:", event)
      }

      // In a real implementation, send to analytics service
      sendToAnalytics(event)
    }

    /**
     * Track page view
     *
     * @param {string} path - Page path (optional)
     */
    const trackPageView = (path = window.location.pathname) => {
      track("page_view", {
        path,
        title: document.title,
        referrer: document.referrer,
      })
    }

    /**
     * Track click event
     *
     * @param {string} element - Element identifier
     * @param {Object} data - Additional data
     */
    const trackClick = (element, data = {}) => {
      track("click", {
        element,
        ...data,
      })
    }

    /**
     * Send event to analytics service
     * (Mock implementation)
     *
     * @param {Object} event - Event to send
     */
    const sendToAnalytics = (event) => {
      // In a real implementation, this would send to your analytics service
      // For example: fetch('/analytics', { method: 'POST', body: JSON.stringify(event) })

      if (config.debug) {
        console.log("[Analytics Plugin] Sending to analytics service:", event)
      }
    }

    /**
     * Get all tracked events
     *
     * @returns {Array} Array of tracked events
     */
    const getEvents = () => {
      return [...eventQueue]
    }

    /**
     * Clear event queue
     */
    const clearEvents = () => {
      eventQueue.length = 0
      if (config.debug) {
        console.log("[Analytics Plugin] Event queue cleared")
      }
    }

    // Add Analytics API to Adiox
    Adiox.Analytics = {
      init,
      track,
      trackPageView,
      trackClick,
      getEvents,
      clearEvents,
      config,
    }

    // Auto-initialize
    init()

    // Emit plugin loaded event
    Adiox.emit("plugin:loaded", { name: "Analytics", version: "1.0.0" })
  },
}

// Export for use
if (typeof module !== "undefined" && module.exports) {
  module.exports = AnalyticsPlugin
}
