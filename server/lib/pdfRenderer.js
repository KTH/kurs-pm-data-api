'use strict'

const ReactPDF = require('@react-pdf/renderer')

const CourseMemo = require('../components-dist/CourseMemo').default

async function createPdf(writeStream, data) {
  // eslint-disable-next-line no-console
  console.time('createPdf: ReactPDF.renderToStream')
  const doc = await ReactPDF.renderToStream(CourseMemo({ data }))
  // eslint-disable-next-line no-console
  console.timeEnd('createPdf: ReactPDF.renderToStream')
  doc.pipe(writeStream)

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      resolve(doc)
    })
    writeStream.on('error', reject)
  })
}

module.exports = {
  createPdf
}
