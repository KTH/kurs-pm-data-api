'use strict'

const ReactPDF = require('@react-pdf/renderer')
const log = require('kth-node-log')

const { MyDocument } = require('../components-dist/MyDocument')

async function createPdf(writeStream, data) {
  log.info('createPdf: Create PDF with data', data)
  const doc = await ReactPDF.renderToStream(MyDocument())
  doc.pipe(writeStream)
}

module.exports = {
  createPdf
}
