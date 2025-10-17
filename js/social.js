/**
 * Adiox Social Module
 * Social media sharing and integration utilities
 * @module Adiox.Social
 */

;(() => {
  const Social = {
    /**
     * Share on Facebook
     * @param {string} url - URL to share
     * @param {Object} options - Share options
     */
    shareOnFacebook(url, options = {}) {
      const { quote = "" } = options
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`
      this._openPopup(shareUrl, "Facebook Share", 600, 400)
    },

    /**
     * Share on Twitter/X
     * @param {string} text - Tweet text
     * @param {Object} options - Share options
     */
    shareOnTwitter(text, options = {}) {
      const { url = "", hashtags = [], via = "" } = options
      let shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`

      if (url) shareUrl += `&url=${encodeURIComponent(url)}`
      if (hashtags.length) shareUrl += `&hashtags=${hashtags.join(",")}`
      if (via) shareUrl += `&via=${via}`

      this._openPopup(shareUrl, "Twitter Share", 600, 400)
    },

    /**
     * Share on LinkedIn
     * @param {string} url - URL to share
     * @param {Object} options - Share options
     */
    shareOnLinkedIn(url, options = {}) {
      const { title = "", summary = "" } = options
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
      this._openPopup(shareUrl, "LinkedIn Share", 600, 400)
    },

    /**
     * Share on WhatsApp
     * @param {string} text - Message text
     * @param {string} url - URL to share
     */
    shareOnWhatsApp(text, url = "") {
      const message = url ? `${text} ${url}` : text
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
      window.open(shareUrl, "_blank")
    },

    /**
     * Share on Telegram
     * @param {string} text - Message text
     * @param {string} url - URL to share
     */
    shareOnTelegram(text, url = "") {
      let shareUrl = `https://t.me/share/url?text=${encodeURIComponent(text)}`
      if (url) shareUrl += `&url=${encodeURIComponent(url)}`
      this._openPopup(shareUrl, "Telegram Share", 600, 400)
    },

    /**
     * Share via email
     * @param {Object} options - Email options
     */
    shareViaEmail(options = {}) {
      const { subject = "", body = "", to = "" } = options
      const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.location.href = mailtoUrl
    },

    /**
     * Copy link to clipboard
     * @param {string} url - URL to copy
     * @returns {Promise<boolean>}
     */
    async copyLink(url) {
      try {
        await navigator.clipboard.writeText(url)
        return true
      } catch (error) {
        console.error("[Adiox Social] Copy failed:", error)
        return false
      }
    },

    /**
     * Use Web Share API if available
     * @param {Object} data - Share data
     * @returns {Promise<boolean>}
     */
    async nativeShare(data = {}) {
      if (!navigator.share) {
        console.warn("[Adiox Social] Web Share API not supported")
        return false
      }

      try {
        await navigator.share(data)
        return true
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("[Adiox Social] Share failed:", error)
        }
        return false
      }
    },

    /**
     * Open popup window
     * @private
     */
    _openPopup(url, title, width, height) {
      const left = (screen.width - width) / 2
      const top = (screen.height - height) / 2
      const features = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
      window.open(url, title, features)
    },
  }

  // Attach to Adiox
  if (typeof window.Adiox !== "undefined") {
    window.Adiox.Social = Social
  } else {
    console.warn("[Adiox Social] Adiox core not found")
  }
})()
