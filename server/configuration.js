'use strict'

const { generateConfig } = require('kth-node-configuration')

// These settings are used by the server
const serverConfig = generateConfig([require('../config/serverSettings')])

module.exports.server = serverConfig
