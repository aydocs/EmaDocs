/**
 * EMADOCS - PERFORMANCE MODULE
 */
;((window) => {
  const EmaPerformance = {
    marks: new Map(),

    mark(name) {
      this.marks.set(name, performance.now())
    },

    measure(name, startMark) {
      const start = this.marks.get(startMark)
      if (!start) return null

      const duration = performance.now() - start
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
      return duration
    },

    getMemory() {
      return performance.memory
        ? {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit,
          }
        : null
    },

    getFPS() {
      let lastTime = performance.now()
      let frames = 0
      let fps = 0

      const measure = () => {
        frames++
        const currentTime = performance.now()
        if (currentTime >= lastTime + 1000) {
          fps = Math.round((frames * 1000) / (currentTime - lastTime))
          frames = 0
          lastTime = currentTime
        }
        requestAnimationFrame(measure)
      }

      measure()
      return () => fps
    },
  }

  window.EmaPerformance = EmaPerformance
})(window)
