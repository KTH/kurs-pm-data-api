/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */

'use strict'

const log = require('kth-node-log')
const dbOneDocument = require('../lib/dbDataById')
const dbArrayOfDocument = require('../lib/dbSeveralDocument')

async function getMemoByEndPoint(req, res) {
  // updated
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
  log.info('getDraftByEndPoint: Received request for memo with memoEndPoint:', memoEndPoint)
  try {
    const dbResponse = await dbOneDocument.fetchMemoByEndPointAndStatus(memoEndPoint, 'draft')
    res.json(dbResponse || {})
    log.info('getDraftByEndPoint: Responded to request for memo with memoEndPoint:', memoEndPoint)
  } catch (err) {
    log.error('getDraftByEndPoint: Failed request for memo, error:', { err })
    return err
  }
}

async function putDraftByEndPoint(req, res) {
  try {
    const memoObj = req.body
    const dbResponse = []

    const draftExist = await dbOneDocument.fetchMemoByEndPointAndStatus(memoObj.memoEndPoint, 'draft')

    memoObj.lastChangeDate = new Date()

    if (draftExist) {
      log.info('memo draft already exists,' + memoObj.memoEndPoint + ' update with object id ' + memoObj._id)
      dbResponse.push(await dbOneDocument.updateMemoByEndPointAndStatus(memoObj, 'draft'))
    } else {
      log.warning('no memo draft found ... ')
      // TODO: what should it show up
    }

    log.info('dbResponse', dbResponse)
    res.status(201).json(dbResponse)
  } catch (error) {
    log.error('Error in while trying to putDraftByEndPoint', { error })
    return error
  }
}

async function copyAndPostDraftByEndPoint(req, res) {
  try {
    const memoObj = req.body
    const dbResponse = []

    const draftExist = await dbOneDocument.fetchMemoByEndPointAndStatus(memoObj.memoEndPoint, 'draft')

    if (draftExist) {
      log.warning('memo draft already exists,' + memoObj.memoEndPoint + ' update with object id ' + memoObj._id)
      // dbResponse.push(await dbOneDocument.updateMemoByEndPointAndStatus(memoObj, 'draft'))
      // TODO: what should it show up
    } else {
      log.info('creating new memo draft' + memoObj + ' copied from previous published version')
      const publishedObj = await dbOneDocument.fetchMemoByEndPointAndStatus(memoObj.memoEndPoint, 'published')
      if (publishedObj) {
        publishedObj.version++
        dbResponse.push(await dbOneDocument.storeNewCourseMemoData(publishedObj))
      }
    }

    log.info('dbResponse', dbResponse)
    res.status(201).json(dbResponse)
  } catch (error) {
    log.error('Error in while trying to postDraftByEndPoint ', { error })
    return error
  }
}

async function getMemosByCourseCodeAndType(req, res) {
  const { courseCode, type } = req.params
  log.info('getMemosByCourseCodeAndType: Received request for memo for course:', courseCode)
  try {
    const dbResponse =
      type === 'all'
        ? await dbArrayOfDocument.getAllMemosByCourseCode(courseCode)
        : await dbArrayOfDocument.getAllMemosByStatus(courseCode, type)

    res.json(dbResponse || {})
    log.info('getMemoDraftsByCourseCode: Responded to request for memo:', dbResponse)
  } catch (err) {
    log.error('getMemoDraftsByCourseCode: Failed request for memo, error:', { err })
    return err
  }
}

async function postNewMemoFromScratch(req, res) {
  // ***** NEW - First version of document *****
  try {
    const memoObj = req.body
    const dbResponse = []
    log.info('saving absolutely new memo data' + memoObj)

    dbResponse.push(await dbOneDocument.storeNewCourseMemoData(memoObj))

    log.info('dbResponse', dbResponse)
    res.status(201).json(dbResponse)
  } catch (error) {
    log.error('Error in while trying to postNewMemo ', { error })
    return error
  }
}

module.exports = {
  getMemoByEndPoint,
  getMemosByCourseCodeAndType,
  postNewVersionOfPublishedMemo,
  postNewMemoFromScratch,
  getDraftByEndPoint,
  putDraftByEndPoint,
  copyAndPostDraftByEndPoint
}
