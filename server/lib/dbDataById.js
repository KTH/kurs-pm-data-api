/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const log = require('@kth/log')
const { CourseMemo } = require('../models/mainMemoModel')

/* ****** */
/* ANY BY STATUS AND MemoEndPoint */
/* ****** */
async function fetchMemoByEndPointAndStatus(memoEndPoint, status) {
  if (!memoEndPoint) throw new Error('memoEndPoint must be set')
  log.debug('Fetching memo based on ', { memoEndPoint, status })
  const memo = await CourseMemo.findOne({ memoEndPoint, status }) // courseCode
  return memo
}
// No need to merge this method to master. This is only for updating old memos
async function fetchMemoByMemoEndpointMemoNameAndStatusCourseCodeAndSemesterAndVersion(
  memoName,
  memoEndPoint,
  courseCode,
  semester,
  status,
  version
) {
  if (!memoEndPoint && !courseCode && !semester && !status && !version)
    throw new Error('MemoEndPoint, courseCode, status, semester and version  must be set')
  log.debug('Fetching memo based on ', { memoEndPoint, courseCode, semester, memoName, status })
  const memo = await CourseMemo.findOne(
    memoName
      ? { memoName, version, memoEndPoint, courseCode, semester, status }
      : { version, memoEndPoint, courseCode, semester, status }
  )
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
  if (!data) throw new Error('Trying to post empty/innacurate data in storeNewCourseMemoData')
  else {
    if (!data.courseCode || !data.semester || !data.applicationCodes)
      throw new Error('Trying to post data without courseCode or semester or ladokRoundsIds in storeNewCourseMemoData')
    data.lastChangeDate = new Date()
    const doc = new CourseMemo(data)
    log.debug('Create and store a new draft in form of roundCourseMemoData', { doc })
    const result = await doc.save()
    return result
  }
}
// No need to merge this method to master. This is only for updating old memos
async function updateMemoByMemoEndPointAndMemoNameAndStatusAndCourseCodeAndSemesterAndVersion(
  memoName,
  memoEndPoint,
  courseCode,
  semester,
  status,
  version,
  data
) {
  // UPPDATERA DRAFT GENOM memoEndPoint
  if (data) {
    log.debug('Update of existing memo: ', { data })

    const resultAfterUpdate = await CourseMemo.findOneAndUpdate(
      memoName
        ? { memoEndPoint, courseCode, semester, memoName, status, version }
        : { memoEndPoint, courseCode, semester, status, version },
      { $set: data },
      { maxTimeMS: 100, new: true, useFindAndModify: false }
    )
    if (resultAfterUpdate && resultAfterUpdate.version) {
      log.debug('Updated draft: ', {
        version: resultAfterUpdate.version,
        memoEndPoint: resultAfterUpdate.memoEndPoint,
        memoName: resultAfterUpdate.memoName,
        id: resultAfterUpdate.id,
        applicationCodes: resultAfterUpdate.applicationCodes,
      })
    }
    return resultAfterUpdate
  }
  log.debug('No roundCourseMemoData found for updating it with new data', { data })
}

async function updateMemoByEndPointAndStatus(memoEndPoint, data, status) {
  // UPPDATERA DRAFT GENOM memoEndPoint
  const { courseCode } = data
  if (data) {
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
  log.debug('No roundCourseMemoData found for updating it with new data', { data })
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
  updateMemoByMemoEndPointAndMemoNameAndStatusAndCourseCodeAndSemesterAndVersion,
  updateMemoByEndPointAndStatus,
  removeCourseMemoDataById,
  fetchMemoByMemoEndpointMemoNameAndStatusCourseCodeAndSemesterAndVersion,
}
