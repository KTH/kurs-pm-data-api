'use strict'

const log = require('kth-node-log')
const PDFDocument = require('pdfkit')

const dbOneDocument = require('../lib/dbDataById')

async function generatePDF(writeStream, data) {
  log.info('generatePDF: Generate PDF with data', data)
  const pageSize = 'A4'
  const pageMargins = {
    top: 25,
    bottom: 25,
    left: 25,
    right: 25
  }
  const doc = new PDFDocument({
    size: pageSize,
    margins: pageMargins,
    // must be true to allow stamping footer (page numbers) before sending PDF to client
    bufferPages: true
  })
  doc.pipe(writeStream)
  doc.fontSize(16)
  doc.font('Helvetica')
  doc.text(data.memoEndPoint)
  doc.end()
}

/* eslint-disable consistent-return */
async function getMemoByEndPoint(req, res) {
  const { memoEndPoint } = req.params
  log.info('getMemoByEndPoint: Received request for PDF with memoEndPoint:', memoEndPoint)
  try {
    const dbResponse = await dbOneDocument.fetchMemoByEndPointAndStatus(memoEndPoint, 'published')
    res.type('application/pdf')
    if (req.query.download === 'true') {
      res.set('Content-Disposition', 'attachment; filename=' + memoEndPoint + '.pdf')
    }
    generatePDF(res, dbResponse)
    log.info('getMemoByEndPoint: Responded to request for PDF with memoEndPoint:', memoEndPoint)
  } catch (err) {
    log.error('getMemoByEndPoint: Failed request for PDF, error:', { err })
    return err
  }
}

module.exports = {
  getMemoByEndPoint
}
