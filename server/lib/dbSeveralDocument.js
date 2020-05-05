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
    log.info('dbResponse after looking for drafts and published memos starting from prevYear', _dbResponse)
    const _allDrafts = []
    const _allPublished = []
    const finalObj = {
      publishedMemos: [], // PUBLISHED MEMOS WHICH DO NOT HAVE ACTIVE DRAFT VERSION
      draftsOfPublishedMemos: [], // PUBLISHED MEMOS WHICH DO HAVE ACTIVE DRAFT VERSION
      draftsWithNoActivePublishedVer: [] // From previous year
    }

    _dbResponse.map(({ status, memoEndPoint }) => {
      if (status === 'draft') _allDrafts.push(memoEndPoint)
      else if (status === 'published') _allPublished.push(memoEndPoint)
    })

    for (let index = 0; index < _dbResponse.length; index++) {
      const { semester, status, ladokRoundIds, memoEndPoint, memoName } = _dbResponse[index]
      const miniMemo = {
        semester,
        status,
        memoId: _dbResponse[index]._id,
        memoEndPoint,
        memoName,
        ladokRoundIds
      } // 1 published
      if (status === 'published' && !_allDrafts.includes(memoEndPoint)) finalObj.publishedMemos.push(miniMemo)
      else if (status === 'draft' && !_allPublished.includes(memoEndPoint))
        finalObj.draftsWithNoActivePublishedVer.push(miniMemo)
      else if (status === 'draft') finalObj.draftsOfPublishedMemos.push(miniMemo)
    }
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
