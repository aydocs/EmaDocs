/**
 * EMADOCS FRAMEWORK - 3D HELPERS
 * Additional 3D utilities and presets
 * @version 1.0.0
 */

;((window) => {
  const Ema3DHelpers = {
    /**
     * Create a complete 3D scene with multiple objects
     */
    createShowcaseScene(canvasId) {
      const scene = window.Ema3D.init(canvasId)
      if (!scene) return

      // Create multiple objects
      window.Ema3D.createCube(canvasId, {
        position: { x: -2, y: 0, z: 0 },
        color: [0.54, 0.36, 0.96, 1.0],
        rotationSpeed: { x: 0.01, y: 0.02, z: 0 },
      })

      window.Ema3D.createSphere(canvasId, {
        position: { x: 0, y: 0, z: 0 },
        color: [0.93, 0.28, 0.6, 1.0],
        rotationSpeed: { x: 0, y: 0.03, z: 0 },
      })

      window.Ema3D.createTorus(canvasId, {
        position: { x: 2, y: 0, z: 0 },
        color: [0.4, 0.7, 0.9, 1.0],
        rotationSpeed: { x: 0.02, y: 0.01, z: 0 },
      })

      window.Ema3D.createPlane(canvasId, {
        position: { x: 0, y: -2, z: 0 },
        scale: 15,
      })

      window.Ema3D.addLight(canvasId, "ambient", {
        color: [1, 1, 1],
        intensity: 0.5,
      })

      window.Ema3D.addLight(canvasId, "directional", {
        color: [1, 1, 1],
        intensity: 0.8,
        position: { x: 5, y: 5, z: 5 },
      })

      window.Ema3D.start(canvasId)
      return scene
    },

    /**
     * Create a particle galaxy
     */
    createGalaxy(canvasId, particleCount = 1000) {
      const scene = window.Ema3D.init(canvasId)
      if (!scene) return

      const particles = window.Ema3D.createParticles(canvasId, particleCount, {
        size: 2,
      })

      // Arrange particles in a spiral galaxy pattern
      if (particles && particles.positions) {
        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 4
          const radius = (i / particleCount) * 5
          const height = (Math.random() - 0.5) * 0.5

          particles.positions[i] = {
            x: Math.cos(angle) * radius,
            y: height,
            z: Math.sin(angle) * radius,
          }

          // Purple to pink gradient
          const t = i / particleCount
          particles.colors[i] = [0.54 + t * 0.39, 0.36 - t * 0.08, 0.96 - t * 0.36, 1.0]
        }
      }

      window.Ema3D.start(canvasId)
      return scene
    },

    /**
     * Create a DNA helix
     */
    createDNAHelix(canvasId) {
      const scene = window.Ema3D.init(canvasId)
      if (!scene) return

      const sphereCount = 40
      for (let i = 0; i < sphereCount; i++) {
        const angle = (i / sphereCount) * Math.PI * 4
        const height = (i / sphereCount) * 8 - 4
        const radius = 1.5

        // First strand
        window.Ema3D.createSphere(canvasId, {
          position: {
            x: Math.cos(angle) * radius,
            y: height,
            z: Math.sin(angle) * radius,
          },
          scale: 0.2,
          color: [0.54, 0.36, 0.96, 1.0],
        })

        // Second strand (opposite)
        window.Ema3D.createSphere(canvasId, {
          position: {
            x: Math.cos(angle + Math.PI) * radius,
            y: height,
            z: Math.sin(angle + Math.PI) * radius,
          },
          scale: 0.2,
          color: [0.93, 0.28, 0.6, 1.0],
        })
      }

      window.Ema3D.setCameraPosition(canvasId, 0, 0, 8)
      window.Ema3D.start(canvasId)
      return scene
    },

    /**
     * Create a morphing shape
     */
    createMorphingShape(canvasId) {
      const scene = window.Ema3D.init(canvasId)
      if (!scene) return

      const shape = window.Ema3D.createCube(canvasId, {
        color: [0.54, 0.36, 0.96, 1.0],
        rotationSpeed: { x: 0.02, y: 0.03, z: 0.01 },
      })

      // Add morphing animation
      let morphTime = 0
      const originalUpdate = scene.objects[0]

      scene.morphAnimation = setInterval(() => {
        morphTime += 0.05
        if (shape) {
          shape.scale = 1 + Math.sin(morphTime) * 0.3
        }
      }, 50)

      window.Ema3D.start(canvasId)
      return scene
    },

    /**
     * Create a tunnel effect
     */
    createTunnel(canvasId, segments = 20) {
      const scene = window.Ema3D.init(canvasId)
      if (!scene) return

      for (let i = 0; i < segments; i++) {
        const z = -i * 2
        const scale = 1 + i * 0.1
        const hue = (i / segments) * 0.3

        window.Ema3D.createTorus(canvasId, {
          position: { x: 0, y: 0, z },
          scale,
          color: [0.54 + hue, 0.36, 0.96 - hue, 1.0],
          rotationSpeed: { x: 0, y: 0, z: 0.01 + i * 0.001 },
        })
      }

      window.Ema3D.setCameraPosition(canvasId, 0, 0, 5)
      window.Ema3D.start(canvasId)
      return scene
    },
  }

  window.Ema3DHelpers = Ema3DHelpers
})(window)
