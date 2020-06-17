'use strict'

const log = require('kth-node-log')
const PDFDocument = require('pdfkit')

const { inPx, concatMemoName, decodeHtml } = require('./pdfUtils')
const { fontPaths, fontSizes, paragraphGaps, pageMargins, pageSize, messages, sections } = require('./pdfConstants')

function addTitle(doc, data) {
  doc.fontSize(fontSizes.h1)
  doc.font(fontPaths.OpenSans)

  const text = concatMemoName(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr)
  doc.text(text, { paragraphGap: paragraphGaps.h1 })
}

function addSections(doc, data) {
  const { headers } = messages[data.memoCommonLangAbbr === 'en' ? 0 : 1]

  sections.forEach(section => {
    doc.fontSize(fontSizes.h2)
    doc.font(fontPaths.OpenSans)
    const sectionHeader = headers[section.id]
    doc.text(sectionHeader, { paragraphGap: paragraphGaps.h2 })
    section.content.forEach(subSection => {
      doc.fontSize(fontSizes.h3)
      doc.font(fontPaths.OpenSans)
      const subSectionHeader = headers[subSection]
      doc.text(subSectionHeader, { paragraphGap: paragraphGaps.h3 })
      doc.fontSize(fontSizes.p)
      doc.font(fontPaths.Georgia)
      const text = data[subSection] ? decodeHtml(data[subSection]) : ' '
      doc.text(text, { paragraphGap: paragraphGaps.p })
    })
  })
}

async function generatePDF(writeStream, data) {
  log.info('generatePDF: Generate PDF with data', data)
  const size = pageSize
  const margins = {
    top: inPx(pageMargins),
    bottom: inPx(pageMargins),
    left: inPx(pageMargins),
    right: inPx(pageMargins)
  }
  const doc = new PDFDocument({
    size,
    margins,
    // must be true to allow stamping footer (page numbers) before sending PDF to client
    bufferPages: true
  })
  doc.pipe(writeStream)
  addTitle(doc, data)
  addSections(doc, data)
  doc.end()
}

module.exports = {
  generatePDF
}
