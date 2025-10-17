/**
 * Adiox Gestures Module
 * Touch and mouse gesture recognition system
 * Supports swipe, pinch, pan, tap, long-press, rotate
 *
 * @module Gestures
 * @version 1.0.0
 */

;((Adiox) => {
  /**
   * Gesture recognizer class
   */
  class GestureRecognizer {
    constructor(element, options = {}) {
      this.element = element
      this.options = {
        threshold: options.threshold || 10,
        swipeThreshold: options.swipeThreshold || 50,
        longPressDelay: options.longPressDelay || 500,
        doubleTapDelay: options.doubleTapDelay || 300,
        preventScroll: options.preventScroll || false,
        ...options,
      }

      this.handlers = {}
      this.state = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        startTime: 0,
        startDistance: 0,
        startAngle: 0,
        isPressed: false,
        isSwiping: false,
        isPinching: false,
        lastTapTime: 0,
        tapCount: 0,
        longPressTimer: null,
      }

      this.init()
    }

    init() {
      // Touch events
      this.element.addEventListener("touchstart", this.handleStart.bind(this), { passive: !this.options.preventScroll })
      this.element.addEventListener("touchmove", this.handleMove.bind(this), { passive: !this.options.preventScroll })
      this.element.addEventListener("touchend", this.handleEnd.bind(this))
      this.element.addEventListener("touchcancel", this.handleEnd.bind(this))

      // Mouse events
      this.element.addEventListener("mousedown", this.handleStart.bind(this))
      document.addEventListener("mousemove", this.handleMove.bind(this))
      document.addEventListener("mouseup", this.handleEnd.bind(this))
    }

    handleStart(e) {
      const touch = e.touches ? e.touches[0] : e

      this.state.startX = touch.clientX
      this.state.startY = touch.clientY
      this.state.currentX = touch.clientX
      this.state.currentY = touch.clientY
      this.state.startTime = Date.now()
      this.state.isPressed = true

      // Multi-touch for pinch
      if (e.touches && e.touches.length === 2) {
        this.state.isPinching = true
        this.state.startDistance = this.getDistance(e.touches[0], e.touches[1])
        this.state.startAngle = this.getAngle(e.touches[0], e.touches[1])
      }

      // Long press detection
      this.state.longPressTimer = setTimeout(() => {
        if (this.state.isPressed && !this.state.isSwiping) {
          this.emit("longpress", {
            x: this.state.currentX,
            y: this.state.currentY,
          })
        }
      }, this.options.longPressDelay)

      this.emit("pressstart", { x: touch.clientX, y: touch.clientY })

      if (this.options.preventScroll) {
        e.preventDefault()
      }
    }

    handleMove(e) {
      if (!this.state.isPressed) return

      const touch = e.touches ? e.touches[0] : e
      this.state.currentX = touch.clientX
      this.state.currentY = touch.clientY

      const deltaX = this.state.currentX - this.state.startX
      const deltaY = this.state.currentY - this.state.startY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // Pinch gesture
      if (e.touches && e.touches.length === 2 && this.state.isPinching) {
        const currentDistance = this.getDistance(e.touches[0], e.touches[1])
        const currentAngle = this.getAngle(e.touches[0], e.touches[1])
        const scale = currentDistance / this.state.startDistance
        const rotation = currentAngle - this.state.startAngle

        this.emit("pinch", { scale, rotation })

        if (this.options.preventScroll) {
          e.preventDefault()
        }
        return
      }

      // Pan gesture
      if (distance > this.options.threshold) {
        this.state.isSwiping = true
        clearTimeout(this.state.longPressTimer)

        this.emit("pan", {
          deltaX,
          deltaY,
          distance,
          direction: this.getDirection(deltaX, deltaY),
        })
      }

      if (this.options.preventScroll && this.state.isSwiping) {
        e.preventDefault()
      }
    }

    handleEnd(e) {
      if (!this.state.isPressed) return

      clearTimeout(this.state.longPressTimer)

      const deltaX = this.state.currentX - this.state.startX
      const deltaY = this.state.currentY - this.state.startY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const duration = Date.now() - this.state.startTime

      // Swipe detection
      if (this.state.isSwiping && distance > this.options.swipeThreshold) {
        const direction = this.getDirection(deltaX, deltaY)
        const velocity = distance / duration

        this.emit("swipe", { direction, distance, velocity, deltaX, deltaY })
        this.emit(`swipe${direction}`, { distance, velocity, deltaX, deltaY })
      }

      // Tap detection
      if (!this.state.isSwiping && distance < this.options.threshold && duration < 300) {
        const now = Date.now()

        if (now - this.state.lastTapTime < this.options.doubleTapDelay) {
          this.state.tapCount++
          if (this.state.tapCount === 2) {
            this.emit("doubletap", { x: this.state.currentX, y: this.state.currentY })
            this.state.tapCount = 0
          }
        } else {
          this.state.tapCount = 1
          setTimeout(() => {
            if (this.state.tapCount === 1) {
              this.emit("tap", { x: this.state.currentX, y: this.state.currentY })
            }
            this.state.tapCount = 0
          }, this.options.doubleTapDelay)
        }

        this.state.lastTapTime = now
      }

      this.emit("pressend", {
        x: this.state.currentX,
        y: this.state.currentY,
        duration,
      })

      // Reset state
      this.state.isPressed = false
      this.state.isSwiping = false
      this.state.isPinching = false
    }

    getDistance(touch1, touch2) {
      const dx = touch2.clientX - touch1.clientX
      const dy = touch2.clientY - touch1.clientY
      return Math.sqrt(dx * dx + dy * dy)
    }

    getAngle(touch1, touch2) {
      return (Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX) * 180) / Math.PI
    }

    getDirection(deltaX, deltaY) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? "right" : "left"
      } else {
        return deltaY > 0 ? "down" : "up"
      }
    }

    on(event, handler) {
      if (!this.handlers[event]) {
        this.handlers[event] = []
      }
      this.handlers[event].push(handler)
      return this
    }

    off(event, handler) {
      if (!this.handlers[event]) return this

      if (handler) {
        this.handlers[event] = this.handlers[event].filter((h) => h !== handler)
      } else {
        delete this.handlers[event]
      }
      return this
    }

    emit(event, data) {
      if (!this.handlers[event]) return

      this.handlers[event].forEach((handler) => {
        handler({ ...data, type: event, target: this.element })
      })
    }

    destroy() {
      this.element.removeEventListener("touchstart", this.handleStart)
      this.element.removeEventListener("touchmove", this.handleMove)
      this.element.removeEventListener("touchend", this.handleEnd)
      this.element.removeEventListener("touchcancel", this.handleEnd)
      this.element.removeEventListener("mousedown", this.handleStart)
      document.removeEventListener("mousemove", this.handleMove)
      document.removeEventListener("mouseup", this.handleEnd)

      clearTimeout(this.state.longPressTimer)
      this.handlers = {}
    }
  }

  /**
   * Create gesture recognizer
   */
  function createGesture(element, options) {
    return new GestureRecognizer(element, options)
  }

  // Export
  Adiox.Gestures = {
    createGesture,
    GestureRecognizer,
  }
})(window.Adiox)
