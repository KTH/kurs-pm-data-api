'use strict'

const logotypePath = 'server/img/KTH_Logotyp_RGB_2013.png'

const pageMeasurements = {
  A4: {
    logotype: '26mm' /* ”Kronbredd” 10mm */,
    logotypeHalf: '13mm',
    crown: '10mm',
    crownDouble: '20mm',
    crownDoubleAdjusted: '17mm',
    pageMargin: '10mm'
  }
}

const typography = {
  regular: 'Open Sans',
  bold: 'Open Sans Bold',
  h1: 32,
  h2: 24,
  h3: 18,
  h4: 14,
  p: 12
}

const EMPTY = ['No information inserted', 'Ingen information tillagd']
const NOT_AVAILABLE = 'N/A'
const LANGUAGE = { en: 'English', sv: 'Svenska' }

module.exports = {
  logotypePath,
  pageMeasurements,
  typography,
  EMPTY,
  NOT_AVAILABLE,
  LANGUAGE
}
