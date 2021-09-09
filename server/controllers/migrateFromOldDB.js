'use strict'

const log = require('kth-node-log')
const { StoredMemoPdfsModel } = require('../models/storedMemoPdfsModel')
const fs = require('fs')

const conflictsLogger = fs.createWriteStream('./conflictsREF-Aug8.csv', {
  flags: 'a', // 'a' means appending (old data will be preserved)
})
conflictsLogger.write(
  'ny memos id,existernade memos id,courseCode,semester,koppsRoundId,ny memos skapare,exist memos skapare,ny memos link,exist memos link \r\n'
)
const loggerDuplicatesFromPrevMigration = fs.createWriteStream('duplicatesFromPrevMigrationREF-Aug8.txt', {
  flags: 'a', // 'a' means appending (old data will be preserved)
})
loggerDuplicatesFromPrevMigration.write(
  'ny memos id,existernade memos id,courseCode,semester,koppsRoundId,ny memos skapare,exist memos skapare,ny memos link,exist memos link \r\n'
)

const loggerMigrated = fs.createWriteStream('migratedREF-Aug8.txt', {
  flags: 'a', // 'a' means appending (old data will be preserved)
})
const BLOB_SERVICE_SAS_URL = {
  stage: 'https://kursinfostoragestage.blob.core.windows.net/',
  prod: 'https://kursinfostorageREF-Aug8.blob.core.windows.net/',
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
  const { courseCode, koppsRoundId, semester, changedBy, courseMemoFileName, _id } = historyMemo //pdfPMDate
  try {
    // lastChangeDate: { $gte : new ISODate("2021-07-05T16:34:31Z") }
    const alternativeMemo = await StoredMemoPdfsModel.find({
      courseCode,
      koppsRoundId,
      semester,
      // lastChangeDate: { $gte: new ISODate('2021-03-04T16:34:31Z') },
    })
    if (alternativeMemo.length > 0) {
      log.info(`---------c********* ${_id} has conflicts ${alternativeMemo.map(m => m._id).join(',')}`)

      conflictsLogger.write(
        `${_id},${alternativeMemo[0]._id},${courseCode},${semester},${koppsRoundId},${changedBy},${alternativeMemo[0].changedBy},${BLOB_SERVICE_SAS_URL[TEST_ENV]}${KUTSUTV_BLOB}/${courseMemoFileName},${BLOB_SERVICE_SAS_URL[TEST_ENV]}${KURSPM_BLOB}/${alternativeMemo[0].courseMemoFileName} \r\n`
      )
      return false
    }
    return true
  } catch (error) {
    log.error('Error in searchAndFilterForConlictMemos ', { error })
    return error
  }
}

async function filterMemos(data) {
  try {
    if (data) {
      log.info('3 --- Filtering documents before migration ', data.length)
      const filterMigrated = await data.filter(async historyMemo => searchAndFilterHistoryMemos(historyMemo))
      const existingHistoryMemoNum = data.length - filterMigrated.length

      log.info('4 ----Skipped in Total memos which were migrated before: ', existingHistoryMemoNum)
      log.info('5 --- Prepare to find conflicted memos ---', existingHistoryMemoNum)

      const newData = await filterMigrated.filter(historyMemo => searchAndFilterForConlictMemos(historyMemo))
      const conflictedNum = filterMigrated.length - newData.length

      log.info('6 ---- Skipped in Total conflicted', conflictedNum)

      if (newData) {
        log.info('7 ----Found new memos to migrate', newData.length)
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
  } catch (error) {
    log.error('Error in filterMemos ', { error })
    return error
  }
}

async function saveAllArrayOfDocuments(data) {
  try {
    if (data) {
      log.info('Saving documents for migration ', { data })
      // TODO: FIND CONFLICTS
      const resultAfterUpdate = await StoredMemoPdfsModel.insertMany(data, { ordered: false })
      if (resultAfterUpdate) {
        log.info('MIGRATION SUCCESS All DATA SAVED! ')
      }
      return resultAfterUpdate
    }
    log.info('No migration data sent to be saved', { data })
  } catch (error) {
    log.error('Error in saveAllArrayOfDocuments ', { error })
    return error
  }
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
    log.info('1 Save all migrated memo data about pdfs stored in storage, data origin: kursutveckling-api')

    log.info('2 ----------all documents', documents.length)
    const onlyNewAndWithoutConflictsMemos = await filterMemos(documents)
    log.info(
      '3 ----------Save all new withoud conflicts migrated memo data about pdfs stored in storage, data origin: kursutveckling-api' +
        onlyNewAndWithoutConflictsMemos
    )
    // dbResponse.push(await saveAllArrayOfDocuments(documents))
    await dbResponse.push(await saveAllArrayOfDocuments(onlyNewAndWithoutConflictsMemos))

    log.info('dbResponse after migration', dbResponse.length || 'error')
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
