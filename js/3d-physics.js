/**
 * EMADOCS FRAMEWORK - 3D PHYSICS ENGINE
 * Simple physics simulation for 3D objects
 * @version 1.0.0
 */

;((window) => {
  const Ema3DPhysics = {
    gravity: { x: 0, y: -9.8, z: 0 },
    physicsObjects: new Map(),

    /**
     * Enable physics for an object
     */
    enablePhysics(canvasId, object, options = {}) {
      const key = `${canvasId}-${object.type}-${Date.now()}`

      const physicsData = {
        object,
        velocity: options.velocity || { x: 0, y: 0, z: 0 },
        acceleration: options.acceleration || { x: 0, y: 0, z: 0 },
        mass: options.mass || 1,
        friction: options.friction || 0.98,
        restitution: options.restitution || 0.8,
        useGravity: options.useGravity !== false,
      }

      this.physicsObjects.set(key, physicsData)
      return key
    },

    /**
     * Update physics simulation
     */
    update(deltaTime = 0.016) {
      this.physicsObjects.forEach((data) => {
        const { object, velocity, acceleration, mass, friction, restitution, useGravity } = data

        // Apply gravity
        if (useGravity) {
          acceleration.y += this.gravity.y * deltaTime
        }

        // Update velocity
        velocity.x += acceleration.x * deltaTime
        velocity.y += acceleration.y * deltaTime
        velocity.z += acceleration.z * deltaTime

        // Apply friction
        velocity.x *= friction
        velocity.y *= friction
        velocity.z *= friction

        // Update position
        object.position.x += velocity.x * deltaTime
        object.position.y += velocity.y * deltaTime
        object.position.z += velocity.z * deltaTime

        // Ground collision
        if (object.position.y < -2) {
          object.position.y = -2
          velocity.y = -velocity.y * restitution
        }

        // Reset acceleration
        acceleration.x = 0
        acceleration.y = 0
        acceleration.z = 0
      })
    },

    /**
     * Apply force to an object
     */
    applyForce(physicsKey, force) {
      const data = this.physicsObjects.get(physicsKey)
      if (!data) return

      data.acceleration.x += force.x / data.mass
      data.acceleration.y += force.y / data.mass
      data.acceleration.z += force.z / data.mass
    },

    /**
     * Apply impulse (instant velocity change)
     */
    applyImpulse(physicsKey, impulse) {
      const data = this.physicsObjects.get(physicsKey)
      if (!data) return

      data.velocity.x += impulse.x
      data.velocity.y += impulse.y
      data.velocity.z += impulse.z
    },

    /**
     * Start physics simulation loop
     */
    startSimulation() {
      let lastTime = Date.now()

      const simulate = () => {
        const currentTime = Date.now()
        const deltaTime = (currentTime - lastTime) / 1000
        lastTime = currentTime

        this.update(deltaTime)
        requestAnimationFrame(simulate)
      }

      simulate()
    },

    /**
     * Remove physics from object
     */
    removePhysics(physicsKey) {
      this.physicsObjects.delete(physicsKey)
    },

    /**
     * Clear all physics objects
     */
    clear() {
      this.physicsObjects.clear()
    },
  }

  // Start simulation automatically
  Ema3DPhysics.startSimulation()

  window.Ema3DPhysics = Ema3DPhysics
})(window)
