'use strict'

const log = require('kth-node-log')

const { fetchMemoByEndPointAndStatus } = require('../lib/dbDataById')
const { createPdf } = require('../lib/pdfRenderer.js')

async function getMemoByEndPoint(req, res, next) {
  const { memoEndPoint } = req.params
  const { documentName, download, status } = req.query
  const fileName = documentName || memoEndPoint
  log.debug('getMemoByEndPoint: Received request for PDF with memoEndPoint:', memoEndPoint, ', and status:', status)
  try {
    const dbResponse = await fetchMemoByEndPointAndStatus(memoEndPoint, status)
    const contentDisposition = download === 'true' ? 'attachment' : 'inline'
    res.type('application/pdf')
    res.set('Content-Disposition', `${contentDisposition}; filename=${fileName}.pdf`)
    // eslint-disable-next-line no-console
    // console.time('getMemoByEndPoint: createPdf')
    await createPdf(res, dbResponse)
    // eslint-disable-next-line no-console
    // console.timeEnd('getMemoByEndPoint: createPdf')
    log.debug('getMemoByEndPoint: Responded to request for PDF with memoEndPoint:', memoEndPoint)
  } catch (err) {
    log.error('getMemoByEndPoint: Failed request for PDF, error:', { err })
    next(err)
  }
}

module.exports = {
  getMemoByEndPoint
}
