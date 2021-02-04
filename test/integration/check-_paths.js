/**
 * Run with
 *    node check-_paths.js <BASE_URL>
 * or
 *    INTEGRATION_TEST_BASEURL=<BASE_URL> node check-_paths.js
 *
 * Example:
 *    node check-_paths.js https://api.kth.se/api/files
 *
 * This script looks for a file named "./check-_paths.json"
 * which will be used as configuration. Example:
 *   {
 *     "expectedSingleResponses": [
 *       { "method": "GET", "uri": "swagger.json", "statusCode": 200 },
 *       { "method": "GET", "uri": "v1/file/:token", "statusCode": 400 },
 *       { "method": "GET", "uri": "v1/avatar/image/:token", "statusCode": 400 }
 *     ],
 *     "expectedDefaultResponseCodes": [401, 403]
 *   }
 *
 * The script fetches all paths from every given server
 * (e.g. via https://api.kth.se/api/files/_paths)
 * and sends a request to every listed endpoint.
 *
 * Please note:
 *   No requests will be send to endpoints
 *   with a key from ENDPOINT_KEYS_TO_IGNORE.
 *
 * The status-code of any response that doesn't match the specifications
 * of the arrays "expectedSingleResponses" and "expectedDefaultResponseCodes"
 * will be printed out as a problem
 * (e.g. a status 200 on "_checkAPIkey" or a status 500 on "v1/file/:token").
 *
 * The script exits
 * - with code 0 iff no problematic response was found;
 * - with code 1 iff some endpoints didn't responded as expected;
 * - with code 2 if an unexpected error occured.
 */

/* eslint-disable no-console */

// @ts-check

const path = require('path')
const http = require('http')
const https = require('https')

const { readFile: readFileAsync } = require('fs').promises

const CONF_FILE = './check-_paths.json'

const INTERNAL_HTTP_TIMEOUT = 2000
const INTERNAL_ERROR_CODE = 'failed'
const INTERNAL_TIMEOUT_CODE = 'timeout'

const WAIT_FOR_SERVER_TIMEOUT = 15000

const ENDPOINT_KEYS_TO_IGNORE = ['system.monitor', 'system.about', 'system.paths', 'system.robots', 'system.swagger']

/**
 * @param {*} input
 * @returns {boolean}
 */
function _isObject(input) {
  return input != null && typeof input === 'object'
}

/**
 * @throws
 * @returns {object} with shape { baseUrl }
 */
function getBaseUrl() {
  const { INTEGRATION_TEST_BASEURL } = process.env

  let baseUrl = process.argv[2] || INTEGRATION_TEST_BASEURL
  if (!baseUrl) {
    throw new Error('Missing base-URL')
  }
  if (!/^https?:\/\/.+/.test(baseUrl)) {
    throw new Error(`Invalid base-URL "${baseUrl}"`)
  }
  if (baseUrl[baseUrl.length - 1] !== '/') {
    baseUrl += '/'
  }

  return baseUrl
}

/**
 * @throws
 * @returns {Promise<object>}
 */
