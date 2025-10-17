/**
 * EMADOCS - AUDIO MODULE
 * Audio playback and manipulation
 */
;((window) => {
  const EmaAudio = {
    context: null,
    sounds: new Map(),

    init() {
      this.context = new (window.AudioContext || window.webkitAudioContext)()
    },

    load(name, url) {
      return fetch(url)
        .then((response) => response.arrayBuffer())
        .then((buffer) => this.context.decodeAudioData(buffer))
        .then((audioBuffer) => {
          this.sounds.set(name, audioBuffer)
          return audioBuffer
        })
    },

    play(name, options = {}) {
      const buffer = this.sounds.get(name)
      if (!buffer) return

      const source = this.context.createBufferSource()
      source.buffer = buffer

      const gainNode = this.context.createGain()
      gainNode.gain.value = options.volume || 1

      source.connect(gainNode)
      gainNode.connect(this.context.destination)
      source.start(0)
    },
  }

  window.EmaAudio = EmaAudio
})(window)
