/**
 * @module QRCode
 * @description QR code generator (pure JavaScript implementation)
 */

window.Adiox = window.Adiox || {}

window.Adiox.QRCode = {
  /**
   * Generate QR code as SVG
   */
  generate(text, options = {}) {
    const { size = 256, margin = 4, color = "#000000", background = "#ffffff" } = options

    // Simple QR code generation (basic implementation)
    // For production, consider using a full QR library
    const qrSize = 21 // Version 1 QR code
    const moduleSize = (size - margin * 2) / qrSize

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`
    svg += `<rect width="${size}" height="${size}" fill="${background}"/>`

    // Generate pattern (simplified - real QR needs error correction)
    const data = this._encodeText(text)

    for (let y = 0; y < qrSize; y++) {
      for (let x = 0; x < qrSize; x++) {
        if (data[y * qrSize + x]) {
          const px = margin + x * moduleSize
          const py = margin + y * moduleSize
          svg += `<rect x="${px}" y="${py}" width="${moduleSize}" height="${moduleSize}" fill="${color}"/>`
        }
      }
    }

    svg += "</svg>"
    return svg
  },

  /**
   * Generate QR code as data URL
   */
  generateDataURL(text, options = {}) {
    const svg = this.generate(text, options)
    return "data:image/svg+xml;base64," + btoa(svg)
  },

  /**
   * Render QR code to element
   */
  render(element, text, options = {}) {
    if (typeof element === "string") {
      element = document.querySelector(element)
    }

    if (!element) return

    const svg = this.generate(text, options)
    element.innerHTML = svg
  },

  /**
   * Simple text encoding (placeholder)
   */
  _encodeText(text) {
    const qrSize = 21
    const data = new Array(qrSize * qrSize).fill(false)

    // Add finder patterns (corners)
    this._addFinderPattern(data, qrSize, 0, 0)
    this._addFinderPattern(data, qrSize, qrSize - 7, 0)
    this._addFinderPattern(data, qrSize, 0, qrSize - 7)

    // Add data (simplified)
    for (let i = 0; i < text.length && i < 50; i++) {
      const charCode = text.charCodeAt(i)
      for (let bit = 0; bit < 8; bit++) {
        const index = (i * 8 + bit + 100) % data.length
        data[index] = (charCode >> bit) & 1
      }
    }

    return data
  },

  /**
   * Add finder pattern
   */
  _addFinderPattern(data, qrSize, startX, startY) {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const isEdge = x === 0 || x === 6 || y === 0 || y === 6
        const isCenter = x >= 2 && x <= 4 && y >= 2 && y <= 4
        if (isEdge || isCenter) {
          data[(startY + y) * qrSize + (startX + x)] = true
        }
      }
    }
  },
}