async function readConfigurationAsync() {
  let configuration
  try {
    const filepath = path.resolve(__dirname, CONF_FILE)
    const jsonData = await readFileAsync(filepath)
    configuration = JSON.parse(jsonData.toString('utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`Configuration file missing: ${CONF_FILE}`)
      return {}
    }
    throw error
  }

  try {
    if (!_isObject(configuration)) {
      throw new Error('JSON must be an object')
    }
    const { expectedSingleResponses, expectedDefaultResponseCodes } = configuration

    const validProps = ['expectedSingleResponses', 'expectedDefaultResponseCodes']
    const invalidProps = Object.keys(configuration).filter((key2) => !validProps.includes(key2))
    if (invalidProps.length > 0) {
      throw new Error(`Invalid prop(s) found: ${invalidProps.join(', ')}`)
    }

    const _hasCorrectSingleExpectations =
      expectedSingleResponses == null ||
      (Array.isArray(expectedSingleResponses) && expectedSingleResponses.every(_isObject))
    if (!_hasCorrectSingleExpectations) {
      throw new Error(`If "expectedSingleResponses" is used, it must be object[]`)
    }

    const _hasCorrectDefaultExpectations =
      Array.isArray(expectedDefaultResponseCodes) &&
      expectedDefaultResponseCodes.some((item) => ['string', 'number'].includes(typeof item))
    if (!_hasCorrectDefaultExpectations) {
      throw new Error(`"expectedDefaultResponseCodes" must be string[] or number[]`)
    }
  } catch (error) {
    error.message = `Configuration error: ${error.message}`
    throw error
  }

  return configuration
}

/**
 * @param {string|URL} url
 * @param {object} [options]
 * @param {number} [timeoutMS]
 * @returns {Promise<object>} with shape { statusCode, contentType, body, error }
 */
function fetchAsync(url, options = {}, timeoutMS = INTERNAL_HTTP_TIMEOUT) {
  return new Promise((resolve) => {
    let timeoutID = setTimeout(() => {
      console.warn(`\n   (Timeout on request ${url})`)
      timeoutID = null
      resolve({ statusCode: INTERNAL_TIMEOUT_CODE })
    }, timeoutMS)

    const _success = (result) => {
      if (timeoutID) {
        clearTimeout(timeoutID)
        timeoutID = null
        resolve(result)
      }
    }
    const _failure = (error) => {
      if (timeoutID) {
        clearTimeout(timeoutID)
        timeoutID = null
        resolve({ statusCode: INTERNAL_ERROR_CODE, error: error.message })
      }
    }

    const _responseHandler = (res) => {
      const { statusCode, headers } = res
      const contentType = headers['content-type'] || ''

      const chunkList = []
      res.setEncoding('utf8')
      res.on('error', _failure)
      res.on('data', (chunk) => chunkList.push(chunk))

      res.on('end', () => {
        const data = chunkList.join('')
        if (data === '') {
          _success({ statusCode, contentType, body: null })
        } else if (contentType.includes('application/json')) {
          try {
            const result = JSON.parse(chunkList.join(''))
            _success({ statusCode, contentType, body: result })
          } catch (error) {
            _failure(error)
          }
        } else {
          _success({ statusCode, contentType, body: data })
        }
      })
    }

    const _httpOrHttps = String(url).startsWith('https://') ? https : http

    const req = _httpOrHttps.request(url, options, _responseHandler)
    req.on('error', _failure)
    req.end()
  })
}

/**
 * @param {string} baseUrl
 * @param {number} timeoutMS
 */
async function waitForServerToBeAvailable(baseUrl, timeoutMS) {
  const singleTimeout = Math.floor(timeoutMS / 10)

  let isAvailable = false
  for (let i = 0; i < 10 && !isAvailable; i++) {
    const endTS = new Date().getTime() + singleTimeout

    // eslint-disable-next-line no-await-in-loop
    const { statusCode, error } = await fetchAsync(baseUrl, {}, singleTimeout)
    switch (statusCode) {
      default:
        isAvailable = true
        break

      case INTERNAL_TIMEOUT_CODE:
        break

      case INTERNAL_ERROR_CODE:
        if (error.includes('ECONNREFUSED')) {
          console.log(`\n   (Waiting for server ${baseUrl})`)
          const currTS = new Date().getTime()
          if (currTS < endTS) {
            // eslint-disable-next-line no-await-in-loop
            await new Promise((resolve) => setTimeout(resolve, endTS - currTS))
          }
        } else {
          isAvailable = true
        }
        break
    }
  }
}

/**
 * @param {string} baseUrl
 * @throws
 * @returns {Promise<object[]|null>}
 *    resolves with list of items in shape { uri, method, ... }
 */
async function listAllPathsAsync(baseUrl) {
  const pathUrl = new URL('_paths', baseUrl)

  let response = { statusCode: INTERNAL_TIMEOUT_CODE }
  for (let i = 0; i < 3 && response.statusCode === INTERNAL_TIMEOUT_CODE; i++) {
    // eslint-disable-next-line no-await-in-loop
    response = await fetchAsync(pathUrl)
  }
  const { statusCode, contentType, body, error } = response

  if (statusCode === INTERNAL_TIMEOUT_CODE) {
    console.log(`\n   (Failed to query paths - timeout on request ${pathUrl})`)
    return null
  }

  if (statusCode === INTERNAL_ERROR_CODE) {
    throw new Error(`Failed to query paths (error "${error}")`)
  }
  if (String(statusCode) !== '200') {
    throw new Error(`Failed to query paths - unexpected status ${statusCode}`)
  }
  if (!contentType.includes('application/json')) {
    throw new Error(`Failed to query paths - invalid content-type "${contentType}"`)
  }

  const result = []
  const _searchEndpointsInObject = (input, fullKey = '') => {
    if (_isObject(input) && !ENDPOINT_KEYS_TO_IGNORE.includes(fullKey)) {
      if (typeof input.uri === 'string' && typeof input.method === 'string') {
        result.push(input)
      } else {
        Object.keys(input).forEach((key) => {
          _searchEndpointsInObject(input[key], fullKey === '' ? key : `${fullKey}.${key}`)
        })
      }
    }
  }
  _searchEndpointsInObject(body)

  return result
}

/**
 * @param {object} serverConfiguration
 * @param {string} serverConfiguration.baseUrl
 * @throws
 * @returns {Promise}
 */
async function runTestsWithServerAsync({ baseUrl }) {
  const resultsByCode = {}
  let resultsCount = 0

  console.log(`\n - Processing ${baseUrl} ...`)

  await waitForServerToBeAvailable(baseUrl, WAIT_FOR_SERVER_TIMEOUT)

  const pathsList = await listAllPathsAsync(baseUrl)
  if (pathsList == null) {
    return {}
  }

  await Promise.all(
    pathsList.map(async ({ uri, method }) => {
      const endpoint = new URL(uri, baseUrl)
      const _method = method.toUpperCase()

      let result = { statusCode: INTERNAL_TIMEOUT_CODE }
      for (let i = 0; i < 3 && result.statusCode === INTERNAL_TIMEOUT_CODE; i++) {
        // eslint-disable-next-line no-await-in-loop
        result = await fetchAsync(endpoint, { method: _method })
      }
      const { statusCode, error } = result

      const output = { method: _method, endpoint: String(endpoint) }
      if (error) {
        output.error = error
      }
      if (resultsByCode[statusCode] == null) {
        resultsByCode[statusCode] = []
      }
      resultsByCode[statusCode].push(output)
      resultsCount += 1
    })
  )

  console.log(`\n   Processed ${baseUrl} - got ${resultsCount} response(s)`)

  return resultsByCode
}

/**
 * @param {object} serverConfiguration
 *    with shape { baseUrl, expectedSingleResponses?, expectedDefaultResponseCodes? }
 * @param {object} serverResults
 *      e.g. { 200: [ { method: "GET", endpoint: "..." }, ... ], ... }
 * @returns {object[]}
 *    list of problematic results
 *    in shape { statusCode, method, endpoint, ... }
 */
function checkServerResultsForProblems(serverConfiguration, serverResults) {
  const { baseUrl, expectedSingleResponses, expectedDefaultResponseCodes } = serverConfiguration

  const problems = []
  Object.keys(serverResults).forEach((statusCode) => {
    serverResults[statusCode].forEach((resultItem) => {
      const { method, endpoint } = resultItem

      if (Array.isArray(expectedSingleResponses)) {
        const _confMatchesItem = (expectItem) =>
          expectItem.method === method && String(new URL(expectItem.uri, baseUrl)) === endpoint
        const singleConf = expectedSingleResponses.filter(_confMatchesItem)[0]
        if (singleConf != null) {
          if (String(singleConf.statusCode) !== String(statusCode)) {
            problems.push({ statusCode, ...resultItem })
          }
          return
        }
      }

      if (Array.isArray(expectedDefaultResponseCodes)) {
        if (expectedDefaultResponseCodes.every((code) => String(code) !== String(statusCode))) {
          problems.push({ statusCode, ...resultItem })
        }
      }
    })
  })

  return problems
}

/**
 * @param {number} [exitCode]
 * @returns {Promise}
 */
async function exitAsync(exitCode = 0) {
  const { INTEGRATION_TEST_SUCCESS_DELAY, INTEGRATION_TEST_FAILURE_DELAY } = process.env
  const _delay = exitCode === 0 ? INTEGRATION_TEST_SUCCESS_DELAY : INTEGRATION_TEST_FAILURE_DELAY

  if (/\d+/.test(_delay)) {
    console.log(`\nExit with code ${exitCode} in ${_delay} ms`)
    await new Promise((resolve) => setTimeout(resolve, parseInt(_delay, 10)))
  } else {
    console.log(`\nExit with code ${exitCode}`)
  }

  process.exit(exitCode)
}

/**
 * @returns {Promise<number>}
 */
async function mainAsync() {
  try {
    console.log(`\n${path.basename(process.argv[1])} - checking endpoints listed by a given server via _paths`)

    const baseUrl = getBaseUrl()

    if (ENDPOINT_KEYS_TO_IGNORE.length > 0) {
      console.log(`\nPlease note: No requests will be send to\n * "${ENDPOINT_KEYS_TO_IGNORE.join('",\n * "')}".`)
    }

    const configuration = await readConfigurationAsync()

    const serverResults = await runTestsWithServerAsync({ baseUrl, ...configuration })

    if (Object.keys(serverResults).length === 0) {
      console.warn(`\n** NO RESPONSES when checking endpoints (${baseUrl}) **`)
      return 1
    }

    const problems = checkServerResultsForProblems({ baseUrl, ...configuration }, serverResults)
    if (problems.length > 0) {
      console.warn(`\n** UNEXPECTED RESPONSE CODES when checking endpoints (${baseUrl}) **`)
      console.log(problems)
      return 1
    }

    console.log(`\n** No problems found when checking endpoints (${baseUrl}) **`)
    return 0
  } catch (error) {
    console.error(error)
    return 2
  }
}

mainAsync().then(exitAsync)
