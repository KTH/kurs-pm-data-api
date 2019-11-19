'use strict'

const packageFile = require('../../package.json')
const server = require('../server')
const { getPaths } = require('kth-node-express-routing')
const db = require('kth-node-mongo')
const version = require('../../config/version')
const os = require('os')

const Promise = require('bluebird')
const registry = require('component-registry').globalRegistry
const { IHealthCheck } = require('kth-node-monitor').interfaces

const { getClient } = require('@kth/kth-node-cosmos-db')

/**
 * GET /swagger.json
 * Swagger config
 */
function getSwagger(req, res) {
  res.json(require('../../swagger.json'))
}

/**
 * GET /_about
 * About page
 */
async function getAbout(req, res) {
  const paths = server.getPaths()

  const client = getClient()
  const collections = await client.listCollectionsWithThroughput()

  res.render('system/about', {
    layout: '',
    appName: packageFile.name,
    appVersion: packageFile.version,
    appDescription: packageFile.description,
    monitorUri: paths.system.monitor.uri,
    robotsUri: paths.system.robots.uri,
    gitBranch: JSON.stringify(version.gitBranch),
    gitCommit: JSON.stringify(version.gitCommit),
    jenkinsBuild: JSON.stringify(version.jenkinsBuild),
    jenkinsBuildDate: JSON.stringify(version.jenkinsBuildDate),
    dockerName: JSON.stringify(version.dockerName),
    dockerVersion: JSON.stringify(version.dockerVersion),
    collections,
    hostname: os.hostname(),
  })
}

/**
 * GET /_monitor
 * Monitor page
 */
function getMonitor(req, res) {
  // Check MongoDB
  const mongodbHealthUtil = registry.getUtility(IHealthCheck, 'kth-node-mongodb')
  const subSystems = [mongodbHealthUtil.status(db, { required: true })]

  // If we need local system checks, such as memory or disk, we would add it here.
  // Make sure it returns a promise which resolves with an object containing:
  // {statusCode: ###, message: '...'}
  // The property statusCode should be standard HTTP status codes.
  const localSystems = Promise.resolve({ statusCode: 200, message: 'OK' })

  /* -- You will normally not change anything below this line -- */

  // Determine system health based on the results of the checks above. Expects
  // arrays of promises as input. This returns a promise
  const systemHealthUtil = registry.getUtility(IHealthCheck, 'kth-node-system-check')
  const systemStatus = systemHealthUtil.status(localSystems, subSystems)

  systemStatus
    .then(status => {
      // Return the result either as JSON or text
      if (req.headers.accept === 'application/json') {
        const outp = systemHealthUtil.renderJSON(status)
        res.status(status.statusCode).json(outp)
      } else {
        const outp = systemHealthUtil.renderText(status)
        res
          .type('text')
          .status(status.statusCode)
          .send(outp)
      }
    })
    .catch(err => {
      res
        .type('text')
        .status(500)
        .send(err)
    })
}

/**
 * GET /robots.txt
 * Robots.txt page
 */
function getRobotsTxt(req, res) {
  res.type('text').render('system/robots', {
    layout: '',
  })
}

/**
 * GET /_paths
 * Return all paths for the system
 */
function getPathsHandler(req, res) {
  res.json(getPaths())
}

function getCheckAPIKey(req, res) {
  res.end()
}

/**
 * System controller for functions such as about and monitor.
 * Avoid making changes here in sub-projects.
 */
module.exports = {
  monitor: getMonitor,
  about: getAbout,
  robotsTxt: getRobotsTxt,
  paths: getPathsHandler,
  checkAPIKey: getCheckAPIKey,
  swagger: getSwagger,
}
