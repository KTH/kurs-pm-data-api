'use strict'

const log = require('@kth/log')
const { StoredMemoPdfsModel } = require('../models/storedMemoPdfsModel')
const dbArrayOfDocument = require('../lib/dbSeveralDocument')

const mergeRoundsWithTheSamePdfFile = (miniFileInfo, koppsRoundId) => {
  const { ladokRoundIds } = miniFileInfo
  return [...ladokRoundIds, koppsRoundId].sort((a, b) => Number(a) - Number(b))
}

const pdfMemosTree = dbMigratedPdfs => {
  const pdfMemos = {}
  dbMigratedPdfs.map(({ courseCode, courseMemoFileName, koppsRoundId, semester, lastChangeDate }) => {
    if (!koppsRoundId || koppsRoundId === '') return

    const semesterInfo = pdfMemos[semester] || {}
    const miniFileInfo = semesterInfo[courseMemoFileName] || {}
    const { ladokRoundIds } = miniFileInfo
    if (ladokRoundIds) {
      pdfMemos[semester][courseMemoFileName].ladokRoundIds = mergeRoundsWithTheSamePdfFile(miniFileInfo, koppsRoundId)
    } else {
      pdfMemos[semester] = {
        ...pdfMemos[semester],
        [courseMemoFileName]: {
          courseCode,
          courseMemoFileName,
          ladokRoundIds: [koppsRoundId],
          semester,
          isPdf: true,
          lastChangeDate,
        },
      }
    }
  })
  return pdfMemos
}

async function getPdfAndWebMemosListByCourseCode(req, res) {
  if (!req.params.courseCode) throw new Error('courseCode must be set')
  const courseCode = req.params.courseCode.toUpperCase()
  const miniMemos = {}
  try {
    log.debug('Fetching all courseMemos for ' + courseCode)

    const dbMigratedPdfs = await StoredMemoPdfsModel.aggregate([{ $match: { courseCode, semester } }])
    const webBasedMemos = await dbArrayOfDocument.getAllMemosByStatus(courseCode, 'published')

    const mergedPdfMemos = pdfMemosTree(dbMigratedPdfs)

    Object.entries(mergedPdfMemos).map(keyValuePair => {
      const pdfMemoSemester = keyValuePair[0]
      const files = Object.values(keyValuePair[1])
      miniMemos[pdfMemoSemester] = [...(miniMemos[pdfMemoSemester] || []), ...files]
    })

    webBasedMemos.map(
      ({ ladokRoundIds, memoEndPoint, memoCommonLangAbbr, memoName, semester, version, lastChangeDate }) => {
        miniMemos[semester] = [
          ...(miniMemos[semester] || []),
          {
            courseCode,
            ladokRoundIds,
            semester,
            memoEndPoint,
            memoCommonLangAbbr,
            memoName,
            isPdf: false,
            version,
            lastChangeDate,
          },
        ]
      }
    )

    res.json(miniMemos)
    log.debug('getPdfAndWebMemosListByCourseCode: Responded to request for all memos pdfs and web based with: ', {
      courseCode,
      miniMemos,
    })
  } catch (err) {
    log.error('getPdfAndWebMemosListByCourseCode: Failed request for memo, error:', { err })
    return err
  }
}

