/**
 * Adiox Accessibility Module
 *
 * Provides utilities for building accessible web applications
 * following WCAG 2.1 AA guidelines.
 *
 * @module AdiAccessibility
 */

;((global) => {
  const AdiAccessibility = {
    /**
     * Get all focusable elements within a container
     *
     * @param {HTMLElement} container - Container element
     * @returns {Array<HTMLElement>} Array of focusable elements
     */
    getFocusableElements(container) {
      const selector = [
        "a[href]",
        "button:not([disabled])",
        "textarea:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ].join(", ")

      return Array.from(container.querySelectorAll(selector)).filter(
        (el) => !el.hasAttribute("hidden") && el.offsetParent !== null,
      )
    },

    /**
     * Trap focus within a container
     *
     * @param {HTMLElement} container - Container to trap focus in
     * @returns {Function} Cleanup function to remove trap
     */
    trapFocus(container) {
      const focusable = this.getFocusableElements(container)
      if (focusable.length === 0) return () => {}

      const firstFocusable = focusable[0]
      const lastFocusable = focusable[focusable.length - 1]

      const handleKeyDown = (e) => {
        if (e.key !== "Tab") return

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault()
            lastFocusable.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault()
            firstFocusable.focus()
          }
        }
      }

      container.addEventListener("keydown", handleKeyDown)

      // Focus first element
      firstFocusable.focus()

      // Return cleanup function
      return () => {
        container.removeEventListener("keydown", handleKeyDown)
      }
    },

    /**
     * Announce message to screen readers
     *
     * @param {string} message - Message to announce
     * @param {string} priority - Priority level ('polite' or 'assertive')
     */
    announce(message, priority = "polite") {
      let liveRegion = document.getElementById("adi-live-region")

      if (!liveRegion) {
        liveRegion = document.createElement("div")
        liveRegion.id = "adi-live-region"
        liveRegion.setAttribute("role", "status")
        liveRegion.setAttribute("aria-live", priority)
        liveRegion.setAttribute("aria-atomic", "true")
        liveRegion.style.cssText = "position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;"
        document.body.appendChild(liveRegion)
      }

      liveRegion.setAttribute("aria-live", priority)
      liveRegion.textContent = message

      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = ""
      }, 1000)
    },

    /**
     * Calculate color contrast ratio
     *
     * @param {string} color1 - First color (hex)
     * @param {string} color2 - Second color (hex)
     * @returns {number} Contrast ratio
     */
    getContrastRatio(color1, color2) {
      const getLuminance = (hex) => {
        const rgb = Number.parseInt(hex.slice(1), 16)
        const r = ((rgb >> 16) & 0xff) / 255
        const g = ((rgb >> 8) & 0xff) / 255
        const b = (rgb & 0xff) / 255

        const [rs, gs, bs] = [r, g, b].map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)))

        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
      }

      const lum1 = getLuminance(color1)
      const lum2 = getLuminance(color2)
      const lighter = Math.max(lum1, lum2)
      const darker = Math.min(lum1, lum2)

      return (lighter + 0.05) / (darker + 0.05)
    },

    /**
     * Check if contrast meets WCAG AA standards
     *
     * @param {string} foreground - Foreground color (hex)
     * @param {string} background - Background color (hex)
     * @param {boolean} largeText - Whether text is large (18pt+ or 14pt+ bold)
     * @returns {boolean} Whether contrast meets WCAG AA
     */
    meetsWCAG_AA(foreground, background, largeText = false) {
      const ratio = this.getContrastRatio(foreground, background)
      return largeText ? ratio >= 3 : ratio >= 4.5
    },

    /**
     * Add skip link for keyboard navigation
     *
     * @param {string} targetId - ID of main content element
     * @param {string} text - Skip link text
     */
    addSkipLink(targetId, text = "Skip to main content") {
      const skipLink = document.createElement("a")
      skipLink.href = `#${targetId}`
      skipLink.textContent = text
      skipLink.className = "adi-skip-link"
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--adi-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
      `

      skipLink.addEventListener("focus", () => {
        skipLink.style.top = "0"
      })

      skipLink.addEventListener("blur", () => {
        skipLink.style.top = "-40px"
      })

      document.body.insertBefore(skipLink, document.body.firstChild)
    },

    /**
     * Check if user prefers reduced motion
     *
     * @returns {boolean} Whether user prefers reduced motion
     */
    prefersReducedMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    },

    /**
     * Make element keyboard accessible
     *
     * @param {HTMLElement} element - Element to make accessible
     * @param {Function} onClick - Click handler
     */
    makeKeyboardAccessible(element, onClick) {
      if (!element.hasAttribute("tabindex")) {
        element.setAttribute("tabindex", "0")
      }

      if (!element.hasAttribute("role")) {
        element.setAttribute("role", "button")
      }

      element.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick(e)
        }
      })

      element.addEventListener("click", onClick)
    },
  }

  // Export module
  global.AdiAccessibility = AdiAccessibility

  // Add to Adiox namespace if available
  if (global.Adiox) {
    global.Adiox.A11y = AdiAccessibility
  }
})(window)
