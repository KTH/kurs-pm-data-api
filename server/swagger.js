const config = require('./configuration').server

/**
 * Middleware to filter out swagger files
 */
const swaggerFilesRE = /(index.html|swagger-ui|favicon).*\.(css|js|png)/
function swaggerHandler(req, res, next) {
  if (req.originalUrl.indexOf('/swagger/') >= 0) {
    const requestedUrl = req.originalUrl.replace(`${config.proxyPrefixPath.uri}/swagger/`, '')

    if (swaggerFilesRE.test(requestedUrl)) {
      return next()
    }

    return res.status(404).json({ message: `Not found: ${req.originalUrl}` })
  }
  return next()
}

module.exports = {
  swaggerHandler,
}
