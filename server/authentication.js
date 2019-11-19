'use strict'

const log = require('kth-node-log')
const config = require('./configuration').server
const passport = require('passport')
const server = require('./server')
const apiKey = require('kth-node-api-key-strategy')

const ApiKeyStrategy = apiKey.Strategy
const options = { log }
const verify = (req, apikey, done) => {
  apiKey.verifyApiKey(req, apikey, config.api_keys, done)
}
const strategy = new ApiKeyStrategy(options, verify)

/**
 * In a Express-based application, passport.initialize() middleware is required to initialize Passport.
 * If your application uses persistent login sessions, passport.session() middleware must also be used.
 */
server.use(passport.initialize())

passport.use(strategy)

log.info('Authentication initialized')
