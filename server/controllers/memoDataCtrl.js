/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */

'use strict'

const log = require('kth-node-log')
const dbOneDocument = require('../lib/dbDataById')
const dbArrayOfDocument = require('../lib/dbSeveralDocument')

async function getMemoByEndPoint(req, res) {
  const { memoEndPoint } = req.params
  log.info('getMemoByEndPoint: Received request for memo with memoEndPoint:', memoEndPoint)
  try {
    const dbResponse = await dbOneDocument.fetchMemoByEndPointAndStatus(memoEndPoint, 'published')
    res.json(dbResponse || {})
    log.info('getMemoByEndPoint: Responded to request for memo with memoEndPoint:', memoEndPoint)
  } catch (err) {
    log.error('getMemoByEndPoint: Failed request for memo, error:', { err })
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
      dbResponse.push(await dbOneDocument.updateMemoByEndPointAndStatus(publishedObj, 'published'))
    }
    memoObj.lastChangeDate = new Date()
    memoObj.status = 'published'
    dbResponse.push(await dbOneDocument.updateMemoByEndPointAndStatus(memoObj, 'draft'))

    log.info('dbResponse', dbResponse)
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
    const dbResponse = []

    const draftExist = await dbOneDocument.fetchMemoByEndPointAndStatus(memoObj.memoEndPoint, 'draft')

    memoObj.lastChangeDate = new Date()

    if (draftExist) {
      log.info('memo draft already exists,' + memoObj.memoEndPoint + ' update with object id ' + memoObj._id)
      dbResponse.push(await dbOneDocument.updateMemoByEndPointAndStatus(memoObj, 'draft'))
    } else {
      log.debug('no memo draft was found ... ')
      // TODO: what should it show up
    }

    log.info('dbResponse', dbResponse)
    res.status(201).json(dbResponse)
  } catch (error) {
    log.error('Error in while trying to putDraftByEndPoint', { error })
    return error
  }
}

async function createDraftByMemoEndPoint(req, res) {
  // STEP 1 CHOSING ACTION TO COPY, NEW MEMO, NEV VERSION: USE IT IN A SECOND STEP
  try {
    const { memoEndPoint } = req.params
    const dbResponse = []

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
      log.info('creating new memo draft ' + memoEndPoint + ' copied from previous published version')
      const publishedObj = await dbOneDocument.fetchMemoByEndPointAndStatus(memoEndPoint, 'published')
      if (publishedObj) {
        // copy published memo to new object with updated version and draft status
        publishedObj.status = 'draft'
        publishedObj.version++
        publishedObj._id = undefined
        dbResponse.push(await dbOneDocument.storeNewCourseMemoData(publishedObj.toObject()))
      } else {
        // create new draft from anything
        const newMemoObj = req.body

        log.info(
          'no published or draft version for this memoEndPoint ' +
            memoEndPoint +
            ' was found so new draft from scratch will be made'
        )
        dbResponse.push(await dbOneDocument.storeNewCourseMemoData(newMemoObj))
      }
    }

    log.info('dbResponse', dbResponse)
    res.status(201).json(dbResponse)
  } catch (error) {
    log.error('Error in while trying to createDraftByMemoEndPoint ', { error })
    return error
  }
}

async function getMemosByCourseCodeAndType(req, res) {
  // TODO: ADD FETCHING USED COURSE ROUNDS (DRAFTS + PUBLISHED)
  const { courseCode, type } = req.params
  log.info('getMemosByCourseCodeAndType: Received request for memo for course:', courseCode)
  try {
    const dbResponse = await dbArrayOfDocument.getAllMemosByStatus(courseCode, type)

    res.json(dbResponse || {})
    log.info('getMemosByCourseCodeAndType: Responded to request for memo:', dbResponse)
  } catch (err) {
    log.error('getMemosByCourseCodeAndType: Failed request for memo, error:', { err })
    return err
  }
}

async function getUsedRounds(req, res) {
  // TODO: ADD FETCHING USED COURSE ROUNDS (DRAFTS + PUBLISHED)
  const { courseCode, semester } = req.params
  log.info('getUsedRounds: Received request for memo for course:', courseCode)
  try {
    const dbResponse = await dbArrayOfDocument.getLatestUsedRounds(courseCode, semester)

    res.json(dbResponse || {})
    log.info('getUsedRounds: Responded to request for memo:', dbResponse)
  } catch (err) {
    log.error('getUsedRounds: Failed request for memo, error:', { err })
    return err
  }
}

module.exports = {
  getMemoByEndPoint,
  getMemosByCourseCodeAndType,
  getUsedRounds,
  postNewVersionOfPublishedMemo,
  getDraftByEndPoint,
  putDraftByEndPoint,
  createDraftByMemoEndPoint
}
