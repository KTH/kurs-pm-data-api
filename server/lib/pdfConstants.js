'use strict'

const fontPaths = {
  OpenSans: 'server/fonts/OpenSans-Regular.ttf',
  Georgia: 'server/fonts/Georgia.ttf'
}

const logotypePath = 'server/img/KTH_Logotyp_RGB_2013.png'

const fontSizes = {
  h1: 36,
  h2: 24,
  h3: 18,
  p: 12
}

const paragraphGaps = {
  h1: 18,
  h2: 12,
  h3: 6,
  p: 18
}

const pageMargins = 20

const pageSize = 'A4'

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
  fontPaths,
  logotypePath,
  fontSizes,
  paragraphGaps,
  pageMargins,
  pageSize,
  pageMeasurements,
  typography,
  EMPTY,
  NOT_AVAILABLE,
  LANGUAGE
}
