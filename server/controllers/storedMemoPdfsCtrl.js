/* eslint-disable consistent-return */

'use strict'

const log = require('kth-node-log')
const { StoredMemoPdfs } = require('../models/storedMemoPdfs')

async function getStoredCourseMemoPdfListByCourseCode(req, res) {
  if (!req.params.courseCode) throw new Error('courseCode must be set')

  const courseCode = req.params.courseCode.toUpperCase()
  let { semester } = req.params
  const returnList = []
  const tempObj = {}
  log.debug('Fetching all courseMemos for ' + courseCode)

  // eslint-disable-next-line no-restricted-globals
  semester = isNaN(semester) ? '19001' : semester

  log.info('Received request for all memos with: ', { courseCode })

  try {
    const dbResponse = await StoredMemoPdfs.find({ courseCode }).populate('MemoStoredFilesListForCourseCode').lean()

    log.info('Successfully got all memos for', { courseCode }, 'dbResponse length', dbResponse.length)
    if (!dbResponse) {
      log.info('dbResponse IS EMPTY for course', courseCode)
      return res.json()
    }
    for (let index = 0; index < dbResponse.length; index++) {
      if (dbResponse[index].semester >= semester) {
        // eslint-disable-next-line no-underscore-dangle
        tempObj[dbResponse[index]._id] = {
          courseCode: dbResponse[index].courseCode,
          pdfMemoUploadDate: dbResponse[index].pdfMemoUploadDate,
          koppsRoundId: dbResponse[index].koppsRoundId,
          courseMemoFileName: dbResponse[index].courseMemoFileName,
          semseter: dbResponse[index].semester
        }
      }
      returnList.push(tempObj)
    }
    res.json(tempObj)
    log.info('Responded to request for all memos with: ', { courseCode })
  } catch (error) {
    log.error('Error in getStoredCourseMemoPdfListByCourseCode', { error })
    return error
  }
}

module.exports = {
  getStoredCourseMemoPdfListByCourseCode
}
