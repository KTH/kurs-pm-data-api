'use strict'

const Entities = require('html-entities').AllHtmlEntities

const { messages } = require('./pdfConstants')

const entities = new Entities()

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

function decodeHtml(html) {
  return entities.decode(html)
}

module.exports = {
  inPx,
  concatMemoName,
  decodeHtml
}
