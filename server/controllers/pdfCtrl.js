'use strict'

const log = require('kth-node-log')

const { fetchMemoByEndPointAndStatus } = require('../lib/dbDataById')
const { generatePDF } = require('../lib/pdfGenerator')
const { createPdf } = require('../lib/pdfRenderer.js')

/* eslint-disable consistent-return */
async function getMemoByEndPoint(req, res) {
  const { memoEndPoint } = req.params
  log.info('getMemoByEndPoint: Received request for PDF with memoEndPoint:', memoEndPoint)
  try {
    const dbResponse = await fetchMemoByEndPointAndStatus(memoEndPoint, 'published')
    res.type('application/pdf')
    if (req.query.download === 'true') {
      res.set('Content-Disposition', 'attachment; filename=' + memoEndPoint + '.pdf')
    }
    generatePDF(res, dbResponse)
    createPdf(memoEndPoint)
    log.info('getMemoByEndPoint: Responded to request for PDF with memoEndPoint:', memoEndPoint)
  } catch (err) {
    log.error('getMemoByEndPoint: Failed request for PDF, error:', { err })
    return err
  }
}

module.exports = {
  getMemoByEndPoint
}
