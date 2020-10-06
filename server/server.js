'use strict'

const server = require('kth-node-server')
const path = require('path')

// Load .env file in development mode
const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()
if (nodeEnv === 'development' || nodeEnv === 'dev' || !nodeEnv) {
  require('dotenv').config()
}

// Now read the server config etc.
const config = require('./configuration').server
const AppRouter = require('kth-node-express-routing').PageRouter
const { getPaths } = require('kth-node-express-routing')

if (config.appInsights && config.appInsights.instrumentationKey) {
  const appInsights = require('applicationinsights')
  appInsights
    .setup(config.appInsights.instrumentationKey)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .start()
}

// Expose the server and paths
server.locals.secret = new Map()
module.exports = server
module.exports.getPaths = () => getPaths()

/* ***********************
 * ******* LOGGING *******
 * ***********************
 */
const log = require('kth-node-log')
const packageFile = require('../package.json')

const logConfiguration = {
  name: packageFile.name,
  app: packageFile.name,
  env: process.env.NODE_ENV,
  level: config.logging.log.level,
  console: config.logging.console,
  stdout: config.logging.stdout,
  src: config.logging.src
}
log.init(logConfiguration)

/* **************************
 * ******* TEMPLATING *******
 * **************************
 */
const exphbs = require('express-handlebars')

server.set('views', path.join(__dirname, '/views'))
server.engine('handlebars', exphbs())
server.set('view engine', 'handlebars')

/* ******************************
 * ******* ACCESS LOGGING *******
 * ******************************
 */
const accessLog = require('kth-node-access-log')

server.use(accessLog(config.logging.accessLog))

// QUESTION: Should this really be set here?
// http://expressjs.com/en/api.html#app.set
server.set('case sensitive routing', true)

/* *******************************
 * ******* REQUEST PARSING *******
 * *******************************
 */
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

server.use(bodyParser.json({ limit: '50mb' }))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }))
// server.use(bodyParser.json())
// server.use(bodyParser.urlencoded({ extended: true }))
server.use(cookieParser())

/* ******************************
 * ******* AUTHENTICATION *******
 * ******************************
 */
const passport = require('passport')
require('./authentication')

server.use(passport.initialize())
server.use(passport.session())

/* ************************
 * ******* DATABASE *******
 * ************************
 */
// Just connect the database
require('./database').connect()

/* **********************************
 * ******* APPLICATION ROUTES *******
 * **********************************
 */
const { addPaths } = require('kth-node-express-routing')

const { createApiPaths, createSwaggerRedirectHandler, notFoundHandler, errorHandler } = require('kth-node-api-common')
const swaggerData = require('../swagger.json')
const { System, StoredMemoPdf } = require('./controllers')

// System pages routes
const systemRoute = AppRouter()
systemRoute.get('system.count', config.proxyPrefixPath.uri + '/_count', StoredMemoPdf.collectionLength)
systemRoute.get('system.monitor', config.proxyPrefixPath.uri + '/_monitor', System.monitor)
systemRoute.get('system.about', config.proxyPrefixPath.uri + '/_about', System.about)
systemRoute.get('system.paths', config.proxyPrefixPath.uri + '/_paths', System.paths)
systemRoute.get('system.robots', '/robots.txt', System.robotsTxt)
systemRoute.get('system.swagger', config.proxyPrefixPath.uri + '/swagger.json', System.swagger)
server.use('/', systemRoute.getRouter())

// Swagger UI
const express = require('express')

const swaggerUrl = config.proxyPrefixPath.uri + '/swagger'
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath()

const redirectUrl = `${swaggerUrl}?url=${getPaths().system.swagger.uri}`

server.use(swaggerUrl, createSwaggerRedirectHandler(redirectUrl, config.proxyPrefixPath.uri))
server.use(swaggerUrl, express.static(pathToSwaggerUi))

