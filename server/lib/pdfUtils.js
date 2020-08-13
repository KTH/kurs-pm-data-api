'use strict'

const i18n = require('../../i18n')

const log = require('kth-node-log')

const { format } = require('date-fns')
const { sv, en } = require('date-fns/locale')

const locales = { sv, en }

const { context } = require('./fieldsByType')

function seasonStr(season, semesterCode = '') {
  return `${season[semesterCode.toString()[4]]}${semesterCode.toString().slice(0, 4)}`
}

function concatMemoName(semester, ladokRoundIds, langAbbr) {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { memoLabel } = i18n.messages[langIndex].messages
  const { season } = i18n.messages[langIndex].extraInfo
  return `${memoLabel} ${seasonStr(season, semester)}-${ladokRoundIds.join('-')}`
}

function concatSyllabusName(syllabusValid, langAbbr) {
  const langIndex = langAbbr === 'en' ? 0 : 1
  const { syllabusInformation, syllabusLabelStart, syllabusLabelEnd } = i18n.messages[langIndex].courseMemoLinksLabels
  return `* ${syllabusInformation} ${syllabusLabelStart}${syllabusValid.textFromTo}${syllabusLabelEnd}`
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

function profilerToLog(id, phase, actualTime, baseTime, startTime, commitTime, interactions) {
  log.debug(
    'Profiler',
    id,
    'actualTime:',
    actualTime,
    'baseTime:',
    baseTime,
    'startTime:',
    startTime,
    'commitTime:',
    commitTime,
    'interactions:',
    interactions
  )
}

function timer(id, startTime) {
  return function endTimer() {
    log.debug('Timer:', id, Date.now() - startTime, 'ms')
  }
}

function formatVersionDate(language = 'sv', version) {
  const unixTime = Date.parse(version)
  if (unixTime) {
    return format(new Date(unixTime), 'Ppp', { locale: locales[language] })

    // const locale = language === 'sv' ? 'sv-SE' : 'en-US'
    // return new Date(unixTime).toLocaleString(locale)
  }
  return null
}

module.exports = {
  concatMemoName,
  concatSyllabusName,
  getMessages,
  filterVisibible,
  profilerToLog,
  timer,
  formatVersionDate
}
