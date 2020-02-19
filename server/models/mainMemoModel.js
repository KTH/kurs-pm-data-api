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
  memo: combinedMemoData,
  memoEndPoint: {
    type: String,
    trim: true,
    required: [true, 'Enter course memo endpoint to use for bookmark']
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
  }
})

const CourseMemo = wrap(mongoose.model('CourseMemo', schema))

module.exports = {
  CourseMemo,
  schema
}
