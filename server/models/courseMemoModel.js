'use strict'

const courseSyllabus = require('./categories/courseSyllabusFields')
const generalCourseInfo = require('./categories/generalCourseInfoFields')
const teachersTypesUg = require('./categories/teachersFields')
const courseRoundFields = require('./categories/courseRoundFields')
const courseMemoSpec = require('./categories/courseMemoSpec')

const mongoose = require('mongoose')

const schema = mongoose.Schema({
  _id: String,
  courseCode: {
    type: String,
    trim: true,
    required: [true, 'Enter Course Code']
  },
  semester: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  ...courseSyllabus,
  ...generalCourseInfo,
  ...teachersTypesUg,
  ...courseRoundFields,
  ...courseMemoSpec,
  lastChangeDate: {
    type: String,
    default: ''
  },
  previousTextsList: {
    type: Array,
    default: []
  }
})

const CourseMemo = mongoose.model('CourseMemo', schema)
module.exports = {
  CourseMemo,
  schema
}
