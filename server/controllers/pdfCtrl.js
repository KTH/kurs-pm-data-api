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
    memoLabel: 'Course memo',
    headers: {
      contentAndOutcomes: 'Content and learning outcomes',
      courseContent: 'Course contents',
      learningOutcomes: 'Intended learning outcomes',
      learningActivities: 'Learning activities',
      scheduleDetails: 'Schedule details'
    }
  },
  {
    season: {
      1: 'VT ',
      2: 'HT '
    },
    memoLabel: 'Kurs-PM',
    headers: {
      contentAndOutcomes: 'Innehåll och lärandemål',
      courseContent: 'Kursinnehåll',
      learningOutcomes: 'Lärandemål',
      learningActivities: 'Läraktiviteter',
      scheduleDetails: 'Detaljschema'
    }
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

function concatMemoName(semester, ladokRoundIds, langAbbr) {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { memoLabel, season } = messages[langIndex]
  return `${memoLabel} ${seasonStr(season, semester)}-${ladokRoundIds.join('-')}`
}

function addTitle(doc, data) {
  doc.fontSize(36)
  doc.font('server/fonts/OpenSans-Regular.ttf')

  const text = concatMemoName(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr)
  doc.text(text, { paragraphGap: 12 })
}

function addSections(doc, data) {
  const { headers } = messages[data.memoCommonLangAbbr === 'en' ? 0 : 1]
  const sections = [
    {
      id: 'contentAndOutcomes',
      content: ['courseContent', 'learningOutcomes', 'learningActivities', 'scheduleDetails']
    }
  ]

  sections.forEach(section => {
    doc.fontSize(24)
    doc.font('server/fonts/OpenSans-Regular.ttf')
    const sectionHeader = headers[section.id]
    doc.text(sectionHeader, { paragraphGap: 12 })
    section.content.forEach(subSection => {
      doc.fontSize(18)
      doc.font('server/fonts/OpenSans-Regular.ttf')
      const subSectionHeader = headers[subSection]
      doc.text(subSectionHeader, { paragraphGap: 6 })
      doc.fontSize(12)
      doc.font('server/fonts/Georgia.ttf')
      const text = data[subSection] ? data[subSection] : ' '
      doc.text(text, { paragraphGap: 18 })
    })
  })
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
  addSections(doc, data)
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
