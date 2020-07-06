'use strict'

const log = require('kth-node-log')

const { fetchMemoByEndPointAndStatus } = require('../lib/dbDataById')
const { createPdf } = require('../lib/pdfRenderer.js')

async function getMemoByEndPoint(req, res, next) {
  const { memoEndPoint } = req.params
  const { download, fileName } = req.query
  log.debug('getMemoByEndPoint: Received request for PDF with memoEndPoint:', memoEndPoint)
  try {
    const dbResponse = await fetchMemoByEndPointAndStatus(memoEndPoint, 'published')
    const contentDisposition = download === 'true' ? 'attachment' : 'inline'
    res.type('application/pdf')
    res.set('Content-Disposition', `${contentDisposition}; filename=${fileName}.pdf`)
    // eslint-disable-next-line no-console
    console.time('getMemoByEndPoint: createPdf')
    await createPdf(res, dbResponse)
    // eslint-disable-next-line no-console
    console.timeEnd('getMemoByEndPoint: createPdf')
    log.debug('getMemoByEndPoint: Responded to request for PDF with memoEndPoint:', memoEndPoint)
  } catch (err) {
    log.error('getMemoByEndPoint: Failed request for PDF, error:', { err })
    next(err)
  }
}

module.exports = {
  getMemoByEndPoint
}
