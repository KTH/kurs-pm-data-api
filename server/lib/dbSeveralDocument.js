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
  log.debug('Fetching all courseMemos for ' + courseCode + ' by status ' + status)
  const doc = CourseMemo.aggregate([{ $match: { courseCode, status } }])
  return doc
}

async function getCourseSemesterUsedRounds(courseCode, semester) {
  // only used rounds -- no drafts
  if (!courseCode) throw new Error('courseCode must be set')
  try {
    log.debug('Fetching all courseMemos for ' + courseCode + ' for semester ' + semester)
    const _dbResponse = await CourseMemo.aggregate([
      { $match: { courseCode, semester, $or: [{ status: 'draft' }, { status: 'published' }] } }
    ])
    const finalObj = {
      usedRoundsThisSemester: []
    }
    for (let index = 0; index < _dbResponse.length; index++) {
      const { ladokRoundIds } = _dbResponse[index]
      finalObj.usedRoundsThisSemester.push(...ladokRoundIds)
    }

    log.debug('Successfully got used round ids for', {
      courseCode
    })
    return finalObj
  } catch (error) {
    return error
  }
}

async function getMemosFromPrevSemester(courseCode, fromSemester) {
  // From prev year semester
  // TODO: PREPARE FOR PAGE 'EDIT PUBLISHED'
  if (!courseCode) throw new Error('courseCode must be set')
  try {
    log.debug('Fetching all latest published courseMemos(which dont have an active draft) for ' + courseCode)
    const _dbResponse = await CourseMemo.aggregate([
      { $match: { courseCode, semester: { $gte: fromSemester }, $or: [{ status: 'draft' }, { status: 'published' }] } }
    ])
    log.info('nuuuuuuuuu', _dbResponse)
    const _draftsForFilter = []
    const _unFilteredPublished = []
    const finalObj = {
      publishedMemos: [], // PUBLISHED MEMOS WHICH DO NOT HAVE ACTIVE DRAFT VERSION
      draftMemos: [] // From previous year
    }

    for (let index = 0; index < _dbResponse.length; index++) {
      const { status, ladokRoundIds, memoEndPoint, memoName } = _dbResponse[index]
      const miniObj = {
        status,
        memoId: _dbResponse[index]._id,
        memoEndPoint,
        memoName,
        ladokRoundIds
      }
      if (status === 'published') {
        _unFilteredPublished.push(miniObj)
      } else if (status === 'draft') {
        _draftsForFilter.push(memoEndPoint)
        finalObj.draftMemos.push(miniObj)
      }
      // finalObj.usedRoundsThisSemester.push(...ladokRoundIds)
    }
    finalObj.publishedMemos = _unFilteredPublished.filter(
      ({ memoEndPoint }) => !_draftsForFilter.includes(memoEndPoint)
    )
    log.debug('Successfully got all memos starting from previous year semester ', {
      courseCode,
      fromSemester
    })
    return finalObj
  } catch (error) {
    return error
  }
}

module.exports = {
  getAllMemosByCourseCode,
  getAllMemosByStatus,
  getCourseSemesterUsedRounds,
  getMemosFromPrevSemester
}
