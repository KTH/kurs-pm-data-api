'use strict'

const combinedMemoData = require('./combinedMemoData')
const { wrap } = require('@kth/kth-node-cosmos-db')
const mongoose = require('mongoose')

const schema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  courseCode: {
    type: String,
    trim: true,
    required: [true, 'Enter course code']
  },
  ladokRoundIds: {
    type: Array,
    items: String,
    trim: true,
    required: [true, 'Enter course rounds']
  },
  lastChangeDate: {
    type: String,
    default: new Date()
  },
  memoEndPoint: {
    type: String,
    trim: true,
    required: [true, 'Enter course memo endpoint to use for bookmark']
  },
  memoName: {
    type: String,
    trim: true,
    required: [true, 'Enter well readable memo name to use to describe which course offering included in course memo.']
  },
  semester: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  status: {
    type: String,
    default: 'draft'
  },
  version: {
    type: String,
    default: 1
  },
  ...combinedMemoData
})

const CourseMemo = wrap(mongoose.model('CourseMemo', schema))

module.exports = {
  CourseMemo,
  schema
}
