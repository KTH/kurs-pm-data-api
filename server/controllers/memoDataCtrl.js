/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */

'use strict'

const log = require('kth-node-log')
const dbOneDocument = require('../lib/dbDataById')

async function getMemoDataById(req, res) {
  const { id } = req.params
  log.info('getMemoDataById: Received request for memo with id:', id)
  try {
    const dbResponse = await dbOneDocument.fetchCourseMemoDataById(id)
    res.json(dbResponse || {})
    log.info('getMemoDataById: Responded to request for memo with id:', id)
  } catch (err) {
    log.error('getMemoDataById: Failed request for memo, error:', { err })
    return err
  }
}

async function postMemoData(req, res) {
  try {
    const memoObj = req.body
    const dbResponse = []

    const exist = await dbOneDocument.fetchCourseMemoDataById(memoObj._id)

    memoObj.lastChangeDate = new Date()

    if (exist) {
      log.info('roundCourseMemoData already exists, update' + memoObj._id)
      dbResponse.push(await dbOneDocument.updateCourseMemoDataById(memoObj))
    } else {
      log.info('saving new memo data' + memoObj._id)
      dbResponse.push(await dbOneDocument.storeNewCourseMemoData(memoObj))
    }

    log.info('dbResponse', dbResponse)
    res.status(201).json(dbResponse)
  } catch (error) {
    log.error('Error in while trying to _posttDataById (postdocanization)', { error })
    return error
  }
}

module.exports = {
  getMemoDataById,
  postMemoData
}
