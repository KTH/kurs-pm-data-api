/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const log = require('kth-node-log')
const { CourseMemo } = require('../models/mainMemoModel')

/* ****** */
/* ANY BY STATUS AND MemoEndPoint */
/* ****** */
function fetchMemoByEndPointAndStatus(memoEndPoint, status) {
  // UPDATED
  if (!memoEndPoint) throw new Error('memoEndPoint must be set')
  log.debug('Fetching memo based on ', { memoEndPoint, status })
  return CourseMemo.findOne({ memoEndPoint, status }) // courseCode
}

/* ****** */
/* DRAFT */
/* ****** */
function storeNewCourseMemoData(data) {
  // ***** USED TO POST NEW COURSE MEMO FIRST DRAFT
  if (!data) throw new Error('Trying to post empty/innacurate data in storeNewCourseMemoData')
  else {
    data.lastChangeDate = new Date()
    const doc = new CourseMemo(data)
    log.debug('Create and store new FIRST draft in form of roundCourseMemoData', { doc })

    return doc.save()
  }
}

function updateMemoByEndPointAndStatus(data, status) {
  // UPPDATERA DRAFT GENOM memoEndPoint
  const { memoEndPoint, courseCode } = data
  if (data) {
    log.debug('Update of existing memo or draft: ', { data })
    return CourseMemo.findOneAndUpdate({ memoEndPoint, status, courseCode }, { $set: data })
  }
  log.debug('No roundCourseMemoData found for updating it with new data', { data })
}

function removeCourseMemoDataById(id, courseCode) {
  log.debug('deleted roundCourseMemoData by ID: ', { id })
  return CourseMemo.deleteOne({ _id: id, courseCode })
}

module.exports = {
  fetchMemoByEndPointAndStatus,
  storeNewCourseMemoData,
  updateMemoByEndPointAndStatus,
  removeCourseMemoDataById
}
