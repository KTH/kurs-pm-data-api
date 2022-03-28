'use strict'

const config = require('./configuration').server
const log = require('@kth/log')
const nodeMongo = require('@kth/mongo')

const mongoOptions = {
  user: config.db.username,
  pass: config.db.password,
  ssl: config.db.ssl,
  dbUri: config.db.authDatabase !== '' ? config.db.uri + `?authSource=${config.db.authDatabase}` : config.db.uri,
  logger: log,
}

module.exports.connect = () => {
  nodeMongo
    .connect(mongoOptions)
    .then(() => {
      log.info('MongoDB: connected')
    })
    .catch(err => {
      log.error({ err }, 'MongoDB: ERROR connecting DB')
    })
}
