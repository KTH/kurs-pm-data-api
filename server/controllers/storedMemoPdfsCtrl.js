/* eslint-disable consistent-return */

'use strict'

const log = require('@kth/log')
const { StoredMemoPdfsModel } = require('../models/storedMemoPdfsModel')

async function getStoredMemoPdfListByCourseCode(req, res) {
  if (!req.params.courseCode) throw new Error('courseCode must be set')

  const courseCode = req.params.courseCode.toUpperCase()
  let { semester } = req.params
  const miniMemosObj = {}

  log.debug('Fetching all courseMemos for ' + courseCode)

  // eslint-disable-next-line no-restricted-globals
  semester = isNaN(semester) ? '19001' : semester

  log.info('Received request for all memos with: ', { courseCode })

  try {
    const storedPdfMemosInfo = await StoredMemoPdfsModel.aggregate([{ $match: { courseCode, semester } }])

    log.info('Successfully got all memos for', { courseCode }, 'dbResponse length', storedPdfMemosInfo.length)
    if (!storedPdfMemosInfo) {
      log.info('dbResponse IS EMPTY for course', courseCode)
      return res.json()
    }
    await storedPdfMemosInfo.map(dbPdfMemo => {
      const { _id: pdfMemoId, semester: thisMemoSemester } = dbPdfMemo
      if (thisMemoSemester >= semester) {
        miniMemosObj[pdfMemoId] = {
          courseCode: dbPdfMemo.courseCode,
          pdfMemoUploadDate: dbPdfMemo.pdfMemoUploadDate,
          koppsRoundId: dbPdfMemo.koppsRoundId,
          courseMemoFileName: dbPdfMemo.courseMemoFileName,
          semester: thisMemoSemester,
        }
      }
    })

    res.json(miniMemosObj)
    log.info('Responded to request for all memos with: ', { courseCode })
  } catch (error) {
    log.error('Error in getStoredMemoPdfListByCourseCode', { error })
    return error
  }
}

async function fetchAll() {
  log.debug('Fetching all migrated courseMemos ')
  const migrated = await StoredMemoPdfsModel.find({})
  log.info('Length of data in db', migrated.length)
  return migrated
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
  collectionLength: checkLength,
  getStoredMemoPdfListByCourseCode,
}
