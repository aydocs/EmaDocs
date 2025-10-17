/**
 * @module WebSocket
 * @description WebSocket wrapper with reconnection and event handling
 */

window.Adiox = window.Adiox || {}

window.Adiox.WebSocket = class {
  constructor(url, options = {}) {
    this.url = url
    this.options = {
      reconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      ...options,
    }

    this.ws = null
    this.reconnectAttempts = 0
    this.listeners = new Map()
    this.messageQueue = []
    this.isConnected = false

    this.connect()
  }

  /**
   * Connect to WebSocket server
   */
  connect() {
    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        this.isConnected = true
        this.reconnectAttempts = 0
        this.emit("open")
        this.flushMessageQueue()
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.emit("message", data)

          if (data.type) {
            this.emit(data.type, data.payload)
          }
        } catch (e) {
          this.emit("message", event.data)
        }
      }

      this.ws.onerror = (error) => {
        this.emit("error", error)
      }

      this.ws.onclose = () => {
        this.isConnected = false
        this.emit("close")

        if (this.options.reconnect && this.reconnectAttempts < this.options.maxReconnectAttempts) {
          this.reconnectAttempts++
          setTimeout(() => this.connect(), this.options.reconnectInterval)
        }
      }
    } catch (error) {
      console.error("[Adiox WebSocket] Connection error:", error)
    }
  }

  /**
   * Send message to server
   */
  send(type, payload) {
    const message = JSON.stringify({ type, payload })

    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message)
    } else {
      this.messageQueue.push(message)
    }
  }

  /**
   * Flush queued messages
   */
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      this.ws.send(message)
    }
  }

  /**
   * Listen to events
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  /**
   * Emit event
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(data))
    }
  }

  /**
   * Close connection
   */
  close() {
    this.options.reconnect = false
    if (this.ws) {
      this.ws.close()
    }
  }
}
