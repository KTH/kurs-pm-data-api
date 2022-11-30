/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */

'use strict'

const log = require('@kth/log')
const dbOneDocument = require('../lib/dbDataById')
const dbArrayOfDocument = require('../lib/dbSeveralDocument')

async function getMemoVersion(req, res) {
  const { courseCode, memoEndPoint, version } = req.params
  const params = { courseCode, memoEndPoint, version }
  log.info('getMemoVersion: Received request for:', { params })
  try {
    const dbResponse = await dbOneDocument.getMemoVersion(courseCode, memoEndPoint, version)
    res.json(dbResponse || {})
    log.info('getMemoVersion: Responded to request for:', { params })
  } catch (err) {
    log.error('getMemoVersion: Failed request for memo, error:', { err }, { params })
    return err
  }
}

async function getPublishedMemoByEndPoint(req, res) {
  const { memoEndPoint } = req.params
  log.info('getPublishedMemoByEndPoint: Received request for memo with memoEndPoint:', memoEndPoint)
  try {
    const dbResponse = await dbOneDocument.fetchMemoByEndPointAndStatus(memoEndPoint, 'published')
    res.json(dbResponse || {})
    log.info('getPublishedMemoByEndPoint: Responded to request for memo with memoEndPoint:', memoEndPoint)
  } catch (err) {
    log.error('getPublishedMemoByEndPoint: Failed request for memo, error:', { err })
    return err
  }
}

async function postNewVersionOfPublishedMemo(req, res) {
  // publishNewMemo , publishNewMemoOfPPUblishedMemo
  const { memoEndPoint } = req.params
  try {
    const memoObj = req.body
    const dbResponse = []
    log.info('saving absolutely new memo data' + memoObj)

    const publishedObj = await dbOneDocument.fetchMemoByEndPointAndStatus(memoEndPoint, 'published')
    if (publishedObj) {
      publishedObj.status = 'old'
      dbResponse.push(await dbOneDocument.updateMemoByEndPointAndStatus(memoEndPoint, publishedObj, 'published'))
    }
    memoObj.lastChangeDate = new Date()
    memoObj.status = 'published'
    dbResponse.push(await dbOneDocument.updateMemoByEndPointAndStatus(memoEndPoint, memoObj, 'draft'))

    log.info('dbResponse length', dbResponse.length, { memoEndPoint })
    res.status(201).json(dbResponse)
  } catch (error) {
    log.error('Error in while trying to postNewMemo ', { error })
    return error
  }
}

async function getDraftByEndPoint(req, res) {
  // updated
  const { memoEndPoint } = req.params
  log.info('getDraftByEndPoint: Received request for draft with memoEndPoint:', memoEndPoint)
  try {
    const dbResponse = await dbOneDocument.fetchMemoByEndPointAndStatus(memoEndPoint, 'draft')
    res.json(dbResponse || {})
    log.info('getDraftByEndPoint: Responded to request for memo draft with memoEndPoint:', memoEndPoint)
  } catch (err) {
    log.error('getDraftByEndPoint: Failed request for memo, error:', { err })
    return err
  }
}

async function putDraftByEndPoint(req, res) {
  // STEP 2 EDITING: USE IT IN A SECOND STEP
  try {
    const memoObj = req.body
    const { memoEndPoint } = req.params

    const dbResponse = []

    const draftExist = await dbOneDocument.fetchMemoByEndPointAndStatus(memoEndPoint, 'draft')

    memoObj.lastChangeDate = new Date()

    if (draftExist) {
      log.info(
        'memo draft already exists,' + memoEndPoint + ' so it will be updated (object id ' + draftExist._id + ')'
      )
      dbResponse.push(await dbOneDocument.updateMemoByEndPointAndStatus(memoEndPoint, memoObj, 'draft'))
    } else {
      log.debug('no memo draft was found to update with memoEndPoint: ', memoEndPoint)
    }

    log.info('dbResponse length', dbResponse.length, { memoEndPoint })
    res.status(201).json(dbResponse)
  } catch (error) {
    log.error('Error in while trying to putDraftByEndPoint', { error })
    return error
  }
}

