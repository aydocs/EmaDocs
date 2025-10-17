/**
 * Adiox Crypto Module
 * Encryption, hashing, and cryptographic utilities
 * @module Adiox.Crypto
 */

;(() => {
  const Crypto = {
    /**
     * Generate random string
     * @param {number} length - String length
     * @returns {string}
     */
    randomString(length = 16) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      let result = ""
      const randomValues = new Uint8Array(length)
      crypto.getRandomValues(randomValues)

      for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % chars.length]
      }
      return result
    },

    /**
     * Generate UUID v4
     * @returns {string}
     */
    uuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },

    /**
     * Hash string using SHA-256
     * @param {string} message - Message to hash
     * @returns {Promise<string>}
     */
    async sha256(message) {
      const msgBuffer = new TextEncoder().encode(message)
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    },

    /**
     * Encrypt data using AES-GCM
     * @param {string} data - Data to encrypt
     * @param {string} password - Encryption password
     * @returns {Promise<Object>}
     */
    async encrypt(data, password) {
      const encoder = new TextEncoder()
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))

      // Derive key from password
      const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
        "deriveBits",
        "deriveKey",
      ])

      const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt,
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"],
      )

      // Encrypt
      const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(data))

      return {
        encrypted: Array.from(new Uint8Array(encrypted)),
        salt: Array.from(salt),
        iv: Array.from(iv),
      }
    },

    /**
     * Decrypt data using AES-GCM
     * @param {Object} encryptedData - Encrypted data object
     * @param {string} password - Decryption password
     * @returns {Promise<string>}
     */
    async decrypt(encryptedData, password) {
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()

      // Derive key from password
      const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
        "deriveBits",
        "deriveKey",
      ])

      const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: new Uint8Array(encryptedData.salt),
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"],
      )

      // Decrypt
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(encryptedData.iv) },
        key,
        new Uint8Array(encryptedData.encrypted),
      )

      return decoder.decode(decrypted)
    },

    /**
     * Base64 encode
     * @param {string} str - String to encode
     * @returns {string}
     */
    base64Encode(str) {
      return btoa(unescape(encodeURIComponent(str)))
    },

    /**
     * Base64 decode
     * @param {string} str - String to decode
     * @returns {string}
     */
    base64Decode(str) {
      return decodeURIComponent(escape(atob(str)))
    },
  }

  // Attach to Adiox
  if (typeof window.Adiox !== "undefined") {
    window.Adiox.Crypto = Crypto
  } else {
    console.warn("[Adiox Crypto] Adiox core not found")
  }
})()
