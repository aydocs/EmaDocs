/**
 * Adiox Keyboard Module
 * Keyboard shortcuts and hotkey management
 * @module Adiox.Keyboard
 */

;(() => {
  const Keyboard = {
    _shortcuts: new Map(),
    _enabled: true,

    /**
     * Initialize keyboard module
     */
    init() {
      document.addEventListener("keydown", this._handleKeyDown.bind(this))
    },

    /**
     * Register keyboard shortcut
     * @param {string} keys - Key combination (e.g., 'ctrl+s', 'cmd+k')
     * @param {Function} callback - Callback function
     * @param {Object} options - Options
     * @returns {Function} Unregister function
     */
    register(keys, callback, options = {}) {
      const { description = "", preventDefault = true, scope = "global" } = options

      const normalized = this._normalizeKeys(keys)

      if (!this._shortcuts.has(normalized)) {
        this._shortcuts.set(normalized, [])
      }

      const shortcut = {
        callback,
        description,
        preventDefault,
        scope,
      }

      this._shortcuts.get(normalized).push(shortcut)

      // Return unregister function
      return () => {
        const shortcuts = this._shortcuts.get(normalized)
        const index = shortcuts.indexOf(shortcut)
        if (index > -1) {
          shortcuts.splice(index, 1)
        }
        if (shortcuts.length === 0) {
          this._shortcuts.delete(normalized)
        }
      }
    },

    /**
     * Unregister shortcut
     * @param {string} keys - Key combination
     */
    unregister(keys) {
      const normalized = this._normalizeKeys(keys)
      this._shortcuts.delete(normalized)
    },

    /**
     * Enable keyboard shortcuts
     */
    enable() {
      this._enabled = true
    },

    /**
     * Disable keyboard shortcuts
     */
    disable() {
      this._enabled = false
    },

    /**
     * Get all registered shortcuts
     * @returns {Array}
     */
    getAll() {
      const result = []
      this._shortcuts.forEach((shortcuts, keys) => {
        shortcuts.forEach((shortcut) => {
          result.push({
            keys,
            description: shortcut.description,
            scope: shortcut.scope,
          })
        })
      })
      return result
    },

    /**
     * Handle keydown event
     * @private
     */
    _handleKeyDown(e) {
      if (!this._enabled) return

      const keys = this._getKeysFromEvent(e)
      const shortcuts = this._shortcuts.get(keys)

      if (shortcuts) {
        shortcuts.forEach((shortcut) => {
          if (shortcut.preventDefault) {
            e.preventDefault()
          }
          shortcut.callback(e)
        })
      }
    },

    /**
     * Get key combination from event
     * @private
     */
    _getKeysFromEvent(e) {
      const parts = []

      if (e.ctrlKey || e.metaKey) parts.push("ctrl")
      if (e.altKey) parts.push("alt")
      if (e.shiftKey) parts.push("shift")

      const key = e.key.toLowerCase()
      if (!["control", "alt", "shift", "meta"].includes(key)) {
        parts.push(key)
      }

      return parts.join("+")
    },

    /**
     * Normalize key combination
     * @private
     */
    _normalizeKeys(keys) {
      return keys
        .toLowerCase()
        .replace("cmd", "ctrl")
        .replace("command", "ctrl")
        .split("+")
        .map((k) => k.trim())
        .sort()
        .join("+")
    },
  }

  // Auto-initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => Keyboard.init())
  } else {
    Keyboard.init()
  }

  // Attach to Adiox
  if (typeof window.Adiox !== "undefined") {
    window.Adiox.Keyboard = Keyboard
  } else {
    console.warn("[Adiox Keyboard] Adiox core not found")
  }
})()