// Add API endpoints defined in swagger to path definitions so we can use them to register API enpoint handlers
addPaths(
  'api',
  createApiPaths({
    swagger: swaggerData,
    proxyPrefixPathUri: config.proxyPrefixPath.uri
  })
)

// Middleware to protect enpoints with apiKey
const authByApiKey = passport.authenticate('apikey', { session: false })

// Application specific API enpoints
const { Sample, CourseMemo, PDF, MixedWebAndPdfMemosList } = require('./controllers')
const { ApiRouter } = require('kth-node-express-routing')

const apiRoute = ApiRouter(authByApiKey)
const paths = getPaths()

// Api enpoints
apiRoute.register(paths.api.checkAPIkey, System.checkAPIKey)

apiRoute.register(paths.api.getDataById, Sample.getData)
apiRoute.register(paths.api.postDataById, Sample.postData)
// Get one draft | update it
apiRoute.register(paths.api.getDraftByEndPoint, CourseMemo.getDraftByEndPoint) // step 2: editor, fetch data
apiRoute.register(paths.api.updateCreatedDraft, CourseMemo.putDraftByEndPoint) // step 2: editor, fast update

// step 1: choose action, new draft, or copied draft from published memo (same memoEndPoint)
apiRoute.register(paths.api.createDraftByMemoEndPoint, CourseMemo.createDraftByMemoEndPoint)
apiRoute.register(paths.api.copyFromAPublishedMemo, CourseMemo.createDraftByMemoEndPoint)

// // GET ARRAY OF MEMOS BY TYPE AND COURSE CODE
apiRoute.register(paths.api.getAllMemosByCourseCodeAndType, CourseMemo.getMemosByCourseCodeAndType)
apiRoute.register(paths.api.getCourseSemesterUsedRounds, CourseMemo.getCourseSemesterUsedRounds) // step 1: to show up which rounds already taken
apiRoute.register(paths.api.getMemosStartingFromPrevYearSemester, CourseMemo.getMemosStartingFromPrevSemester) // step 1: to show up which rounds already taken

// // GET one PUBLISHED MEMO | PUBLISH MEMO
apiRoute.register(paths.api.getPublishedMemoByEndPoint, CourseMemo.getMemoByEndPoint) // public page: show only published one
apiRoute.register(paths.api.publishMemoByEndPoint, CourseMemo.postNewVersionOfPublishedMemo) // step 4: publish new version and unpublish prev version if it exists
server.use('/', apiRoute.getRouter())

// Delete a course memo draft
apiRoute.register(paths.api.deleteDraftByMemoEndPoint, CourseMemo.deleteMemoDraftByMemoEndPoint)

// Get course memo PDF by end point
apiRoute.register(paths.api.getPdfMemoByEndPoint, PDF.getMemoByEndPoint)

// Get list of stored pdf files for kursinfo-web (migrated from kurs-pm-api)
apiRoute.register(paths.api.getStoredMemoPdfListByCourseCode, StoredMemoPdf.getStoredCourseMemoPdfListByCourseCode)
// Get list of stored pdf files together with web-based memos all published for kurs-pm-web (migrated from kurs-pm-api)
apiRoute.register(paths.api.getPdfAndWebMemosListByCourseCode, MixedWebAndPdfMemosList.getMixedWebAndPdfMemosList)

// Catch not found and errors
server.use(notFoundHandler)
server.use(errorHandler)

/* ****************************
 * ******* APP SPECIFIC *******
 * ****************************
 */

/* **********************************
 * ******* INIT AZURE CLIENT  *******
 * **********************************
 */

const { getClient } = require('@kth/kth-node-cosmos-db')

getClient({
  username: config.db.username,
  password: config.db.password,
  host: config.db.host,
  db: 'kursinfo',
  defaultThroughput: 200,
  maxThroughput: 400,
  collections: [{ name: 'coursememos' }, { name: 'memofiles' }]
})

module.exports = server
