'use strict'

const log = require('kth-node-log')
const PDFDocument = require('pdfkit')

const dbOneDocument = require('../lib/dbDataById')

const messages = [
  {
    season: {
      1: 'Spring ',
      2: 'Autumn '
    },
    memoLabel: 'Course memo'
  },
  {
    season: {
      1: 'VT ',
      2: 'HT '
    },
    memoLabel: 'Kurs-PM'
  }
]

function inPx(mm) {
  const mmInInch = 25.4
  const dpi = 72
  return (mm / mmInInch) * dpi
}

function seasonStr(season, semesterCode = '') {
  return `${season[semesterCode.toString()[4]]}${semesterCode.toString().slice(0, 4)}`
}

function concatMemoName(semester, ladokRoundIds, langAbbr = 'sv') {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { memoLabel, season } = messages[langIndex]
  return `${memoLabel} ${seasonStr(season, semester)}-${ladokRoundIds.join('-')}`
}

function addTitle(doc, data) {
  doc.fontSize(16)
  doc.font('Helvetica')

  const text = concatMemoName(data.semester, data.ladokRoundIds, data.memoLanguage)
  doc.text(text)
}

async function generatePDF(writeStream, data) {
  log.info('generatePDF: Generate PDF with data', data)
  const pageSize = 'A4'
  const pageMargins = {
    top: inPx(20),
    bottom: inPx(20),
    left: inPx(20),
    right: inPx(20)
  }
  const doc = new PDFDocument({
    size: pageSize,
    margins: pageMargins,
    // must be true to allow stamping footer (page numbers) before sending PDF to client
    bufferPages: true
  })
  doc.pipe(writeStream)
  addTitle(doc, data)
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
