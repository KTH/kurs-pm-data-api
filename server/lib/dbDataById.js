/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const log = require('@kth/log')
const { CourseMemo } = require('../models/mainMemoModel')
const { InvalidDataError } = require('../utils/errorUtils')

/* ****** */
/* ANY BY STATUS AND MemoEndPoint */
/* ****** */
async function fetchMemoByEndPointAndStatus(memoEndPoint, status) {
  if (!memoEndPoint) throw new Error('memoEndPoint must be set')
  log.debug('Fetching memo based on ', { memoEndPoint, status })
  const memo = await CourseMemo.findOne({ memoEndPoint, status }) // courseCode
  return memo
}

async function getMemoVersion(courseCode, memoEndPoint, version) {
  if (!courseCode) throw new Error('courseCode must be set')
  const matchingParameters = { courseCode, memoEndPoint, version }

  log.debug('Fetching memo current version and latest version ', matchingParameters)
  const memo = await CourseMemo.findOne({ courseCode, memoEndPoint, version })
  const latestMemo = await fetchMemoByEndPointAndStatus(memoEndPoint, 'published')
  if (memo && latestMemo) {
    log.debug('Done fetching memos total: ', memo.length, ', for: ', matchingParameters, { memo })
    const { version: publishedVersion, lastChangeDate, memoCommonLangAbbr } = latestMemo
    return { ...memo.toObject(), latestVersion: { publishedVersion, lastChangeDate, memoCommonLangAbbr } }
  }
}

/* ****** */
/* DRAFT */
/* ****** */
async function storeNewCourseMemoData(data) {
  // ***** USED TO POST NEW COURSE MEMO FIRST DRAFT
  if (!data) {
    const errorMessage = 'Trying to post empty/innacurate data in storeNewCourseMemoData'
    log.error(errorMessage, { data })
    throw new InvalidDataError(errorMessage)
  } else {
    if (!data.courseCode || !data.semester || !data.applicationCodes) {
      const errorMessage =
        'Trying to post data without courseCode, semester or applicationCodes in storeNewCourseMemoData'

      log.error(errorMessage, { data })
      throw new InvalidDataError(errorMessage)
    }
    data.lastChangeDate = new Date()
    const doc = new CourseMemo(data)
    log.debug('Create and store a new draft in form of roundCourseMemoData', { doc })
    const result = await doc.save()
    return result
  }
}

async function updateMemoByEndPointAndStatus(memoEndPoint, data, status) {
  // UPPDATERA DRAFT GENOM memoEndPoint
  if (!data) {
    const errorMessage = 'No roundCourseMemoData found for updating it with new data'
    log.debug(errorMessage, { data })
    throw new InvalidDataError(errorMessage, { data })
  } else {
    if (!data.courseCode || !data.semester || !data.applicationCodes) {
      const errorMessage =
        'Trying to post data without courseCode, semester or applicationCodes in updateMemoByEndPointAndStatus'
      log.error(errorMessage, { data })
      throw new InvalidDataError(errorMessage)
    }
    const { courseCode } = data
    log.debug('Update of existing memo or draft: ', { data })

    const resultAfterUpdate = await CourseMemo.findOneAndUpdate(
      { memoEndPoint, status, courseCode },
      { $set: data },
      { maxTimeMS: 100, new: true, useFindAndModify: false }
    )
    if (resultAfterUpdate && resultAfterUpdate.version) {
      log.debug('Updated draft: ', { version: resultAfterUpdate.version, memoEndPoint: resultAfterUpdate.memoEndPoint })
    }
    return resultAfterUpdate
  }
}

async function removeCourseMemoDataById(id, courseCode) {
  log.debug('deleted roundCourseMemoData by ID: ', { id })
  const deleted = await CourseMemo.deleteOne({ _id: id, courseCode })
  return deleted
}

module.exports = {
  getMemoVersion,
  fetchMemoByEndPointAndStatus,
  storeNewCourseMemoData,
  updateMemoByEndPointAndStatus,
  removeCourseMemoDataById,
}