async function createDraftByMemoEndPoint(req, res) {
  // STEP 1 CHOSING ACTION TO COPY, NEW MEMO, NEV VERSION: USE IT IN A SECOND STEP
  try {
    const { memoEndPoint, anotherMemoEndPoint } = req.params
    const newMemoObj = req.body

    const dbResponse = []
    // Check if memo draft is already created
    const draftExist = await dbOneDocument.fetchMemoByEndPointAndStatus(memoEndPoint, 'draft')

    if (draftExist) {
      log.info(
        'just continue to the next step because, memo draft already exists,' +
          draftExist.memoEndPoint +
          ' with object id ' +
          draftExist._id
      )
      // TODO: SHOULD IT TO BE USED WHEN UPDATES COURSE ROUNDS?
    } else {
      log.warn('creating new memo draft ' + memoEndPoint)
      const isToCopyFrom = (anotherMemoEndPoint && anotherMemoEndPoint !== memoEndPoint) || false
      let publishedObj = await dbOneDocument.fetchMemoByEndPointAndStatus(
        isToCopyFrom ? anotherMemoEndPoint : memoEndPoint,
        'published'
      )

      if (publishedObj) {
        log.info(
          `${
            isToCopyFrom
              ? 'copy previosly published memo by creating a draft for another memo with memoEndPoint ' +
                anotherMemoEndPoint +
                'for '
              : 'create a new version of the previously published version with the same memoEndPoint into a new memo draft '
          }` + memoEndPoint
        )
        // copy published memo to new object with updated version and draft status
        publishedObj = {
          ...publishedObj.toObject(),
          ...{
            _id: undefined,
            status: 'draft',
            commentAboutMadeChanges: '',
            lastPublishedVersionPublishDate: isToCopyFrom ? '' : publishedObj.lastChangeDate,
            version: isToCopyFrom ? 1 : Number(publishedObj.version) + 1,
          },
          ...newMemoObj,
        }

        dbResponse.push(await dbOneDocument.storeNewCourseMemoData(publishedObj))
      } else {
        // create new draft from scratch

        log.info(
          'no published or draft version for this memoEndPoint ' +
            memoEndPoint +
            ' was found so new draft from scratch will be made'
        )
        dbResponse.push(await dbOneDocument.storeNewCourseMemoData(newMemoObj))
      }
    }

    log.info('dbResponse length', dbResponse.length, { memoEndPoint })
    res.status(201).json(dbResponse)
  } catch (error) {
    log.error('Error in while trying to createDraftByMemoEndPoint ', { error })
    return error
  }
}

async function getAllMemosByCourseCodeAndType(req, res) {
  // TODO: ADD FETCHING USED COURSE ROUNDS (DRAFTS + PUBLISHED)
  const { courseCode, type } = req.params
  log.info('getAllMemosByCourseCodeAndType: Received request for memo for course:', { courseCode, type })
  try {
    const dbResponse = await dbArrayOfDocument.getAllMemosByStatus(courseCode, type)

    res.json(dbResponse || [])
    log.info('getAllMemosByCourseCodeAndType: Responded to request for memo:', { courseCode, type })
  } catch (err) {
    log.error('getAllMemosByCourseCodeAndType: Failed request for memo, error:', { err })
    return err
  }
}

async function getCourseSemesterUsedRounds(req, res) {
  // TODO: ADD FETCHING USED COURSE ROUNDS (DRAFTS + PUBLISHED)
  const { courseCode, semester } = req.params
  log.info('getCourseSemesterUsedRounds: Received request for used rounds of memo for :', { courseCode, semester })
  try {
    const dbResponse = await dbArrayOfDocument.getCourseSemesterUsedRounds(courseCode, semester)

    res.json(dbResponse || {})
    log.info('getCourseSemesterUsedRounds: Responded to request for memo:', { courseCode, semester })
  } catch (err) {
    log.error('getCourseSemesterUsedRounds: Failed request for memo, error:', { err })
    return err
  }
}
const _prevTermNumber = () => {
  const SPRING = 1
  const FALL = 2
  const today = new Date()
  const prevYear = today.getFullYear() - 1
  const currentMonth = today.getMonth()
  const currentSemester = currentMonth < 7 ? SPRING : FALL
  return `${prevYear}${currentSemester}`
}
async function getMemosStartingFromPrevSemester(req, res) {
  // TODO: ADD FETCHING USED COURSE ROUNDS (DRAFTS + PUBLISHED)
  const { courseCode, semester } = req.params
  const prevYearSemester = !semester ? _prevTermNumber() : semester

  log.info('getMemosStartingFromPrevSemester: Received request for existing memos for :', {
    courseCode,
    prevYearSemester,
  })
  try {
    const dbResponse = await dbArrayOfDocument.getMemosFromPrevSemester(courseCode, prevYearSemester)

    res.json(dbResponse || {})
    log.info('getMemosStartingFromPrevSemester: Responded to request for memo:', { courseCode })
  } catch (err) {
    log.error('getMemosStartingFromPrevSemester: Failed request for memo, error:', { err })
    return err
  }
}

async function deleteDraftByMemoEndPoint(req, res) {
  try {
    const { memoEndPoint } = req.params
    const draftExist = await dbOneDocument.fetchMemoByEndPointAndStatus(memoEndPoint, 'draft')
    let dbResponse = {}
    if (draftExist) {
      const id = draftExist._id
      const { courseCode } = draftExist
      log.info('Hard delete draft by id:', { id })

      dbResponse = await dbOneDocument.removeCourseMemoDataById(id, courseCode)

      log.info('Successfully removed draft by id and memoEndPoint: ', { id, memoEndPoint })
    } else {
      log.info('Deleting of memo draft ', { memoEndPoint }, ' is not possible, because it is not exist in db')
    }
    res.json(dbResponse)
  } catch (error) {
    log.error('Error in deleteMemoDataById', { error })
    return error
  }
}

module.exports = {
  getMemoVersion,
  createDraftByMemoEndPoint,
  getDraftByEndPoint,
  getPublishedMemoByEndPoint,
  getAllMemosByCourseCodeAndType,
  getMemosStartingFromPrevSemester,
  getCourseSemesterUsedRounds,
  deleteDraftByMemoEndPoint,
  postNewVersionOfPublishedMemo,
  putDraftByEndPoint,
}
