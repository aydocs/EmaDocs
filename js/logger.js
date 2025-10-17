/**
 * @module Logger
 * @description Advanced logging system with levels and formatting
 */

window.Adiox = window.Adiox || {}

window.Adiox.Logger = class {
  constructor(namespace = "Adiox", options = {}) {
    this.namespace = namespace
    this.options = {
      level: "info", // debug, info, warn, error
      timestamp: true,
      colors: true,
      persist: false,
      maxLogs: 1000,
      ...options,
    }

    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    }

    this.colors = {
      debug: "#6b7280",
      info: "#3b82f6",
      warn: "#f59e0b",
      error: "#ef4444",
    }

    this.logs = []
    this.currentLevel = this.levels[this.options.level] || 1
  }

  /**
   * Debug log
   */
  debug(...args) {
    this._log("debug", args)
  }

  /**
   * Info log
   */
  info(...args) {
    this._log("info", args)
  }

  /**
   * Warning log
   */
  warn(...args) {
    this._log("warn", args)
  }

  /**
   * Error log
   */
  error(...args) {
    this._log("error", args)
  }

  /**
   * Internal log method
   */
  _log(level, args) {
    if (this.levels[level] < this.currentLevel) return

    const timestamp = new Date().toISOString()
    const log = {
      level,
      timestamp,
      namespace: this.namespace,
      message: args,
    }

    // Store log
    this.logs.push(log)
    if (this.logs.length > this.options.maxLogs) {
      this.logs.shift()
    }

    // Persist if enabled
    if (this.options.persist) {
      this._persistLog(log)
    }

    // Console output
    const prefix = this.options.timestamp ? `[${timestamp}]` : ""
    const ns = `[${this.namespace}]`

    if (this.options.colors) {
      console.log(
        `%c${prefix} %c${ns} %c${level.toUpperCase()}`,
        "color: #9ca3af",
        "color: #3b82f6; font-weight: bold",
        `color: ${this.colors[level]}; font-weight: bold`,
        ...args,
      )
    } else {
      console[level](`${prefix} ${ns} ${level.toUpperCase()}:`, ...args)
    }
  }

  /**
   * Persist log to localStorage
   */
  _persistLog(log) {
    try {
      const key = `adiox_logs_${this.namespace}`
      const stored = JSON.parse(localStorage.getItem(key) || "[]")
      stored.push(log)

      // Keep only recent logs
      if (stored.length > this.options.maxLogs) {
        stored.splice(0, stored.length - this.options.maxLogs)
      }

      localStorage.setItem(key, JSON.stringify(stored))
    } catch (error) {
      console.error("[Logger] Failed to persist log:", error)
    }
  }

  /**
   * Get all logs
   */
  getLogs(level = null) {
    if (level) {
      return this.logs.filter((log) => log.level === level)
    }
    return this.logs
  }

  /**
   * Clear logs
   */
  clear() {
    this.logs = []
    if (this.options.persist) {
      localStorage.removeItem(`adiox_logs_${this.namespace}`)
    }
  }

  /**
   * Set log level
   */
  setLevel(level) {
    if (this.levels[level] !== undefined) {
      this.currentLevel = this.levels[level]
      this.options.level = level
    }
  }

  /**
   * Export logs
   */
  export(format = "json") {
    if (format === "json") {
      return JSON.stringify(this.logs, null, 2)
    } else if (format === "csv") {
      const header = "Timestamp,Level,Namespace,Message\n"
      const rows = this.logs
        .map((log) => `${log.timestamp},${log.level},${log.namespace},"${JSON.stringify(log.message)}"`)
        .join("\n")
      return header + rows
    }
    return this.logs
  }
}

// Create default logger
window.Adiox.log = new window.Adiox.Logger("Adiox")
