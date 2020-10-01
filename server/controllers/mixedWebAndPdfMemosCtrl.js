'use strict'

const log = require('kth-node-log')
const { StoredMemoPdfsModel } = require('../models/storedMemoPdfsModel')
const dbArrayOfDocument = require('../lib/dbSeveralDocument')

async function getMixedWebAndPdfMemosList(req, res) {
  try {
    const storedPdfMemosInfo = await StoredMemoPdfsModel.find({ courseCode })
      .populate('MemoStoredFilesListForCourseCode')
      .lean()
    const { courseCode } = req.params
    const dbResponse = await dbArrayOfDocument.getAllMemosByStatus(courseCode, 'published')
    // obj {
    const miniMemosObj = {
      courseCode: dbPdfMemo.courseCode,
      pdfMemoUploadDate: dbPdfMemo.pdfMemoUploadDate,
      koppsRoundId: dbPdfMemo.koppsRoundId,
      courseMemoFileName: dbPdfMemo.courseMemoFileName,
      semester: thisMemoSemester
    }
  } catch (err) {
    log.error('getMemosByCourseCodeAndType: Failed request for memo, error:', { err })
    return err
  }
}

module.exports = {
  getMixedWebAndPdfMemosList
}
