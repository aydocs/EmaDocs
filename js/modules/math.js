/**
 * EMADOCS - MATH MODULE
 */
;((window) => {
  const EmaMath = {
    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max)
    },

    lerp(start, end, t) {
      return start + (end - start) * t
    },

    map(value, inMin, inMax, outMin, outMax) {
      return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
    },

    random(min, max) {
      return Math.random() * (max - min) + min
    },

    randomInt(min, max) {
      return Math.floor(this.random(min, max + 1))
    },

    distance(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    },

    angle(x1, y1, x2, y2) {
      return Math.atan2(y2 - y1, x2 - x1)
    },
  }

  window.EmaMath = EmaMath
})(window)
