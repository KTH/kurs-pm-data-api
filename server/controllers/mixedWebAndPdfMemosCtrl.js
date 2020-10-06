'use strict'

const log = require('kth-node-log')
const { StoredMemoPdfsModel } = require('../models/storedMemoPdfsModel')
const dbArrayOfDocument = require('../lib/dbSeveralDocument')

const mergeRoundsWithTheSamePdfFile = (miniFileInfo, koppsRoundId) => {
  const { ladokRoundIds } = miniFileInfo
  return [...ladokRoundIds, koppsRoundId].sort((a, b) => Number(a) - Number(b))
}

const pdfMemosTree = dbMigratedPdfs => {
  const pdfMemos = {}
  dbMigratedPdfs.map(({ courseCode, courseMemoFileName, koppsRoundId, semester }) => {
    if (!koppsRoundId || koppsRoundId === '') return

    const semesterInfo = pdfMemos[semester] || {}
    const miniFileInfo = semesterInfo[courseMemoFileName] || {}
    const { ladokRoundIds } = miniFileInfo
    if (ladokRoundIds) {
      miniFileInfo.ladokRoundIds = mergeRoundsWithTheSamePdfFile(miniFileInfo, koppsRoundId)
    } else {
      pdfMemos[semester] = {
        [courseMemoFileName]: {
          courseCode,
          courseMemoFileName,
          ladokRoundIds: [koppsRoundId],
          semester,
          isPdf: true
        }
      }
    }
  })
  return pdfMemos
}

async function getMixedWebAndPdfMemosList(req, res) {
  if (!req.params.courseCode) throw new Error('courseCode must be set')
  const courseCode = req.params.courseCode.toUpperCase()
  const miniMemos = {}
  try {
    log.debug('Fetching all courseMemos for ' + courseCode)

    const dbMigratedPdfs = await StoredMemoPdfsModel.find({ courseCode })
      .populate('MemoStoredFilesListForCourseCode')
      .lean()
    const webBasedMemos = await dbArrayOfDocument.getAllMemosByStatus(courseCode, 'published')

    const mergedPdfMemos = pdfMemosTree(dbMigratedPdfs)

    Object.entries(mergedPdfMemos).map(keyValuePair => {
      const pdfMemoSemester = keyValuePair[0]
      const files = Object.values(keyValuePair[1])
      miniMemos[pdfMemoSemester] = [...(miniMemos[pdfMemoSemester] || []), ...files]
    })

    webBasedMemos.map(({ ladokRoundIds, memoEndPoint, memoCommonLangAbbr, memoName, semester }) => {
      miniMemos[semester] = [
        ...(miniMemos[semester] || []),
        { courseCode, ladokRoundIds, semester, memoEndPoint, memoCommonLangAbbr, memoName, isPdf: false }
      ]
    })

    res.json(miniMemos)
    log.info('Responded to request for all memos pdfs and web based with: ', { courseCode, miniMemos })
  } catch (err) {
    log.error('getMemosByCourseCodeAndType: Failed request for memo, error:', { err })
    return err
  }
}

module.exports = {
  getMixedWebAndPdfMemosList
}
