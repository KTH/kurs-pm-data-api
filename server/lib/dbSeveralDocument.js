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
    const dbResponse = await CourseMemo.aggregate([
      { $match: { courseCode, semester, $or: [{ status: 'draft' }, { status: 'published' }] } }
    ])
    // const dbResponse = await db.fetchAllRoundAnalysisByCourseCodeAndSemester(courseCode.toUpperCase(), semester)
    const returnObject = {
      usedRounds: [],
      publishedMemos: [],
      draftMemos: []
    }

    let tempObject = {}
    for (let index = 0; index < dbResponse.length; index++) {
      tempObject = {
        // user: dbResponse[index].changedBy,
        status: dbResponse[index].status,
        memoId: dbResponse[index]._id,
        memoEndPoint: dbResponse[index].memoEndPoint,
        ladokRoundIds: dbResponse[index].ladokRoundIds
        // ugKeys: dbResponse[index].ugKeys
      }
      if (tempObject.status === 'published') {
        returnObject.publishedMemos.push(tempObject)
      } else if (tempObject.status === 'draft') {
        returnObject.draftMemos.push(tempObject)
      }
      returnObject.usedRounds.push(...dbResponse[index].ladokRoundIds)
    }
    log.debug('Successfully got used round ids for', {
      courseCode
    })
    return returnObject
  } catch (error) {
    return error
  }
}

module.exports = {
  getAllMemosByCourseCode,
  getAllMemosByStatus,
  getLatestUsedRounds
}
