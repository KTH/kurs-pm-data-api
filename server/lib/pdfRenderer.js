'use strict'

const ReactPDF = require('@react-pdf/renderer')
const log = require('kth-node-log')

const CourseMemo = require('../components-dist/CourseMemo').default

async function createPdf(writeStream, data) {
  log.info('createPdf: Create PDF with data', data)
  const doc = await ReactPDF.renderToStream(CourseMemo({ data }))
  doc.pipe(writeStream)
}

module.exports = {
  createPdf
}
