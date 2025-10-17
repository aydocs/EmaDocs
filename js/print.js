/**
 * Adiox Print Module
 * Print utilities with custom styling
 * @module Adiox.Print
 */

;(() => {
  const Print = {
    /**
     * Print element content
     * @param {HTMLElement|string} element - Element or selector
     * @param {Object} options - Print options
     */
    print(element, options = {}) {
      const el = typeof element === "string" ? document.querySelector(element) : element
      if (!el) {
        console.error("[Adiox Print] Element not found")
        return
      }

      const { title = document.title, styles = "", beforePrint = null, afterPrint = null } = options

      // Create print window
      const printWindow = window.open("", "_blank")

      // Build HTML
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
              @media print {
                body { padding: 0; }
                @page { margin: 1cm; }
              }
              ${styles}
            </style>
          </head>
          <body>
            ${el.innerHTML}
          </body>
        </html>
      `

      printWindow.document.write(html)
      printWindow.document.close()

      // Wait for content to load
      printWindow.onload = () => {
        if (beforePrint) beforePrint()
        printWindow.print()
        if (afterPrint) afterPrint()
        printWindow.close()
      }
    },

    /**
     * Print current page
     */
    printPage() {
      window.print()
    },

    /**
     * Generate print-friendly version
     * @param {Object} options - Generation options
     */
    generatePrintVersion(options = {}) {
      const { hideElements = [], showElements = [], customCSS = "" } = options

      // Create style element
      const style = document.createElement("style")
      style.id = "adiox-print-styles"

      let css = "@media print {"

      // Hide elements
      hideElements.forEach((selector) => {
        css += `${selector} { display: none !important; }`
      })

      // Show elements
      showElements.forEach((selector) => {
        css += `${selector} { display: block !important; }`
      })

      css += customCSS
      css += "}"

      style.textContent = css
      document.head.appendChild(style)

      return () => {
        // Cleanup function
        const styleEl = document.getElementById("adiox-print-styles")
        if (styleEl) styleEl.remove()
      }
    },
  }

  // Attach to Adiox
  if (typeof window.Adiox !== "undefined") {
    window.Adiox.Print = Print
  } else {
    console.warn("[Adiox Print] Adiox core not found")
  }
})()
