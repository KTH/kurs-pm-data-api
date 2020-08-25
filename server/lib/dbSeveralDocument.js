/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const log = require('kth-node-log')
const { CourseMemo } = require('../models/mainMemoModel')
const { StoredMemoPdfs } = require('../models/storedMemoPdfs')

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
    const _dbMigratedPdfs = await StoredMemoPdfs.aggregate([{ $match: { courseCode, semester } }])
    log.debug('-----> _dbResponsePdf', { _dbMigratedPdfs })
    const finalObj = {
      usedRoundsThisSemester: []
    }
    for (let index = 0; index < _dbResponse.length; index++) {
      const { ladokRoundIds } = _dbResponse[index]
      finalObj.usedRoundsThisSemester.push(...ladokRoundIds)
    }
    for (let index = 0; index < _dbMigratedPdfs.length; index++) {
      const { koppsRoundId } = _dbMigratedPdfs[index]
      finalObj.usedRoundsThisSemester.push(...koppsRoundId)
    }

    log.debug('Successfully got used round ids for', {
      courseCode
    })
    return finalObj
  } catch (error) {
    return error
  }
}

async function getSortedMiniMemosForAllYears(courseCode, memoStatus = 'published') {
  const _dbResponse = await CourseMemo.aggregate([{ $match: { courseCode, status: memoStatus } }])
  const publishedForAllYears = []
  for (let index = 0; index < _dbResponse.length; index++) {
    const { semester, status, ladokRoundIds, memoEndPoint, memoName, memoCommonLangAbbr, version } = _dbResponse[index]
    const miniMemo = {
      ladokRoundIds,
      memoCommonLangAbbr,
      memoId: _dbResponse[index]._id,
      memoEndPoint,
      memoName,
      semester,
      status,
      version
    }
    publishedForAllYears.push(miniMemo)
  }
  return publishedForAllYears.sort((a, b) => Number(b.semester) - Number(a.semester))
}

async function getMemosFromPrevSemester(courseCode, fromSemester) {
  // getFromPrevSemesterAndAllPubl
  // From prev year semester
  // TODO: PREPARE FOR PAGE 'EDIT PUBLISHED'
  if (!courseCode) throw new Error('courseCode must be set')
  try {
    log.debug('Fetching all latest published courseMemos(which dont have an active draft) for ' + courseCode)
    const _dbResponse = await CourseMemo.aggregate([
      { $match: { courseCode, semester: { $gte: fromSemester }, $or: [{ status: 'draft' }, { status: 'published' }] } }
    ])
    log.debug(
      'dbResponse after looking for drafts and published memos starting from prevYear and all published, number of items:',
      _dbResponse.length
    )
    const _draftsAll = []
    const _publishedAll = []
    const finalObj = {
      sortedPublishedForAllYears: await getSortedMiniMemosForAllYears(courseCode),
      publishedWithNoActiveDraft: [], // PUBLISHED MEMOS WHICH DO NOT HAVE ACTIVE DRAFT VERSION
      draftsOfPublishedMemos: [], // PUBLISHED MEMOS WHICH DO HAVE ACTIVE DRAFT VERSION
      draftsWithNoActivePublishedVer: [] // From previous year
    }

    _dbResponse.map(({ status, memoEndPoint }) => {
      if (status === 'draft') _draftsAll.push(memoEndPoint)
      else if (status === 'published') _publishedAll.push(memoEndPoint)
    })

    for (let index = 0; index < _dbResponse.length; index++) {
      const { semester, status, ladokRoundIds, memoEndPoint, memoName, memoCommonLangAbbr, version } = _dbResponse[
        index
      ]
      const miniMemo = {
        ladokRoundIds,
        memoCommonLangAbbr,
        memoId: _dbResponse[index]._id,
        memoEndPoint,
        memoName,
        semester,
        status,
        version
      } // 1 published
      if (status === 'published' && !_draftsAll.includes(memoEndPoint))
        finalObj.publishedWithNoActiveDraft.push(miniMemo)
      else if (status === 'draft' && !_publishedAll.includes(memoEndPoint))
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