async function getPdfAndWebMemosListBySemester(req, res) {
  /* Used by kursinfo-admin-web statistik page per semester (not course code) */
  if (!req.params.semester) throw new Error('semester must be set')
  const { semester: chosenSemester } = req.params
  try {
    log.debug('Fetching all courseMemos for ' + chosenSemester)
    // Don’t include memo’s originally uploaded in kursutvecklinga-admin-web
    const dbMigratedPdfs = await StoredMemoPdfsModel.aggregate([
      { $match: { semester: chosenSemester, memoFlag: { $ne: 'historyMemo' } } },
    ])
    const mergedPdfMemos = pdfMemosTree(dbMigratedPdfs)

    const webBasedPublishedMemos = await dbArrayOfDocument.getFirstMemosBySemesterAndStatus(chosenSemester, 'published')
    const webBasedOldMemos = await dbArrayOfDocument.getFirstMemosBySemesterAndStatus(chosenSemester, 'old')
    const webBasedMemos = [...webBasedPublishedMemos, ...webBasedOldMemos]

    const listMiniMemos = [
      ...Object.values(mergedPdfMemos[chosenSemester] || []),
      ...(webBasedMemos.map(
        ({
          courseCode,
          ladokRoundIds,
          memoEndPoint,
          memoCommonLangAbbr,
          memoName,
          semester,
          version,
          lastChangeDate,
        }) => ({
          courseCode,
          ladokRoundIds,
          semester,
          memoEndPoint,
          memoCommonLangAbbr,
          memoName,
          isPdf: false,
          version,
          lastChangeDate,
        })
      ) || []),
    ]

    res.json(listMiniMemos)
    log.info('getPdfAndWebMemosListBySemester: Responded to request for all memos pdfs and web based with: ', {
      chosenSemester,
      listMiniMemos,
    })
  } catch (err) {
    log.error('getPdfAndWebMemosListBySemester: Failed request for memo, error:', { err })
    return err
  }
}

async function getPrioritizedWebOrPdfMemosByCourseCode(req, res) {
  // List of all actual memos but only prioritized by principle:
  // If there is a web-based memo, then don't fetch pdf version. Add pdf version only in case there is no web based memo.

  const { courseCode: rawCourseCode } = req.params
  if (!rawCourseCode) throw new Error('courseCode must be set')
  const courseCode = rawCourseCode.toUpperCase()
  const miniMemos = {}
  try {
    log.debug('Fetching all courseMemos for ' + courseCode)

    const dbMigratedPdfs = await StoredMemoPdfsModel.aggregate([{ $match: { courseCode, semester } }])

    const webBasedMemos = await dbArrayOfDocument.getAllMemosByStatus(courseCode, 'published')
    // firstly fetch web-based
    webBasedMemos.forEach(
      ({ ladokRoundIds, memoEndPoint, memoCommonLangAbbr, memoName, semester, version, lastChangeDate }) => {
        if (!semester) return
        if (!miniMemos[semester]) miniMemos[semester] = {}
        ladokRoundIds.forEach(roundId => {
          miniMemos[semester][roundId] = {
            courseCode,
            ladokRoundIds,
            semester,
            memoEndPoint,
            memoCommonLangAbbr,
            memoName,
            isPdf: false,
            version,
            lastChangeDate,
          }
        })
      }
    )
    // if there is a round without a web-based memo, then fill it with pdf memo (if memo exists)
    dbMigratedPdfs.forEach(
      ({
        courseCode,
        courseMemoFileName,
        koppsRoundId,
        pdfMemoUploadDate = '',
        lastChangeDate = pdfMemoUploadDate,
        previousFileList,
        semester,
      }) => {
        if (!semester) return
        if (!koppsRoundId) return
        if (!miniMemos[semester]) miniMemos[semester] = {}
        if (!miniMemos[semester][koppsRoundId]) {
          miniMemos[semester][koppsRoundId] = {
            courseCode,
            courseMemoFileName,
            ladokRoundIds: [koppsRoundId],
            lastChangeDate,
            semester,
            previousFileList,
            isPdf: true,
          }
        }
      }
    )

    res.json(miniMemos)
    log.debug(
      'getPrioritizedWebOrPdfMemosByCourseCode: Responded to request for filtered memos pdfs and web based with: ',
      {
        courseCode,
        miniMemos,
      }
    )
  } catch (err) {
    log.error('getPrioritizedWebOrPdfMemosByCourseCode: Failed request for memo, error:', { err })
    return err
  }
}

module.exports = {
  getPdfAndWebMemosListByCourseCode,
  getPdfAndWebMemosListBySemester,
  getPrioritizedWebOrPdfMemosByCourseCode,
}
