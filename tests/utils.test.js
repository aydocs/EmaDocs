/**
 * Adiox Utils Module Tests
 *
 * Tests for utility functions (sanitize, format, validate, etc.)
 */

const Adiox = require("../adiox") // Assuming Adiox is imported from a module

const UtilsTests = {
  name: "Utils Module Tests",

  tests: [
    {
      name: "Sanitize HTML - remove scripts",
      run: () => {
        const dirty = '<div>Hello<script>alert("xss")</script></div>'
        const clean = Adiox.Utils.sanitizeHTML(dirty)

        if (clean.includes("<script>")) throw new Error("Script tag was not removed")
        if (!clean.includes("Hello")) throw new Error("Safe content was removed")

        return true
      },
    },

    {
      name: "Sanitize HTML - remove event handlers",
      run: () => {
        const dirty = '<div onclick="alert(1)">Click me</div>'
        const clean = Adiox.Utils.sanitizeHTML(dirty)

        if (clean.includes("onclick")) throw new Error("Event handler was not removed")

        return true
      },
    },

    {
      name: "Format Date - default format",
      run: () => {
        const date = new Date("2024-01-15T10:30:00")
        const formatted = Adiox.Utils.formatDate(date)

        if (!formatted.includes("2024")) throw new Error("Year not in formatted date")
        if (!formatted.includes("01") && !formatted.includes("1")) throw new Error("Month not in formatted date")

        return true
      },
    },

    {
      name: "Format Number - with separators",
      run: () => {
        const formatted = Adiox.Utils.formatNumber(1234567.89)

        if (!formatted.includes(",") && !formatted.includes(".")) {
          throw new Error("Number was not formatted with separators")
        }

        return true
      },
    },

    {
      name: "Validate Email - valid email",
      run: () => {
        const valid = Adiox.Utils.validateEmail("test@example.com")
        if (!valid) throw new Error("Valid email was rejected")

        return true
      },
    },

    {
      name: "Validate Email - invalid email",
      run: () => {
        const invalid = Adiox.Utils.validateEmail("not-an-email")
        if (invalid) throw new Error("Invalid email was accepted")

        return true
      },
    },

    {
      name: "Debounce - delays execution",
      run: async () => {
        let callCount = 0
        const debounced = Adiox.Utils.debounce(() => callCount++, 100)

        debounced()
        debounced()
        debounced()

        if (callCount !== 0) throw new Error("Function was called immediately")

        await new Promise((resolve) => setTimeout(resolve, 150))

        if (callCount !== 1) throw new Error("Function was not called after delay")

        return true
      },
    },

    {
      name: "Throttle - limits execution rate",
      run: async () => {
        let callCount = 0
        const throttled = Adiox.Utils.throttle(() => callCount++, 100)

        throttled()
        throttled()
        throttled()

        if (callCount !== 1) throw new Error("Function was called more than once immediately")

        await new Promise((resolve) => setTimeout(resolve, 150))
        throttled()

        if (callCount !== 2) throw new Error("Function was not called after throttle period")

        return true
      },
    },
  ],
}
