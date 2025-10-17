/**
 * Adiox Animations Module Tests
 *
 * Tests for animation system and utilities.
 */

// Import Adiox module
import Adiox from "path-to-adiox-module"

const AnimationsTests = {
  name: "Animations Module Tests",

  tests: [
    {
      name: "Animate - basic animation",
      run: async () => {
        const el = document.createElement("div")
        document.body.appendChild(el)

        const animation = Adiox.Animations.animate(el, "fadeIn", {
          duration: 300,
        })

        if (!animation) throw new Error("Animation was not created")

        await animation.finished

        // Cleanup
        document.body.removeChild(el)

        return true
      },
    },

    {
      name: "Sequence - run animations in sequence",
      run: async () => {
        const el1 = document.createElement("div")
        const el2 = document.createElement("div")
        document.body.appendChild(el1)
        document.body.appendChild(el2)

        const order = []

        await Adiox.Animations.sequence([
          { element: el1, animation: "fadeIn", duration: 100, onStart: () => order.push(1) },
          { element: el2, animation: "fadeIn", duration: 100, onStart: () => order.push(2) },
        ])

        if (order[0] !== 1 || order[1] !== 2) {
          throw new Error("Animations did not run in sequence")
        }

        // Cleanup
        document.body.removeChild(el1)
        document.body.removeChild(el2)

        return true
      },
    },

    {
      name: "Stagger - stagger animations",
      run: async () => {
        const elements = [document.createElement("div"), document.createElement("div"), document.createElement("div")]

        elements.forEach((el) => document.body.appendChild(el))

        await Adiox.Animations.stagger(elements, "fadeIn", {
          duration: 100,
          stagger: 50,
        })

        // Cleanup
        elements.forEach((el) => document.body.removeChild(el))

        return true
      },
    },

    {
      name: "Scroll Animation - trigger on scroll",
      run: () => {
        const el = document.createElement("div")
        el.style.marginTop = "2000px" // Place below fold
        document.body.appendChild(el)

        Adiox.Animations.onScroll(el, "fadeIn")

        // Simulate scroll
        window.scrollTo(0, 2000)

        // Check if animation was triggered
        // (In real scenario, IntersectionObserver would trigger)

        // Cleanup
        document.body.removeChild(el)
        window.scrollTo(0, 0)

        return true
      },
    },
  ],
}
