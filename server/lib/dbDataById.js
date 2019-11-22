/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const log = require('kth-node-log')
const { CourseMemo } = require('../models/courseMemoModel')

function fetchCourseMemoDataById(id) {
  if (!id) throw new Error('id must be set')
  log.debug('Fetching roundCourseMemoData by ID', { _id: id })
  return CourseMemo.findOne({ _id: id })
    .populate('MemoData')
    .lean()
}

function storeNewCourseMemoData(data) {
  if (!data) throw new Error('Trying to post empty/innacurate data in _storeNewCourseMemoData')
  else {
    log.debug('Create and store new roundCourseMemoData', { data })
    const doc = new CourseMemo(data)
    return doc.save()
  }
}

function updateCourseMemoDataById(data) {
  if (data) {
    log.debug('Update of existing roundCourseMemoData: ', { data })
    return CourseMemo.findOneAndUpdate({ _id: data._id }, { $set: data })
  }
  log.debug('No roundCourseMemoData found for updating it with new data', { data })
}

function removeCourseMemoDataById(id) {
  log.debug('deleted roundCourseMemoData by ID: ', { id })
  return CourseMemo.deleteOne({ _id: id })
}

module.exports = {
  fetchCourseMemoDataById,
  storeNewCourseMemoData,
  updateCourseMemoDataById,
  removeCourseMemoDataById
}
