/**
 * Adiox Payment Module
 * Payment processing helpers and utilities
 * @module Adiox.Payment
 */

;(() => {
  const Payment = {
    /**
     * Validate credit card number (Luhn algorithm)
     * @param {string} cardNumber - Card number
     * @returns {boolean}
     */
    validateCardNumber(cardNumber) {
      const cleaned = cardNumber.replace(/\D/g, "")
      if (cleaned.length < 13 || cleaned.length > 19) return false

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

    /**
     * Get card type from number
     * @param {string} cardNumber - Card number
     * @returns {string}
     */
    getCardType(cardNumber) {
      const cleaned = cardNumber.replace(/\D/g, "")

      const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        discover: /^6(?:011|5)/,
        diners: /^3(?:0[0-5]|[68])/,
        jcb: /^35/,
      }

      for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(cleaned)) return type
      }

      return "unknown"
    },

    /**
     * Format card number with spaces
     * @param {string} cardNumber - Card number
     * @returns {string}
     */
    formatCardNumber(cardNumber) {
      const cleaned = cardNumber.replace(/\D/g, "")
      const type = this.getCardType(cleaned)

      // Amex: 4-6-5, Others: 4-4-4-4
      if (type === "amex") {
        return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3")
      }
      return cleaned.replace(/(\d{4})/g, "$1 ").trim()
    },

    /**
     * Validate expiry date
     * @param {string} month - Month (01-12)
     * @param {string} year - Year (YY or YYYY)
     * @returns {boolean}
     */
    validateExpiry(month, year) {
      const m = Number.parseInt(month)
      let y = Number.parseInt(year)

      if (m < 1 || m > 12) return false

      // Convert YY to YYYY
      if (y < 100) {
        y += 2000
      }

      const now = new Date()
      const expiry = new Date(y, m - 1)

      return expiry > now
    },

    /**
     * Validate CVV
     * @param {string} cvv - CVV code
     * @param {string} cardType - Card type
     * @returns {boolean}
     */
    validateCVV(cvv, cardType = "visa") {
      const cleaned = cvv.replace(/\D/g, "")
      const length = cardType === "amex" ? 4 : 3
      return cleaned.length === length
    },

    /**
     * Mask card number
     * @param {string} cardNumber - Card number
     * @returns {string}
     */
    maskCardNumber(cardNumber) {
      const cleaned = cardNumber.replace(/\D/g, "")
      const last4 = cleaned.slice(-4)
      return `**** **** **** ${last4}`
    },

    /**
     * Calculate payment installments
     * @param {number} amount - Total amount
     * @param {number} months - Number of months
     * @param {number} interestRate - Annual interest rate (%)
     * @returns {Object}
     */
    calculateInstallments(amount, months, interestRate = 0) {
      const monthlyRate = interestRate / 100 / 12
      let monthlyPayment

      if (interestRate === 0) {
        monthlyPayment = amount / months
      } else {
        monthlyPayment =
          (amount * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1)
      }

      const totalAmount = monthlyPayment * months
      const totalInterest = totalAmount - amount

      return {
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        months,
      }
    },
  }

  // Attach to Adiox
  if (typeof window.Adiox !== "undefined") {
    window.Adiox.Payment = Payment
  } else {
    console.warn("[Adiox Payment] Adiox core not found")
  }
})()
