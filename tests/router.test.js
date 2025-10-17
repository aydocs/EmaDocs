/**
 * Adiox Router Module Tests
 *
 * Tests for SPA routing, navigation, and route handling.
 */

// Declare Adiox variable or import statement here
const Adiox = require("adiox") // Example import statement, replace with actual import if needed

const RouterTests = {
  name: "Router Module Tests",

  tests: [
    {
      name: "Router - register and match route",
      run: () => {
        let handlerCalled = false

        Adiox.Router.route("/test-route", () => {
          handlerCalled = true
        })

        // Simulate navigation
        Adiox.Router.navigate("/test-route")

        if (!handlerCalled) throw new Error("Route handler was not called")

        return true
      },
    },

    {
      name: "Router - route with params",
      run: () => {
        let capturedParams = null

        Adiox.Router.route("/user/:id", (params) => {
          capturedParams = params
        })

        Adiox.Router.navigate("/user/123")

        if (!capturedParams) throw new Error("Route params were not captured")
        if (capturedParams.id !== "123") throw new Error("Route param value was incorrect")

        return true
      },
    },

    {
      name: "Router - beforeEnter hook",
      run: () => {
        let hookCalled = false

        Adiox.Router.route("/protected", () => {}, {
          beforeEnter: () => {
            hookCalled = true
            return true // Allow navigation
          },
        })

        Adiox.Router.navigate("/protected")

        if (!hookCalled) throw new Error("beforeEnter hook was not called")

        return true
      },
    },

    {
      name: "Router - 404 handler",
      run: () => {
        let notFoundCalled = false

        Adiox.Router.notFound(() => {
          notFoundCalled = true
        })

        Adiox.Router.navigate("/non-existent-route-xyz")

        if (!notFoundCalled) throw new Error("404 handler was not called")

        return true
      },
    },
  ],
}
