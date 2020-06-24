'use strict'

const log = require('kth-node-log')

const { fetchMemoByEndPointAndStatus } = require('../lib/dbDataById')
const { createPdf } = require('../lib/pdfRenderer.js')

/* eslint-disable consistent-return */
async function getMemoByEndPoint(req, res) {
  const { memoEndPoint } = req.params
  log.debug('getMemoByEndPoint: Received request for PDF with memoEndPoint:', memoEndPoint)
  try {
    const dbResponse = await fetchMemoByEndPointAndStatus(memoEndPoint, 'published')
    res.type('application/pdf')
    if (req.query.download === 'true') {
      res.set('Content-Disposition', 'attachment; filename=' + memoEndPoint + '.pdf')
    }
    // eslint-disable-next-line no-console
    console.time('getMemoByEndPoint: createPdf')
    await createPdf(res, dbResponse)
    // eslint-disable-next-line no-console
    console.timeEnd('getMemoByEndPoint: createPdf')
    log.debug('getMemoByEndPoint: Responded to request for PDF with memoEndPoint:', memoEndPoint)
  } catch (err) {
    log.error('getMemoByEndPoint: Failed request for PDF, error:', { err })
    return err
  }
}

module.exports = {
  getMemoByEndPoint
}
