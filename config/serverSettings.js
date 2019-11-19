/**
 *
 *            Server specific settings
 *
 * *************************************************
 * * WARNING! Secrets should be read from env-vars *
 * *************************************************
 *
 */
const { getEnv, unpackMongodbConfig, unpackApiKeysConfig, devDefaults } = require('kth-node-configuration')
const { safeGet } = require('safe-utils')

// DEFAULT SETTINGS used for dev, if you want to override these for you local environment, use env-vars in .env
const devPrefixPath = devDefaults('/api/node')
const devSsl = devDefaults(false)
const devPort = devDefaults(3001)
const devMongodb = devDefaults('mongodb://localhost:27017/node')

// EXAMPLE: const devApiKeys = devDefaults('?name=devClient&apiKey=SET_YOUR_API_KEY&scope=write&scope=read')
const devApiKeys = devDefaults('?name=devClient&apiKey=1234&scope=write&scope=read')

// END DEFAULT SETTINGS

module.exports = {
  // The proxy prefix path if the application is proxied. E.g /places
  proxyPrefixPath: {
    uri: getEnv('SERVICE_PUBLISH', devPrefixPath),
  },
  useSsl: safeGet(() => getEnv('SERVER_SSL', devSsl + '').toLowerCase() === 'true'),
  port: getEnv('SERVER_PORT', devPort),

  ssl: {
    // In development we don't have SSL feature enabled
    pfx: getEnv('SERVER_CERT_FILE', ''),
    passphrase: getEnv('SERVER_CERT_PASSPHRASE', ''),
  },

  // API keys
  api_keys: unpackApiKeysConfig('API_KEYS', devApiKeys),

  // Services
  db: unpackMongodbConfig('MONGODB_URI', devMongodb),

  // Logging
  logging: {
    log: {
      level: getEnv('LOGGING_LEVEL', 'debug'),
    },
    accessLog: {
      useAccessLog: safeGet(() => getEnv('LOGGING_ACCESS_LOG'), 'true') === 'true',
    },
  },

  // Custom app settings
}
