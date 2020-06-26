'use strict'

const fontPaths = {
  OpenSans: 'server/fonts/OpenSans-Regular.ttf',
  Georgia: 'server/fonts/Georgia.ttf'
}

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

const EMPTY = ['No information inserted', 'Ingen information tillagd']

module.exports = {
  fontPaths,
  fontSizes,
  paragraphGaps,
  pageMargins,
  pageSize,
  EMPTY
}
