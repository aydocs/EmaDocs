/**
 * EMADOCS - VIDEO MODULE
 * Video player controls
 */
;((window) => {
  const EmaVideo = {
    players: new Map(),

    create(elementId, options = {}) {
      const video = document.getElementById(elementId)
      if (!video) return null

      const player = {
        element: video,
        play: () => video.play(),
        pause: () => video.pause(),
        stop: () => {
          video.pause()
          video.currentTime = 0
        },
        seek: (time) => (video.currentTime = time),
        setVolume: (vol) => (video.volume = vol),
        setSpeed: (speed) => (video.playbackRate = speed),
      }

      this.players.set(elementId, player)
      return player
    },
  }

  window.EmaVideo = EmaVideo
})(window)
