/**
 * EMADOCS - EVENT EMITTER MODULE
 */
;((window) => {
  class EmaEventEmitter {
    constructor() {
      this.events = {}
    }

    on(event, callback) {
      if (!this.events[event]) this.events[event] = []
      this.events[event].push(callback)
      return () => this.off(event, callback)
    }

    off(event, callback) {
      if (!this.events[event]) return
      this.events[event] = this.events[event].filter((cb) => cb !== callback)
    }

    emit(event, data) {
      if (!this.events[event]) return
      this.events[event].forEach((callback) => callback(data))
    }

    once(event, callback) {
      const wrapper = (data) => {
        callback(data)
        this.off(event, wrapper)
      }
      this.on(event, wrapper)
    }
  }

  window.EmaEventEmitter = EmaEventEmitter
})(window)
