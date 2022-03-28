'use strict'

const combinedMemoData = require('./combinedMemoData')
const mongoose = require('mongoose')

const schema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  courseCode: {
    type: String,
    trim: true,
    required: [true, 'Enter course code'],
  },
  courseTitle: {
    type: String,
    trim: true,
    // required: [true, 'Enter course name']
  },
  departmentName: {
    type: String,
    trim: true,
  },
  ladokRoundIds: {
    type: Array,
    items: String,
    trim: true,
    required: [true, 'Enter course rounds'],
  },
  lastChangeDate: {
    type: String,
    default: new Date(),
  },
  lastPublishedVersionPublishDate: {
    type: String,
  },
  memoCommonLangAbbr: {
    type: String,
    trim: true,
    minlength: 0,
    default: '',
  },
  memoEndPoint: {
    type: String,
    trim: true,
    required: [true, 'Enter course memo endpoint to use for bookmark'],
  },
  memoName: {
    type: String,
    trim: true,
    required: [
      false,
      'Enter well readable memo name to use to describe which course offering included in course memo.',
    ],
  },
  semester: {
    type: String,
    trim: true,
    minlength: 0,
    default: '',
  },
  status: {
    type: String,
    default: 'draft',
  },
  syllabusValid: {
    type: Object,
    default: {
      validFromTerm: '',
      validUntilTerm: '',
      textFromTo: '',
    },
  },
  version: {
    type: Number,
    default: 1,
  },
  ...combinedMemoData,
})

const CourseMemo = mongoose.model('CourseMemo', schema)

module.exports = {
  CourseMemo,
  schema,
}
