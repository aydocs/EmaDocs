/**
 * ADIOX FRAMEWORK - ROUTER MODULE
 * SPA routing with History API, route params, lazy loading, and hooks
 * @version 1.0.0
 */

;((window) => {
  const AdiRouter = {
    routes: new Map(),
    notFoundHandler: null,
    currentRoute: null,
    currentParams: {},
    hooks: {
      beforeEnter: [],
      afterEnter: [],
    },
    mode: "hash", // 'hash' or 'history'
    outlet: null,

    /**
     * Initialize router
     * @param {Object} options - Router options
     * @param {string} [options.mode='hash'] - Routing mode ('hash' or 'history')
     * @param {string} [options.outlet='router-outlet'] - Outlet element ID
     */
    init(options = {}) {
      this.mode = options.mode || "hash"
      this.outlet = document.getElementById(options.outlet || "router-outlet")

      if (!this.outlet) {
        console.error("[Adiox Router] Outlet element not found")
        return
      }

      // Handle initial route
      this.handleRoute()

      // Listen for navigation events
      if (this.mode === "hash") {
        window.addEventListener("hashchange", () => this.handleRoute())
      } else {
        window.addEventListener("popstate", () => this.handleRoute())

        // Intercept link clicks
        document.addEventListener("click", (e) => {
          const link = e.target.closest("a[href]")
          if (link && link.href.startsWith(window.location.origin)) {
            e.preventDefault()
            const path = link.getAttribute("href")
            this.navigate(path)
          }
        })
      }

      window.AdiCore.emit("router:initialized", { mode: this.mode })
    },

    /**
     * Add a route
     * @param {string} path - Route path (supports :param syntax)
     * @param {Function|Object} handler - Route handler or config object
     * @param {Function} [handler.component] - Component function
     * @param {Function} [handler.beforeEnter] - Before enter hook
     * @param {Function} [handler.afterEnter] - After enter hook
     * @param {Function} [handler.lazy] - Lazy load function
     */
    addRoute(path, handler) {
      const config = typeof handler === "function" ? { component: handler } : handler

      this.routes.set(path, config)
      window.AdiCore.emit("router:route-added", { path })
    },

    /**
     * Add multiple routes
     * @param {Object} routes - Routes object { path: handler }
     */
    addRoutes(routes) {
      Object.entries(routes).forEach(([path, handler]) => {
        this.addRoute(path, handler)
      })
    },

    /**
     * Set 404 handler
     * @param {Function} handler - Handler for not found routes
     */
    set404(handler) {
      this.notFoundHandler = handler
    },

    /**
     * Add global before enter hook
     * @param {Function} hook - Hook function (receives { path, params })
     */
    beforeEnter(hook) {
      this.hooks.beforeEnter.push(hook)
    },

    /**
     * Add global after enter hook
     * @param {Function} hook - Hook function (receives { path, params })
     */
    afterEnter(hook) {
      this.hooks.afterEnter.push(hook)
    },

    /**
     * Navigate to a route
     * @param {string} path - Route path
     * @param {Object} [options] - Navigation options
     * @param {boolean} [options.replace=false] - Replace history instead of push
     */
    navigate(path, options = {}) {
      if (this.mode === "hash") {
        const hash = path.startsWith("#") ? path : `#${path}`
        if (options.replace) {
          window.location.replace(window.location.pathname + hash)
        } else {
          window.location.hash = hash
        }
      } else {
        if (options.replace) {
          window.history.replaceState({}, "", path)
        } else {
          window.history.pushState({}, "", path)
        }
        this.handleRoute()
      }
    },

    /**
     * Go back in history
     */
    back() {
      window.history.back()
    },

    /**
     * Go forward in history
     */
    forward() {
      window.history.forward()
    },

    /**
     * Match route path with current path
     * @param {string} routePath - Route path pattern
     * @param {string} currentPath - Current path
     * @returns {Object|null} Match result with params or null
     */
    matchRoute(routePath, currentPath) {
      const routeParts = routePath.split("/").filter(Boolean)
      const pathParts = currentPath.split("/").filter(Boolean)

      if (routeParts.length !== pathParts.length) {
        return null
      }

      const params = {}

      for (let i = 0; i < routeParts.length; i++) {
        const routePart = routeParts[i]
        const pathPart = pathParts[i]

        if (routePart.startsWith(":")) {
          // Dynamic parameter
          const paramName = routePart.slice(1)
          params[paramName] = decodeURIComponent(pathPart)
        } else if (routePart !== pathPart) {
          // Static part doesn't match
          return null
        }
      }

      return { params }
    },

    /**
     * Find matching route for current path
     * @param {string} path - Current path
     * @returns {Object|null} Route config and params or null
     */
    findRoute(path) {
      for (const [routePath, config] of this.routes) {
        const match = this.matchRoute(routePath, path)
        if (match) {
          return { config, params: match.params, path: routePath }
        }
      }
      return null
    },

    /**
     * Handle current route
     */
    async handleRoute() {
      const path = this.getCurrentPath()
      const match = this.findRoute(path)

      if (!match && !this.notFoundHandler) {
        console.error("[Adiox Router] No handler found for route:", path)
        return
      }

      const config = match ? match.config : { component: this.notFoundHandler }
      const params = match ? match.params : {}

      this.currentParams = params

      // Run global before enter hooks
      for (const hook of this.hooks.beforeEnter) {
        const result = await hook({ path, params })
        if (result === false) {
          return // Cancel navigation
        }
      }

      // Run route-specific before enter hook
      if (config.beforeEnter) {
        const result = await config.beforeEnter({ path, params })
        if (result === false) {
          return // Cancel navigation
        }
      }

      // Lazy load component if needed
      if (config.lazy) {
        try {
          const module = await config.lazy()
          config.component = module.default || module
        } catch (error) {
          console.error("[Adiox Router] Failed to lazy load component:", error)
          return
        }
      }

      // Get component content
      const content = config.component ? config.component(params) : ""

      // Animate transition
      await this.transitionTo(content)

      // Update current route
      this.currentRoute = path

      // Run global after enter hooks
      for (const hook of this.hooks.afterEnter) {
        await hook({ path, params })
      }

      // Run route-specific after enter hook
      if (config.afterEnter) {
        await config.afterEnter({ path, params })
      }

      // Emit route change event
      window.AdiCore.emit("router:changed", { path, params })
    },

    /**
     * Transition to new content with animation
     * @param {string} content - New content HTML
     * @returns {Promise<void>}
     */
    async transitionTo(content) {
      if (!this.outlet) return

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (prefersReducedMotion) {
        this.outlet.innerHTML = content
        return
      }

      // Fade out
      this.outlet.style.transition = "opacity 0.2s ease, transform 0.2s ease"
      this.outlet.style.opacity = "0"
      this.outlet.style.transform = "translateY(10px)"

      await new Promise((resolve) => setTimeout(resolve, 200))

      // Update content
      this.outlet.innerHTML = content

      // Fade in
      requestAnimationFrame(() => {
        this.outlet.style.opacity = "1"
        this.outlet.style.transform = "translateY(0)"
      })

      await new Promise((resolve) => setTimeout(resolve, 200))
    },

    /**
     * Get current path
     * @returns {string} Current path
     */
    getCurrentPath() {
      if (this.mode === "hash") {
        return window.location.hash.slice(1) || "/"
      } else {
        return window.location.pathname
      }
    },

    /**
     * Get current route
     * @returns {string} Current route path
     */
    getCurrentRoute() {
      return this.currentRoute
    },

    /**
     * Get current route params
     * @returns {Object} Current route params
     */
    getParams() {
      return this.currentParams
    },

    /**
     * Get specific param value
     * @param {string} name - Param name
     * @returns {string|undefined} Param value
     */
    getParam(name) {
      return this.currentParams[name]
    },
  }

  // Export to window
  window.AdiRouter = AdiRouter
})(window)
