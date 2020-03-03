'use strict'

const courseSyllabus = require('./categories/courseSyllabusFields')
const generalCourseInfo = require('./categories/generalCourseInfoFields')
const teachersTypesUg = require('./categories/teachersFields')
const courseRoundFields = require('./categories/courseRoundFields')
const courseMemoSpec = require('./categories/courseMemoSpec')
const extraHeaders = require('./categories/extraHeadersSpec')

const combinedMemoData = {
  // TODO: TO MAKE IT AS A SUBDOCUMENT SCHEMA
  // _id: String,
  ...courseMemoSpec,
  ...courseRoundFields,
  ...courseSyllabus,
  ...extraHeaders,
  ...generalCourseInfo,
  ...teachersTypesUg,
  visibleInMemo: {
    type: Object,
    default: {}
  }
}

module.exports = combinedMemoData
