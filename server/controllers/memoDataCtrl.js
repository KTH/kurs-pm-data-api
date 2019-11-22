/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */

'use strict'

const log = require('kth-node-log')
const dbOneDocument = require('../lib/dbDataById')

async function getMemoDataById(req, res) {
  const { id } = req.params
  log.info('Received request for memo with id: ', id)
  try {
    const dbResponse = await dbOneDocument.fetchCourseMemoDataById(id)

    res.json(dbResponse)
    log.info('Responded to request for memo with id: ', id)
  } catch (err) {
    log.error('Failed request for memo, error:', { err })
    return err
  }
}

async function postMemoData(req, res) {
  try {
    const listLength = req.body.length
    const memoList = req.body
    const dbResponse = []
    let oldObject = {
      previousTextBetyg: '',
      publishDate: ''
    }

    for (let memo = 0; memo < listLength; memo++) {
      log.info('Posting new roundCourseMemoData', { memoList })
      const exists = await dbOneDocument.fetchCourseMemoDataById(memoList[memo]._id)
      memoList[memo].lastChangeDate = new Date()
      if (exists) {
        oldObject = {
          previousTextBetyg: exists.previousTextBetyg,
          publishDate: exists.lastChangeDate
        }
        exists.previousTextsList.push(oldObject)
        memoList[memo].previousTextsList = exists.previousTextsList
        log.info('roundCourseMemoData already exists, update' + memoList[memo]._id)
        dbResponse.push(await dbOneDocument.updateCourseMemoDataById(memoList[memo]))
      } else {
        log.info('saving new memo data' + memoList[memo]._id)
        dbResponse.push(await dbOneDocument.storeNewCourseMemoData(memoList[memo]))
      }
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
