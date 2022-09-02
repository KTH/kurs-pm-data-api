'use strict'

const courseSyllabus = require('./categories/courseSyllabusFields')
const generalCourseInfo = require('./categories/generalCourseInfoFields')
const teachersTypesUg = require('./categories/teachersFields')
const courseRoundFields = require('./categories/courseRoundFields')
const courseMemoSpec = require('./categories/courseMemoSpec')
const extraHeaders = require('./categories/extraHeadersSpec')

const combinedMemoData = {
  ...courseMemoSpec,
  ...courseRoundFields,
  ...courseSyllabus,
  ...extraHeaders,
  ...generalCourseInfo,
  ...teachersTypesUg,
  visibleInMemo: {
    type: Object,
    default: {
      ethicalApproachSubSection: 'defaultTrue',
      equipment: 'defaultTrue',
      examinationSubSection: false,
      permanentDisabilitySubSection: 'defaultTrue',
      possibilityToAddition: 'defaultTrue',
      possibilityToCompletion: 'defaultTrue',
      prerequisites: 'defaultTrue',
      teacherAssistants: 'defaultTrue',
    },
  },
}

module.exports = combinedMemoData
