/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const log = require('kth-node-log')
const { CourseMemo } = require('../models/mainMemoModel')

function getAllMemosByCourseCode(courseCode) {
  if (!courseCode) throw new Error('courseCode must be set')
  log.debug('Fetching all courseMemos for ' + courseCode)
  const doc = CourseMemo.aggregate([{ $match: { courseCode } }])
  return doc
}

function getAllMemosByStatus(courseCode, status) {
  if (!courseCode) throw new Error('courseCode must be set')
  log.debug('Fetching all courseMemos for ' + courseCode)
  const doc = CourseMemo.aggregate([{ $match: { courseCode, status } }])
  return doc
}

async function getLatestUsedRounds(courseCode, semester) {
  if (!courseCode) throw new Error('courseCode must be set')
  try {
    log.debug('Fetching all courseMemos for ' + courseCode)
    // const doc = CourseMemo.aggregate([{ $match: { courseCode, status: { $or: ['published', 'draft'] } } }])
    // const dbResponse = await CourseMemo.aggregate([{ $match: { courseCode, semester, status: 'draft' } }])
    const _dbResponse = await CourseMemo.aggregate([
      { $match: { courseCode, semester, $or: [{ status: 'draft' }, { status: 'published' }] } }
    ])
    const _draftsForFilter = []
    const _unFilteredPublished = []
    const finalObj = {
      usedRounds: [],
      publishedMemos: [], // PUBLISHED MEMOS WHICH DO NOT HAVE ACTIVE DRAFT VERSION
      draftMemos: []
    }

    for (let index = 0; index < _dbResponse.length; index++) {
      const { status, ladokRoundIds, memoEndPoint } = _dbResponse[index]
      const miniObj = {
        status,
        memoId: _dbResponse[index]._id,
        memoEndPoint,
        ladokRoundIds
      }
      if (status === 'published') {
        _unFilteredPublished.push(miniObj)
      } else if (status === 'draft') {
        _draftsForFilter.push(memoEndPoint)
        finalObj.draftMemos.push(miniObj)
      }
      finalObj.usedRounds.push(...ladokRoundIds)
    }
    finalObj.publishedMemos = _unFilteredPublished.filter(
      ({ memoEndPoint }) => !_draftsForFilter.includes(memoEndPoint)
    )
    log.debug('Successfully got used round ids for', {
      courseCode
    })
    return finalObj
  } catch (error) {
    return error
  }
}

module.exports = {
  getAllMemosByCourseCode,
  getAllMemosByStatus,
  getLatestUsedRounds
}
