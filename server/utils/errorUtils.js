class InvalidDataError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidDataError'
  }
}

module.exports = {
  InvalidDataError,
}
