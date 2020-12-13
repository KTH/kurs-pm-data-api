module.exports = {
  globals: {
    NODE_ENV: 'test'
  },
  clearMocks: true,
  notifyMode: 'failure-change',
  transformIgnorePatterns: ['node_modules/(?!(@kth|@babel|@jest)/)'],
  moduleFileExtensions: ['js', 'json', 'node'],
  testPathIgnorePatterns: ['test/e2e']
}
