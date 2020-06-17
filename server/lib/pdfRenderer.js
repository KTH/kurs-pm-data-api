/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-filename-extension */

'use strict'

const path = require('path')
const ReactPDF = require('@react-pdf/renderer')

const { MyDocument } = require('../components-dist/MyDocument')

const documentPath = 'server/documents/'

function createPdf(id) {
  ReactPDF.render(MyDocument(), path.resolve(`${documentPath}${id}.pdf`))
}

module.exports = {
  documentPath,
  createPdf
}
