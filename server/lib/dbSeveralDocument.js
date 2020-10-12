/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const log = require('kth-node-log')
const { CourseMemo } = require('../models/mainMemoModel')
const { StoredMemoPdfsModel } = require('../models/storedMemoPdfsModel')

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

function getMemosBySemesterAndStatus(semester, status) {
  if (!semester) throw new Error('semester must be set')
  log.debug('Fetching all courseMemos for semester' + semester + ' by status ' + status)
  const doc = CourseMemo.aggregate([{ $match: { semester, status } }])
  return doc
}

async function getCourseSemesterUsedRounds(courseCode, semester) {
  // only used rounds -- no drafts
  if (!courseCode) throw new Error('courseCode must be set')
  try {
    log.debug('Fetching all web based courseMemos for ' + courseCode + ' for semester ' + semester)
    const webBasedMemos = await CourseMemo.aggregate([
      { $match: { courseCode, semester, $or: [{ status: 'draft' }, { status: 'published' }] } }
    ])
    log.debug('Fetched all web based courseMemos for ' + courseCode + ' for semester ' + semester)
    const dbMigratedPdfs = await StoredMemoPdfsModel.aggregate([{ $match: { courseCode, semester } }])
    log.debug('Fetched all stored as PDF courseMemos ', { dbMigratedPdfs })

    const finalObj = {
      usedRoundsThisSemester: []
    }
    await webBasedMemos.map(({ ladokRoundIds }) => finalObj.usedRoundsThisSemester.push(...ladokRoundIds))
    await dbMigratedPdfs.map(({ koppsRoundId }) => finalObj.usedRoundsThisSemester.push(...koppsRoundId))

    log.debug('Successfully got used round ids for', {
      courseCode,
      finalObj
    })
    return finalObj
  } catch (error) {
    return error
  }
}

async function getSortedMiniMemosForAllYears(courseCode, memoStatus = 'published') {
  const webBasedMemos = await CourseMemo.aggregate([{ $match: { courseCode, status: memoStatus } }])
  const publishedForAllYears = webBasedMemos.map(dbMemo => {
    const { _id: memoId, semester, status, ladokRoundIds, memoEndPoint, memoName, memoCommonLangAbbr, version } = dbMemo
    const miniMemo = {
      ladokRoundIds,
      memoCommonLangAbbr,
      memoId,
      memoEndPoint,
      memoName,
      semester,
      status,
      version
    }
    return miniMemo
  })
  return publishedForAllYears.sort((a, b) => Number(b.semester) - Number(a.semester))
}

async function getMemosFromPrevSemester(courseCode, fromSemester) {
  // getFromPrevSemesterAndAllPubl
  // From prev year semester
  // TODO: PREPARE FOR PAGE 'EDIT PUBLISHED'
  if (!courseCode) throw new Error('courseCode must be set')
  try {
    log.debug('Fetching all latest published courseMemos(which dont have an active draft) for ' + courseCode)
    const webBasedMemos = await CourseMemo.aggregate([
      { $match: { courseCode, semester: { $gte: fromSemester }, $or: [{ status: 'draft' }, { status: 'published' }] } }
    ])
    log.debug(
      'dbResponse after looking for drafts and published memos starting from prevYear and all published, number of items:',
      webBasedMemos.length
    )
    const _draftsAll = []
    const _publishedAll = []
    const finalObj = {
      sortedPublishedForAllYears: await getSortedMiniMemosForAllYears(courseCode),
      publishedWithNoActiveDraft: [], // PUBLISHED MEMOS WHICH DO NOT HAVE ACTIVE DRAFT VERSION
      draftsOfPublishedMemos: [], // PUBLISHED MEMOS WHICH DO HAVE ACTIVE DRAFT VERSION
      draftsWithNoActivePublishedVer: [] // From previous year
    }

    await webBasedMemos.map(({ status, memoEndPoint }) => {
      if (status === 'draft') _draftsAll.push(memoEndPoint)
      else if (status === 'published') _publishedAll.push(memoEndPoint)
    })

    await webBasedMemos.map(dbMemo => {
      const {
        _id: memoId,
        semester,
        status,
        ladokRoundIds,
        memoEndPoint,
        memoName,
        memoCommonLangAbbr,
        version
      } = dbMemo
      const miniMemo = {
        ladokRoundIds,
        memoCommonLangAbbr,
        memoId,
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
    })

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
  getMemosBySemesterAndStatus,
  getMemosFromPrevSemester
}
