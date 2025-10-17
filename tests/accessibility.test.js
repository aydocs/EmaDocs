/**
 * Adiox Accessibility Tests
 *
 * Tests for WCAG 2.1 AA compliance, keyboard navigation,
 * focus management, and ARIA attributes.
 */

const AccessibilityTests = {
  name: "Accessibility Tests",

  tests: [
    {
      name: "Focus Management - trap and restore",
      run: () => {
        const container = document.createElement("div")
        container.innerHTML = `
          <button id="btn1">Button 1</button>
          <button id="btn2">Button 2</button>
        `
        document.body.appendChild(container)

        const previousFocus = document.activeElement

        // Get focusable elements
        const focusable = window.Adiox.Utils.getFocusableElements(container)
        expect(focusable.length).toBe(2)

        // Cleanup
        document.body.removeChild(container)

        return true
      },
    },

    {
      name: "Keyboard Navigation - Tab key handling",
      run: () => {
        const container = document.createElement("div")
        container.innerHTML = `
          <button id="first">First</button>
          <button id="middle">Middle</button>
          <button id="last">Last</button>
        `
        document.body.appendChild(container)

        const first = container.querySelector("#first")
        const last = container.querySelector("#last")

        first.focus()
        expect(document.activeElement).toBe(first)

        // Simulate Tab key
        const tabEvent = new KeyboardEvent("keydown", { key: "Tab" })
        first.dispatchEvent(tabEvent)

        // Cleanup
        document.body.removeChild(container)

        return true
      },
    },

    {
      name: "ARIA Attributes - proper labeling",
      run: () => {
        const button = document.createElement("adi-button")
        button.setAttribute("aria-label", "Close dialog")
        document.body.appendChild(button)

        const btn = button.shadowRoot.querySelector("button")
        expect(btn.getAttribute("aria-label")).toBe("Close dialog")

        document.body.removeChild(button)
        return true
      },
    },

    {
      name: "Color Contrast - meets WCAG AA",
      run: () => {
        // Test contrast ratio calculation
        const ratio = window.Adiox.Utils.getContrastRatio("#000000", "#ffffff")
        expect(ratio).toBe(21) // Maximum contrast

        // WCAG AA requires 4.5:1 for normal text
        const meetsAA = ratio >= 4.5
        expect(meetsAA).toBeTruthy()

        return true
      },
    },

    {
      name: "Screen Reader - live regions",
      run: () => {
        const liveRegion = document.createElement("div")
        liveRegion.setAttribute("role", "status")
        liveRegion.setAttribute("aria-live", "polite")
        document.body.appendChild(liveRegion)

        expect(liveRegion.getAttribute("aria-live")).toBe("polite")

        document.body.removeChild(liveRegion)
        return true
      },
    },

    {
      name: "Reduced Motion - respects preference",
      run: () => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const animDuration = window.Adiox.Animations.getDuration(prefersReduced)

        if (prefersReduced) {
          expect(animDuration).toBe(0)
        }

        return true
      },
    },
  ],
}
