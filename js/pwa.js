/**
 * @module PWA
 * @description Progressive Web App utilities with Service Worker support
 */

window.Adiox = window.Adiox || {}

window.Adiox.PWA = {
  /**
   * Register service worker
   */
  async register(swPath = "/sw.js") {
    if (!("serviceWorker" in navigator)) {
      console.warn("[Adiox PWA] Service Workers not supported")
      return null
    }

    try {
      const registration = await navigator.serviceWorker.register(swPath)
      console.log("[Adiox PWA] Service Worker registered:", registration)

      // Check for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            window.Adiox.Core.emit("pwa:update-available")
          }
        })
      })

      return registration
    } catch (error) {
      console.error("[Adiox PWA] Service Worker registration failed:", error)
      return null
    }
  },

  /**
   * Unregister service worker
   */
  async unregister() {
    if (!("serviceWorker" in navigator)) return

    const registrations = await navigator.serviceWorker.getRegistrations()
    for (const registration of registrations) {
      await registration.unregister()
    }
  },

  /**
   * Check if app is installed
   */
  isInstalled() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
  },

  /**
   * Prompt install
   */
  promptInstall() {
    if (this._deferredPrompt) {
      this._deferredPrompt.prompt()
      this._deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          window.Adiox.Core.emit("pwa:installed")
        }
        this._deferredPrompt = null
      })
    }
  },

  /**
   * Initialize PWA features
   */
  init() {
    // Capture install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault()
      this._deferredPrompt = e
      window.Adiox.Core.emit("pwa:installable")
    })

    // App installed
    window.addEventListener("appinstalled", () => {
      window.Adiox.Core.emit("pwa:installed")
    })

    // Online/offline detection
    window.addEventListener("online", () => {
      window.Adiox.Core.emit("pwa:online")
    })

    window.addEventListener("offline", () => {
      window.Adiox.Core.emit("pwa:offline")
    })
  },

  /**
   * Cache assets
   */
  async cacheAssets(cacheName, assets) {
    if (!("caches" in window)) return

    const cache = await caches.open(cacheName)
    await cache.addAll(assets)
  },

  /**
   * Clear cache
   */
  async clearCache(cacheName) {
    if (!("caches" in window)) return

    if (cacheName) {
      await caches.delete(cacheName)
    } else {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map((name) => caches.delete(name)))
    }
  },
}
