'use strict'

const Entities = require('html-entities').AllHtmlEntities

const i18n = require('../../i18n')

const { context } = require('./fieldsByType')

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
  const { memoLabel } = i18n.messages[langIndex].messages
  const { season } = i18n.messages[langIndex].extraInfo
  return `${memoLabel} ${seasonStr(season, semester)}-${ladokRoundIds.join('-')}`
}

function formatCredits(credits, creditUnitAbbr, language) {
  const localeCredits = language === 'sv' ? credits.toLocaleString('sv-SE') : credits.toLocaleString('en-US')
  const creditUnit = language === 'sv' ? creditUnitAbbr : 'credits'
  return `${localeCredits} ${creditUnit}`
}

function decodeHtml(html) {
  return entities.decode(html)
}

function getMessages(language) {
  const languageIndex = language === 'en' ? 0 : 1
  return i18n.messages[languageIndex]
}

function visibleSection(sectionId, courseMemoData) {
  // Context is the global configuration, where sections can be set to required,
  // and have a type that further qualifies their content.
  const { isRequired, type } = context[sectionId]

  // The section is required, and mandatory or editable mandatory, and will therefor
  // be shown. If no content exists, the section will display a warning (managed in component).
  if (isRequired && (type === 'mandatory' || type === 'mandatoryAndEditable')) {
    return true
  }

  // Sections af other types should only be visible if they have content
  if (!courseMemoData[sectionId]) {
    return false
  }

  // Finally, is visibility explicitly set for section in memo
  return !!courseMemoData.visibleInMemo[sectionId]
}

function filterVisibible(section, courseMemoData) {
  const subSectionIds = section.content ? section.content : []
  const visibleSubSections = subSectionIds.filter(id => visibleSection(id, courseMemoData))
  return visibleSubSections
}

module.exports = {
  inPx,
  concatMemoName,
  formatCredits,
  decodeHtml,
  getMessages,
  filterVisibible
}
