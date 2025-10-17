/**
 * Adiox Forms Module
 * Complete form handling, validation, and submission system
 * Rivals React Hook Form, Formik, VeeValidate
 *
 * @module Forms
 * @version 1.0.0
 */

;((Adiox) => {
  /**
   * Built-in validators
   */
  const validators = {
    required: (value) => {
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === "string") return value.trim().length > 0
      return value != null
    },

    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return !value || emailRegex.test(value)
    },

    url: (value) => {
      try {
        new URL(value)
        return true
      } catch {
        return !value || false
      }
    },

    min: (min) => (value) => {
      if (typeof value === "number") return value >= min
      if (typeof value === "string") return value.length >= min
      if (Array.isArray(value)) return value.length >= min
      return true
    },

    max: (max) => (value) => {
      if (typeof value === "number") return value <= max
      if (typeof value === "string") return value.length <= max
      if (Array.isArray(value)) return value.length <= max
      return true
    },

    pattern: (regex) => (value) => {
      return !value || regex.test(value)
    },

    minLength: (min) => (value) => {
      return !value || value.length >= min
    },

    maxLength: (max) => (value) => {
      return !value || value.length <= max
    },

    numeric: (value) => {
      return !value || !isNaN(value)
    },

    alpha: (value) => {
      return !value || /^[a-zA-Z]+$/.test(value)
    },

    alphanumeric: (value) => {
      return !value || /^[a-zA-Z0-9]+$/.test(value)
    },

    phone: (value) => {
      const phoneRegex = /^[\d\s\-+$$$$]+$/
      return !value || phoneRegex.test(value)
    },

    creditCard: (value) => {
      if (!value) return true
      const cleaned = value.replace(/\s/g, "")
      if (!/^\d+$/.test(cleaned)) return false

      // Luhn algorithm
      let sum = 0
      let isEven = false
      for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = Number.parseInt(cleaned[i])
        if (isEven) {
          digit *= 2
          if (digit > 9) digit -= 9
        }
        sum += digit
        isEven = !isEven
      }
      return sum % 10 === 0
    },

    date: (value) => {
      return !value || !isNaN(Date.parse(value))
    },

    sameAs: (field) => (value, formData) => {
      return value === formData[field]
    },
  }

  /**
   * Form class for managing form state and validation
   */
  class Form {
    constructor(options = {}) {
      this.fields = options.fields || {}
      this.values = {}
      this.errors = {}
      this.touched = {}
      this.dirty = {}
      this.validating = {}
      this.submitCount = 0
      this.isSubmitting = false
      this.isValid = true

      this.validators = { ...validators, ...options.validators }
      this.onSubmit = options.onSubmit
      this.onChange = options.onChange
      this.onError = options.onError

      // Initialize field values
      Object.keys(this.fields).forEach((field) => {
        this.values[field] = this.fields[field].initialValue ?? ""
        this.errors[field] = null
        this.touched[field] = false
        this.dirty[field] = false
      })
    }

    /**
     * Set field value
     */
    setValue(field, value) {
      this.values[field] = value
      this.dirty[field] = true

      if (this.touched[field]) {
        this.validateField(field)
      }

      if (this.onChange) {
        this.onChange(field, value, this.values)
      }

      Adiox.Core.emit("form:change", { field, value, form: this })
    }

    /**
     * Set multiple values
     */
    setValues(values) {
      Object.keys(values).forEach((field) => {
        this.setValue(field, values[field])
      })
    }

    /**
     * Mark field as touched
     */
    setTouched(field, touched = true) {
      this.touched[field] = touched
      if (touched) {
        this.validateField(field)
      }
    }

    /**
     * Validate single field
     */
    async validateField(field) {
      const fieldConfig = this.fields[field]
      if (!fieldConfig || !fieldConfig.rules) {
        this.errors[field] = null
        return true
      }

      this.validating[field] = true
      const value = this.values[field]
      const rules = Array.isArray(fieldConfig.rules) ? fieldConfig.rules : [fieldConfig.rules]

      for (const rule of rules) {
        let validator, message

        if (typeof rule === "string") {
          validator = this.validators[rule]
          message = `${field} is invalid`
        } else if (typeof rule === "function") {
          validator = rule
          message = `${field} is invalid`
        } else {
          validator = rule.validator
          message = rule.message || `${field} is invalid`
        }

        if (!validator) continue

        try {
          const isValid = await validator(value, this.values)
          if (!isValid) {
            this.errors[field] = message
            this.validating[field] = false
            return false
          }
        } catch (error) {
          this.errors[field] = error.message
          this.validating[field] = false
          return false
        }
      }

      this.errors[field] = null
      this.validating[field] = false
      return true
    }

    /**
     * Validate all fields
     */
    async validate() {
      const validations = Object.keys(this.fields).map((field) => this.validateField(field))

      const results = await Promise.all(validations)
      this.isValid = results.every((result) => result)

      return this.isValid
    }

    /**
     * Submit form
     */
    async submit(event) {
      if (event) {
        event.preventDefault()
      }

      this.submitCount++
      this.isSubmitting = true

      // Mark all fields as touched
      Object.keys(this.fields).forEach((field) => {
        this.touched[field] = true
      })

      // Validate
      const isValid = await this.validate()

      if (!isValid) {
        this.isSubmitting = false
        if (this.onError) {
          this.onError(this.errors, this.values)
        }
        Adiox.Core.emit("form:error", { errors: this.errors, form: this })
        return
      }

      // Submit
      try {
        if (this.onSubmit) {
          await this.onSubmit(this.values, this)
        }
        Adiox.Core.emit("form:submit", { values: this.values, form: this })
      } catch (error) {
        if (this.onError) {
          this.onError({ submit: error.message }, this.values)
        }
        Adiox.Core.emit("form:error", { errors: { submit: error.message }, form: this })
      } finally {
        this.isSubmitting = false
      }
    }

    /**
     * Reset form
     */
    reset() {
      Object.keys(this.fields).forEach((field) => {
        this.values[field] = this.fields[field].initialValue ?? ""
        this.errors[field] = null
        this.touched[field] = false
        this.dirty[field] = false
      })

      this.submitCount = 0
      this.isSubmitting = false
      this.isValid = true

      Adiox.Core.emit("form:reset", { form: this })
    }

    /**
     * Get field props for binding to inputs
     */
    getFieldProps(field) {
      return {
        value: this.values[field] ?? "",
        error: this.errors[field],
        touched: this.touched[field],
        dirty: this.dirty[field],
        onChange: (e) => {
          const value = e.target ? e.target.value : e
          this.setValue(field, value)
        },
        onBlur: () => this.setTouched(field, true),
        "aria-invalid": !!this.errors[field],
        "aria-describedby": this.errors[field] ? `${field}-error` : undefined,
      }
    }

    /**
     * Check if form has errors
     */
    hasErrors() {
      return Object.values(this.errors).some((error) => error !== null)
    }

    /**
     * Check if form is dirty
     */
    isDirty() {
      return Object.values(this.dirty).some((d) => d)
    }
  }

  /**
   * Create form instance
   */
  function createForm(options) {
    return new Form(options)
  }

  /**
   * Add custom validator
   */
  function addValidator(name, validator) {
    validators[name] = validator
  }

  // Export
  Adiox.Forms = {
    createForm,
    addValidator,
    validators,
  }
})(window.Adiox)
