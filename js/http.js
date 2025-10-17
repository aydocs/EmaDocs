/**
 * Adiox HTTP Client
 * Axios-like HTTP client with interceptors, caching, and retry logic
 * @module HTTP
 */

;((Adiox) => {
  class HTTPClient {
    constructor(config = {}) {
      this.config = {
        baseURL: "",
        timeout: 30000,
        headers: {},
        ...config,
      }

      this.interceptors = {
        request: [],
        response: [],
      }

      this.cache = new Map()
      this.pendingRequests = new Map()
    }

    /**
     * Add request interceptor
     */
    addRequestInterceptor(fulfilled, rejected) {
      this.interceptors.request.push({ fulfilled, rejected })
      return this.interceptors.request.length - 1
    }

    /**
     * Add response interceptor
     */
    addResponseInterceptor(fulfilled, rejected) {
      this.interceptors.response.push({ fulfilled, rejected })
      return this.interceptors.response.length - 1
    }

    /**
     * Make HTTP request
     */
    async request(config) {
      // Merge config
      const finalConfig = {
        ...this.config,
        ...config,
        headers: {
          ...this.config.headers,
          ...config.headers,
        },
      }

      // Build URL
      const url = finalConfig.baseURL + finalConfig.url

      // Check cache
      if (finalConfig.cache && this.cache.has(url)) {
        const cached = this.cache.get(url)
        if (Date.now() - cached.timestamp < (finalConfig.cacheTime || 300000)) {
          return cached.data
        }
      }

      // Check pending requests (deduplication)
      if (this.pendingRequests.has(url)) {
        return this.pendingRequests.get(url)
      }

      // Apply request interceptors
      let requestConfig = finalConfig
      for (const interceptor of this.interceptors.request) {
        try {
          requestConfig = await interceptor.fulfilled(requestConfig)
        } catch (error) {
          if (interceptor.rejected) {
            return interceptor.rejected(error)
          }
          throw error
        }
      }

      // Make request
      const requestPromise = this._makeRequest(requestConfig)
      this.pendingRequests.set(url, requestPromise)

      try {
        let response = await requestPromise

        // Apply response interceptors
        for (const interceptor of this.interceptors.response) {
          try {
            response = await interceptor.fulfilled(response)
          } catch (error) {
            if (interceptor.rejected) {
              return interceptor.rejected(error)
            }
            throw error
          }
        }

        // Cache response
        if (finalConfig.cache) {
          this.cache.set(url, {
            data: response,
            timestamp: Date.now(),
          })
        }

        return response
      } finally {
        this.pendingRequests.delete(url)
      }
    }

    /**
     * Internal request method
     */
    async _makeRequest(config) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), config.timeout)

      try {
        const options = {
          method: config.method || "GET",
          headers: config.headers,
          signal: controller.signal,
        }

        if (config.data) {
          if (config.headers["Content-Type"] === "application/json") {
            options.body = JSON.stringify(config.data)
          } else if (config.data instanceof FormData) {
            options.body = config.data
          } else {
            options.body = config.data
          }
        }

        const response = await fetch(config.baseURL + config.url, options)

        clearTimeout(timeoutId)

        const data = await this._parseResponse(response, config)

        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config,
        }
      } catch (error) {
        clearTimeout(timeoutId)

        // Retry logic
        if (config.retry && config.retry > 0) {
          await this._delay(config.retryDelay || 1000)
          return this._makeRequest({
            ...config,
            retry: config.retry - 1,
          })
        }

        throw {
          message: error.message,
          config,
          request: error,
        }
      }
    }

    /**
     * Parse response based on content type
     */
    async _parseResponse(response, config) {
      const contentType = response.headers.get("content-type")

      if (config.responseType === "blob") {
        return response.blob()
      } else if (config.responseType === "arraybuffer") {
        return response.arrayBuffer()
      } else if (config.responseType === "text") {
        return response.text()
      } else if (contentType && contentType.includes("application/json")) {
        return response.json()
      } else {
        return response.text()
      }
    }

    /**
     * Delay helper
     */
    _delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }

    /**
     * Convenience methods
     */
    get(url, config = {}) {
      return this.request({ ...config, method: "GET", url })
    }

    post(url, data, config = {}) {
      return this.request({ ...config, method: "POST", url, data })
    }

    put(url, data, config = {}) {
      return this.request({ ...config, method: "PUT", url, data })
    }

    patch(url, data, config = {}) {
      return this.request({ ...config, method: "PATCH", url, data })
    }

    delete(url, config = {}) {
      return this.request({ ...config, method: "DELETE", url })
    }

    /**
     * Clear cache
     */
    clearCache() {
      this.cache.clear()
    }
  }

  /**
   * Create HTTP client instance
   */
  function createHTTP(config) {
    return new HTTPClient(config)
  }

  // Default instance
  const http = new HTTPClient()

  // Export to Adiox namespace
  Adiox.HTTP = {
    create: createHTTP,
    http,
    get: http.get.bind(http),
    post: http.post.bind(http),
    put: http.put.bind(http),
    patch: http.patch.bind(http),
    delete: http.delete.bind(http),
  }
})((window.Adiox = window.Adiox || {}))
