/**
 * EMADOCS FRAMEWORK - 3D ENGINE
 * WebGL-based 3D rendering engine
 * @version 1.0.0
 */

;((window) => {
  const Ema3D = {
    canvases: new Map(),
    scenes: new Map(),

    /**
     * Initialize a 3D canvas
     * @param {string} canvasId - Canvas element ID
     * @param {Object} options - Configuration options
     */
    init(canvasId, options = {}) {
      const canvas = document.getElementById(canvasId)
      if (!canvas) {
        console.error(`[Emadocs 3D] Canvas "${canvasId}" not found`)
        return null
      }

      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      if (!gl) {
        console.error("[Emadocs 3D] WebGL not supported")
        return null
      }

      const scene = {
        gl,
        canvas,
        objects: [],
        camera: {
          position: options.cameraPosition || { x: 0, y: 0, z: 5 },
          rotation: { x: 0, y: 0, z: 0 },
        },
        lights: [],
        animationId: null,
        isRunning: false,
        postProcessing: [],
      }

      this.canvases.set(canvasId, canvas)
      this.scenes.set(canvasId, scene)

      // Set canvas size
      this.resize(canvasId)
      window.addEventListener("resize", () => this.resize(canvasId))

      // Initialize WebGL settings
      gl.clearColor(0.1, 0.1, 0.2, 1.0)
      gl.enable(gl.DEPTH_TEST)
      gl.depthFunc(gl.LEQUAL)

      window.EmaCore.emit("3d:initialized", { canvasId })
      return scene
    },

    /**
     * Resize canvas to match display size
     */
    resize(canvasId) {
      const canvas = this.canvases.get(canvasId)
      const scene = this.scenes.get(canvasId)

      if (!canvas || !scene) return

      const displayWidth = canvas.clientWidth
      const displayHeight = canvas.clientHeight

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth
        canvas.height = displayHeight
        scene.gl.viewport(0, 0, canvas.width, canvas.height)
      }
    },

    /**
     * Create a rotating cube
     */
    createCube(canvasId, options = {}) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      const cube = {
        type: "cube",
        position: options.position || { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: options.scale || 1,
        color: options.color || [0.54, 0.36, 0.96, 1.0], // Purple
        rotationSpeed: options.rotationSpeed || { x: 0.01, y: 0.01, z: 0 },
      }

      scene.objects.push(cube)
      return cube
    },

    /**
     * Create a sphere
     */
    createSphere(canvasId, options = {}) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      const sphere = {
        type: "sphere",
        position: options.position || { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: options.scale || 1,
        color: options.color || [0.93, 0.28, 0.6, 1.0], // Pink
        rotationSpeed: options.rotationSpeed || { x: 0, y: 0.02, z: 0 },
      }

      scene.objects.push(sphere)
      return sphere
    },

    /**
     * Create animated text in 3D space
     */
    create3DText(canvasId, text, options = {}) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      const textObj = {
        type: "text3d",
        text,
        position: options.position || { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: options.scale || 1,
        color: options.color || [1, 1, 1, 1],
        font: options.font || "Arial",
        size: options.size || 1,
      }

      scene.objects.push(textObj)
      return textObj
    },

    /**
     * Create a plane/ground
     */
    createPlane(canvasId, options = {}) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      const plane = {
        type: "plane",
        position: options.position || { x: 0, y: -2, z: 0 },
        rotation: { x: -Math.PI / 2, y: 0, z: 0 },
        scale: options.scale || 10,
        color: options.color || [0.2, 0.2, 0.3, 1.0],
      }

      scene.objects.push(plane)
      return plane
    },

    /**
     * Create a torus (donut shape)
     */
    createTorus(canvasId, options = {}) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      const torus = {
        type: "torus",
        position: options.position || { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: options.scale || 1,
        color: options.color || [0.93, 0.28, 0.6, 1.0],
        rotationSpeed: options.rotationSpeed || { x: 0.01, y: 0.02, z: 0 },
        innerRadius: options.innerRadius || 0.5,
        outerRadius: options.outerRadius || 1,
      }

      scene.objects.push(torus)
      return torus
    },

    /**
     * Create a cylinder
     */
    createCylinder(canvasId, options = {}) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      const cylinder = {
        type: "cylinder",
        position: options.position || { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: options.scale || 1,
        color: options.color || [0.4, 0.7, 0.9, 1.0],
        rotationSpeed: options.rotationSpeed || { x: 0, y: 0.02, z: 0 },
        radius: options.radius || 0.5,
        height: options.height || 2,
      }

      scene.objects.push(cylinder)
      return cylinder
    },

    /**
     * Start rendering loop
     */
    start(canvasId) {
      const scene = this.scenes.get(canvasId)
      if (!scene || scene.isRunning) return

      scene.isRunning = true

      const render = () => {
        if (!scene.isRunning) return

        const gl = scene.gl

        // Clear canvas
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        // Update and render objects
        scene.objects.forEach((obj) => {
          // Update rotation
          obj.rotation.x += obj.rotationSpeed.x
          obj.rotation.y += obj.rotationSpeed.y
          obj.rotation.z += obj.rotationSpeed.z

          // Simple rendering (placeholder for actual WebGL rendering)
          this.renderObject(scene, obj)
        })

        scene.animationId = requestAnimationFrame(render)
      }

      render()
      window.EmaCore.emit("3d:started", { canvasId })
    },

    /**
     * Stop rendering loop
     */
    stop(canvasId) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      scene.isRunning = false
      if (scene.animationId) {
        cancelAnimationFrame(scene.animationId)
        scene.animationId = null
      }

      window.EmaCore.emit("3d:stopped", { canvasId })
    },

    /**
     * Render an object (simplified)
     */
    renderObject(scene, obj) {
      // This is a placeholder for actual WebGL rendering
      // In a full implementation, this would use shaders and buffers
      const gl = scene.gl

      // For demo purposes, just clear with object color
      if (scene.objects.indexOf(obj) === 0) {
        gl.clearColor(obj.color[0], obj.color[1], obj.color[2], obj.color[3])
      }
    },

    /**
     * Create particle system
     */
    createParticles(canvasId, count = 100, options = {}) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      const particles = {
        type: "particles",
        count,
        positions: [],
        velocities: [],
        colors: [],
        size: options.size || 2,
      }

      // Initialize particles
      for (let i = 0; i < count; i++) {
        particles.positions.push({
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
          z: (Math.random() - 0.5) * 4,
        })
        particles.velocities.push({
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        })
        particles.colors.push([Math.random() * 0.5 + 0.5, Math.random() * 0.3 + 0.3, Math.random() * 0.2 + 0.8, 1.0])
      }

      scene.objects.push(particles)
      return particles
    },

    /**
     * Add ambient light
     */
    addLight(canvasId, type = "ambient", options = {}) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      const light = {
        type,
        color: options.color || [1, 1, 1],
        intensity: options.intensity || 1,
        position: options.position || { x: 0, y: 5, z: 5 },
      }

      scene.lights.push(light)
      return light
    },

    /**
     * Clear all objects from scene
     */
    clear(canvasId) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      scene.objects = []
      scene.lights = []
      window.EmaCore.emit("3d:cleared", { canvasId })
    },

    /**
     * Create a wave effect
     */
    createWave(canvasId, options = {}) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      const wave = {
        type: "wave",
        position: options.position || { x: 0, y: 0, z: 0 },
        amplitude: options.amplitude || 1,
        frequency: options.frequency || 1,
        speed: options.speed || 0.05,
        color: options.color || [0.3, 0.6, 0.9, 1.0],
        time: 0,
      }

      scene.objects.push(wave)
      return wave
    },

    /**
     * Create a spiral
     */
    createSpiral(canvasId, options = {}) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      const spiral = {
        type: "spiral",
        position: options.position || { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        rotationSpeed: options.rotationSpeed || { x: 0, y: 0.03, z: 0 },
        color: options.color || [0.8, 0.4, 0.9, 1.0],
        turns: options.turns || 5,
        radius: options.radius || 2,
      }

      scene.objects.push(spiral)
      return spiral
    },

    /**
     * Apply post-processing effects
     */
    addPostProcessing(canvasId, effect, options = {}) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      if (!scene.postProcessing) {
        scene.postProcessing = []
      }

      scene.postProcessing.push({
        effect,
        options,
        enabled: true,
      })
    },

    /**
     * Enable bloom effect
     */
    enableBloom(canvasId, intensity = 1.5) {
      this.addPostProcessing(canvasId, "bloom", { intensity })
    },

    /**
     * Enable motion blur
     */
    enableMotionBlur(canvasId, strength = 0.5) {
      this.addPostProcessing(canvasId, "motionBlur", { strength })
    },

    /**
     * Set camera position
     */
    setCameraPosition(canvasId, x, y, z) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      scene.camera.position = { x, y, z }
    },

    /**
     * Animate camera
     */
    animateCamera(canvasId, targetPosition, duration = 1000) {
      const scene = this.scenes.get(canvasId)
      if (!scene) return

      const startPos = { ...scene.camera.position }
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function
        const eased = 1 - Math.pow(1 - progress, 3)

        scene.camera.position.x = startPos.x + (targetPosition.x - startPos.x) * eased
        scene.camera.position.y = startPos.y + (targetPosition.y - startPos.y) * eased
        scene.camera.position.z = startPos.z + (targetPosition.z - startPos.z) * eased

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    },
  }

  window.Ema3D = Ema3D
})(window)
