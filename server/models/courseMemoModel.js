'use strict'

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
  koppsGoals: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  betygskriterier: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
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
