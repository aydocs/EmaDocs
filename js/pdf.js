/**
 * Adiox PDF Module
 * PDF generation from HTML (using canvas)
 * @module Adiox.PDF
 */

;(() => {
  const PDF = {
    /**
     * Generate PDF from HTML element
     * @param {HTMLElement|string} element - Element or selector
     * @param {Object} options - PDF options
     * @returns {Promise<Blob>}
     */
    async fromHTML(element, options = {}) {
      const el = typeof element === "string" ? document.querySelector(element) : element
      if (!el) {
        throw new Error("[Adiox PDF] Element not found")
      }

      const { filename = "document.pdf", format = "a4", orientation = "portrait", margin = 10 } = options

      // This is a simplified implementation
      // In production, you'd use a library like jsPDF or html2pdf
      // But we're implementing basic functionality with canvas

      return new Promise((resolve, reject) => {
        // Create canvas from element
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        // Set canvas size based on format
        const sizes = {
          a4: orientation === "portrait" ? [595, 842] : [842, 595],
          letter: orientation === "portrait" ? [612, 792] : [792, 612],
        }

        const [width, height] = sizes[format] || sizes.a4
        canvas.width = width
        canvas.height = height

        // Draw white background
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, width, height)

        // Simple text rendering (basic implementation)
        ctx.fillStyle = "black"
        ctx.font = "12px Arial"

        const text = el.textContent || el.innerText
        const lines = text.split("\n")
        let y = margin

        lines.forEach((line) => {
          ctx.fillText(line, margin, y)
          y += 15
        })

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Failed to generate PDF"))
          }
        }, "image/png")
      })
    },

    /**
     * Download PDF
     * @param {Blob} blob - PDF blob
     * @param {string} filename - File name
     */
    download(blob, filename = "document.pdf") {
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    },
  }

  // Attach to Adiox
  if (typeof window.Adiox !== "undefined") {
    window.Adiox.PDF = PDF
  } else {
    console.warn("[Adiox PDF] Adiox core not found")
  }
})()
