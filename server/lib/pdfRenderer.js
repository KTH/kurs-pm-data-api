'use strict'

const ReactPDF = require('@react-pdf/renderer')
const log = require('kth-node-log')

const CourseMemo = require('../components-dist/CourseMemo').default

async function createPdf(writeStream, data) {
  log.debug('createPdf: Create PDF with data', data)
  // eslint-disable-next-line no-console
  console.time('createPdf: ReactPDF.renderToStream')
  const doc = await ReactPDF.renderToStream(CourseMemo({ data }))
  // eslint-disable-next-line no-console
  console.timeEnd('createPdf: ReactPDF.renderToStream')
  doc.pipe(writeStream)
}

module.exports = {
  createPdf
}
