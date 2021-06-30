'use strict'

const log = require('kth-node-log')
const { StoredMemoPdfsModel } = require('../models/storedMemoPdfsModel')

async function saveAllArrayOfDocuments(data) {
  if (data) {
    log.info('Saving documents for migration ', { data })

    const resultAfterUpdate = await StoredMemoPdfsModel.insertMany(data)
    if (resultAfterUpdate) {
      log.info('MIGRATION SUCCESS All DATA SAVED! ')
    }
    return resultAfterUpdate
  }
  log.info('No migration data sent to be saved', { data })
}

async function fetchAll() {
  log.debug('Fetching all migrated courseMemos ')
  const migrated = await StoredMemoPdfsModel.find({ memoFlag: 'historyMemo' })
  log.info('Length of data in db', migrated.length)
  return migrated
}
async function deleteByShardKey(id, courseCode) {
  log.debug('REMOVING all migrated courseMemos ')
  const deleted = await StoredMemoPdfsModel.deleteOne({ _id: id, courseCode })
  return deleted
}
/**
 * POST /
 * SAVE ALL
 */
async function migrateSaveAll(req, res) {
  try {
    const memoObj = req.body
    const { documents } = memoObj
    const dbResponse = []
    log.info('Save all migrated memo data about pdfs stored in storage, data origin: kurs-pm-api' + memoObj)
    dbResponse.push(await saveAllArrayOfDocuments(documents))

    log.info('dbResponse after migration', dbResponse)
    res.status(201).json(dbResponse)
  } catch (error) {
    log.error('Error in while trying to save all migrating memos ', { error })
    return error
  }
}

// /delete
async function removeDocuments(req, res) {
  try {
    const allmemos = await fetchAll()
    const dbResponse = []
    log.info('Deleting all migrated memo data about pdfs stored in storage, data origin: kurs-pm-api', allmemos.length)
    for (let i = 0; i < allmemos.length; i++) {
      await deleteByShardKey(allmemos[i].id, allmemos[i].courseCode)
    }
    const isEmpty = await fetchAll()
    log.info('isEmpty', isEmpty.length)

    log.info('dbResponse after deletiong', isEmpty)
    res.status(201).json(isEmpty)
  } catch (error) {
    log.error('Error in while trying to save all migrating memos ', { error })
    return error
  }
}

// /count
async function checkLength(req, res) {
  try {
    const allmemos = await fetchAll()
    log.info('check length', allmemos.length)

    res.status(201).json({ length: allmemos.length })
  } catch (error) {
    log.error('Error in while trying to save all migrating memos ', { error })
    return error
  }
}

module.exports = {
  emptyCollection: removeDocuments,
  migrateMemoInfoOfStoredPdf: migrateSaveAll,
  collectionLength: checkLength,
}
