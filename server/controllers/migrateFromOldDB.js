'use strict'

const log = require('kth-node-log')
const { StoredMemoPdfsModel } = require('../models/storedMemoPdfsModel')
const fs = require('fs')

const conflictsLogger = fs.createWriteStream('./conflictsPROD.csv', {
  flags: 'a', // 'a' means appending (old data will be preserved)
})
conflictsLogger.write(
  'ny memos id,existernade memos id,courseCode,semester,koppsRoundId,ny memos skapare,exist memos skapare,ny memos link,exist memos link \r\n'
)
const loggerDuplicatesFromPrevMigration = fs.createWriteStream('duplicatesFromPrevMigrationPROD.txt', {
  flags: 'a', // 'a' means appending (old data will be preserved)
})
loggerDuplicatesFromPrevMigration.write(
  'ny memos id,existernade memos id,courseCode,semester,koppsRoundId,ny memos skapare,exist memos skapare,ny memos link,exist memos link \r\n'
)

const loggerMigrated = fs.createWriteStream('migratedPROD.txt', {
  flags: 'a', // 'a' means appending (old data will be preserved)
})
const BLOB_SERVICE_SAS_URL = {
  stage: 'https://kursinfostoragestage.blob.core.windows.net/',
  prod: 'https://kursinfostorageprod.blob.core.windows.net/',
}
const KUTSUTV_BLOB = 'kursutveckling-blob-container'
const KURSPM_BLOB = 'memo-blob-container'

async function searchAndFilterHistoryMemos(historyMemo) {
  const { courseCode, _id, semester, koppsRoundId, changedBy, courseMemoFileName } = historyMemo
  const alreadyMigratedHistoryMemo = await StoredMemoPdfsModel.find({ _id, courseCode, memoFlag: 'historyMemo' }) //memoFlag: 'historyMemo'
  if (alreadyMigratedHistoryMemo.length > 0) {
    log.info(`---------d********* ${_id} has duplicates ${alreadyMigratedHistoryMemo.map(m => m._id).join(',')}`)

    loggerDuplicatesFromPrevMigration.write(
      `${_id},${alreadyMigratedHistoryMemo[0]._id},${courseCode},${semester},${koppsRoundId},${changedBy},${alreadyMigratedHistoryMemo[0].changedBy},${BLOB_SERVICE_SAS_URL[TEST_ENV]}${KUTSUTV_BLOB}/${courseMemoFileName},${BLOB_SERVICE_SAS_URL[TEST_ENV]}${KURSPM_BLOB}/${alreadyMigratedHistoryMemo[0].courseMemoFileName} \r\n`
    )
    return false
  }
  return true
}
const TEST_ENV = 'stage' //'stage'

async function searchAndFilterForConlictMemos(historyMemo) {
  const { courseCode, koppsRoundId, semester, changedBy, courseMemoFileName, _id } = historyMemo
  const alternativeMemo = await StoredMemoPdfsModel.find({ courseCode, koppsRoundId, semester })
  if (alternativeMemo.length > 0) {
    log.info(`---------c********* ${_id} has conflicts ${alternativeMemo.map(m => m._id).join(',')}`)

    conflictsLogger.write(
      `${_id},${alternativeMemo[0]._id},${courseCode},${semester},${koppsRoundId},${changedBy},${alternativeMemo[0].changedBy},${BLOB_SERVICE_SAS_URL[TEST_ENV]}${KUTSUTV_BLOB}/${courseMemoFileName},${BLOB_SERVICE_SAS_URL[TEST_ENV]}${KURSPM_BLOB}/${alternativeMemo[0].courseMemoFileName} \r\n`
    )
    return false
  }
  return true
}

async function filterMemos(data) {
  if (data) {
    log.info('Filtering documents before migration ', { data })
    const filterMigrated = await data.filter(historyMemo => searchAndFilterHistoryMemos(historyMemo))
    const existingHistoryMemoNum = data.length - filterMigrated.length

    log.info('Skipped in Total memos which were migrated before: ', existingHistoryMemoNum)
    log.info('--- Prepare to find conflicted memos ---', existingHistoryMemoNum)

    const newData = await filterMigrated.filter(historyMemo => searchAndFilterForConlictMemos(historyMemo))
    const conflictedNum = filterMigrated.length - newData.length

    log.info('Skipped in Total conflicted', conflictedNum)

    if (newData) {
      log.info('Found new memos to migrate', newData.length)
      loggerMigrated.write(`${newData.map(m => JSON.stringify(m)).join(',\n')}\n`)
    }
    // res.json(
    //   {
    //     totalBeforeFilter: data.length,
    //     amount: newData.length,
    //     existingHistoryMemoNum,
    //     conflictedNum,
    //     cleanData: newData,
    //   } || {
    //     fileFound: 0,
    //   }
    // )
    return newData
  }
  log.info('No migration data sent to be checked for dublicates or conflicts', { data })
}

async function saveAllArrayOfDocuments(data) {
  if (data) {
    log.info('Saving documents for migration ', { data })
    // TODO: FIND CONFLICTS
    const resultAfterUpdate = await StoredMemoPdfsModel.insertMany(data)
    if (resultAfterUpdate) {
      log.info('MIGRATION SUCCESS All DATA SAVED! ')
    }
    return resultAfterUpdate
  }
  log.info('No migration data sent to be saved', { data })
}

async function fetchAllHistoryMemosFromKursPmAPI() {
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
    log.info('----------documents', documents)
    const onlyNewAndWithoutConflictsMemos = await filterMemos(documents)
    log.info('Save all migrated memo data about pdfs stored in storage, data origin: kursutveckling-api' + memoObj)
    dbResponse.push(await saveAllArrayOfDocuments(documents))

    log.info('dbResponse after migration', dbResponse)
    res.status(201).json(dbResponse)
  } catch (error) {
    log.error('Error in while trying to save all migrating memos ', { error })
    return error
  }
}

async function getAllFilteredMemos(req, res) {
  try {
    const memoObj = req.body
    const { documents } = memoObj
    const dbResponse = []
    const onlyNewAndWithoutConflictsMemos = await filterMemos(documents)
    log.info('Filter all migrated memo data about pdfs stored in storage, data origin: kursutveckling-api' + memoObj)
    res.status(201).json(onlyNewAndWithoutConflictsMemos)
  } catch (error) {
    log.error('Error in while trying to save all migrating memos ', { error })
    return error
  }
}

// /delete
async function removeDocuments(req, res) {
  try {
    const allmemos = await fetchAllHistoryMemosFromKursPmAPI()
    const dbResponse = []
    log.info(
      'Deleting all migrated memo data about pdfs stored in storage, data origin: kursutveckling-api',
      allmemos.length
    )
    for (let i = 0; i < allmemos.length; i++) {
      await deleteByShardKey(allmemos[i].id, allmemos[i].courseCode)
    }
    const isEmpty = await fetchAllHistoryMemosFromKursPmAPI()
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
    const allmemos = await fetchAllHistoryMemosFromKursPmAPI()
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
  findDublicatesAndMemos: getAllFilteredMemos,
}
