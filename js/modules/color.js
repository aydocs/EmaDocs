/**
 * EMADOCS - COLOR MODULE
 */
;((window) => {
  const EmaColor = {
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
          }
        : null
    },

    rgbToHex(r, g, b) {
      return (
        "#" +
        [r, g, b]
          .map((x) => {
            const hex = x.toString(16)
            return hex.length === 1 ? "0" + hex : hex
          })
          .join("")
      )
    },

    lighten(hex, percent) {
      const rgb = this.hexToRgb(hex)
      if (!rgb) return hex

      const amount = Math.round(2.55 * percent)
      return this.rgbToHex(Math.min(255, rgb.r + amount), Math.min(255, rgb.g + amount), Math.min(255, rgb.b + amount))
    },

    darken(hex, percent) {
      return this.lighten(hex, -percent)
    },
  }

  window.EmaColor = EmaColor
})(window)
