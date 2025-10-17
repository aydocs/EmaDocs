/**
 * Adiox Media Module
 * Camera, microphone, screen capture utilities
 * @module Adiox.Media
 */

;(() => {
  const Media = {
    /**
     * Get user media (camera/microphone)
     * @param {Object} constraints - Media constraints
     * @returns {Promise<MediaStream>}
     */
    async getUserMedia(constraints = { video: true, audio: true }) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        return stream
      } catch (error) {
        console.error("[Adiox Media] getUserMedia error:", error)
        throw error
      }
    },

    /**
     * Get display media (screen capture)
     * @param {Object} constraints - Display constraints
     * @returns {Promise<MediaStream>}
     */
    async getDisplayMedia(constraints = { video: true, audio: false }) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia(constraints)
        return stream
      } catch (error) {
        console.error("[Adiox Media] getDisplayMedia error:", error)
        throw error
      }
    },

    /**
     * Take photo from video stream
     * @param {MediaStream} stream - Video stream
     * @returns {Promise<Blob>}
     */
    async takePhoto(stream) {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video")
        video.srcObject = stream
        video.play()

        video.onloadedmetadata = () => {
          const canvas = document.createElement("canvas")
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext("2d")
          ctx.drawImage(video, 0, 0)

          canvas.toBlob(
            (blob) => {
              video.pause()
              video.srcObject = null
              resolve(blob)
            },
            "image/jpeg",
            0.95,
          )
        }

        video.onerror = reject
      })
    },

    /**
     * Record media stream
     * @param {MediaStream} stream - Media stream
     * @param {Object} options - Recording options
     * @returns {Object} Recorder controller
     */
    recordStream(stream, options = {}) {
      const mimeType = options.mimeType || "video/webm"
      const recorder = new MediaRecorder(stream, { mimeType })
      const chunks = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      return {
        start() {
          chunks.length = 0
          recorder.start()
        },
        stop() {
          return new Promise((resolve) => {
            recorder.onstop = () => {
              const blob = new Blob(chunks, { type: mimeType })
              resolve(blob)
            }
            recorder.stop()
          })
        },
        pause() {
          recorder.pause()
        },
        resume() {
          recorder.resume()
        },
        get state() {
          return recorder.state
        },
      }
    },

    /**
     * Get available media devices
     * @returns {Promise<Array>}
     */
    async getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        return {
          videoInputs: devices.filter((d) => d.kind === "videoinput"),
          audioInputs: devices.filter((d) => d.kind === "audioinput"),
          audioOutputs: devices.filter((d) => d.kind === "audiooutput"),
        }
      } catch (error) {
        console.error("[Adiox Media] getDevices error:", error)
        throw error
      }
    },

    /**
     * Stop all tracks in a stream
     * @param {MediaStream} stream - Media stream
     */
    stopStream(stream) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    },
  }

  // Attach to Adiox
  if (typeof window.Adiox !== "undefined") {
    window.Adiox.Media = Media
  } else {
    console.warn("[Adiox Media] Adiox core not found")
  }
})()
