/**
 * EMADOCS - CAMERA MODULE
 * Webcam and media capture
 */
;((window) => {
  const EmaCamera = {
    stream: null,

    async start(videoElement, options = {}) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: options.video || true,
          audio: options.audio || false,
        })

        if (videoElement) {
          videoElement.srcObject = this.stream
        }

        return this.stream
      } catch (error) {
        console.error("[EmaCamera] Error:", error)
        return null
      }
    },

    stop() {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop())
        this.stream = null
      }
    },

    takePhoto(videoElement) {
      const canvas = document.createElement("canvas")
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight
      canvas.getContext("2d").drawImage(videoElement, 0, 0)
      return canvas.toDataURL("image/png")
    },
  }

  window.EmaCamera = EmaCamera
})(window)
