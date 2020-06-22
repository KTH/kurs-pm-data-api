/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const log = require('kth-node-log')
const { CourseMemo } = require('../models/mainMemoModel')

/* ****** */
/* ANY BY STATUS AND MemoEndPoint */
/* ****** */
async function fetchMemoByEndPointAndStatus(memoEndPoint, status) {
  // UPDATED
  if (!memoEndPoint) throw new Error('memoEndPoint must be set')
  log.debug('Fetching memo based on ', { memoEndPoint, status })
  const memo = await CourseMemo.findOne({ memoEndPoint, status }) // courseCode
  return memo
}

/* ****** */
/* DRAFT */
/* ****** */
async function storeNewCourseMemoData(data) {
  // ***** USED TO POST NEW COURSE MEMO FIRST DRAFT
  if (!data) throw new Error('Trying to post empty/innacurate data in storeNewCourseMemoData')
  else {
    if (!data.courseCode || !data.semester || !data.ladokRoundIds)
      throw new Error('Trying to post data without courseCode or semester or ladokRoundsIds in storeNewCourseMemoData')
    data.lastChangeDate = new Date()
    const doc = new CourseMemo(data)
    log.debug('Create and store a new draft in form of roundCourseMemoData', { doc })
    const result = await doc.save()
    return result
  }
}

async function updateMemoByEndPointAndStatus(data, status) {
  // UPPDATERA DRAFT GENOM memoEndPoint
  const { memoEndPoint, courseCode } = data
  if (data) {
    log.debug('Update of existing memo or draft: ', { data })
    const resultAfterUpdate = CourseMemo.findOneAndUpdate({ memoEndPoint, status, courseCode }, { $set: data })
    return resultAfterUpdate
  }
  log.debug('No roundCourseMemoData found for updating it with new data', { data })
}

async function removeCourseMemoDataById(id, courseCode) {
  log.debug('deleted roundCourseMemoData by ID: ', { id })
  const deleted = await CourseMemo.deleteOne({ _id: id, courseCode })
  return deleted
}

module.exports = {
  fetchMemoByEndPointAndStatus,
  storeNewCourseMemoData,
  updateMemoByEndPointAndStatus,
  removeCourseMemoDataById
}
