/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const fs = require('fs')
const log = require('@kth/log')

const { CourseMemo } = require('../server/models/mainMemoModel')
const { createMemoLink } = require('./utils')

log.init({
  name: 'updateMemosWithSyllabusData',
  app: 'updateMemosWithSyllabusData',
  env: 'development',
  level: 'debug',
  console: undefined,
  stdout: undefined,
  src: undefined,
})

require('../server/database').connect()

/**
 * Do not use this if you do not know what you're doing. Will reset again :)
 */
const resetMemos = memos =>
  memos.map(content => ({
    ...content,
    syllabusValid: {
      validFromTerm: '',
      validUntilTerm: '',
      textFromTo: ' - ',
    },
  }))

const readIncompleteMemos = filename => {
  const raw = fs.readFileSync(`${filename}.json`, 'utf-8')
  const parsed = JSON.parse(raw)

  return parsed
}

const updateMemo = async ({ memoEndPoint, version, status, data }) => {
  const resultAfterUpdate = await CourseMemo.findOneAndUpdate(
    { memoEndPoint, status, version },
    { $set: data },
    { maxTimeMS: 100, new: true, useFindAndModify: false }
  )

  if (resultAfterUpdate.syllabusValid.validFromTerm !== '') {
    log.info('OK')
    return true
  } else {
    log.error('ERROR')
    return false
  }
}

const getPossibleDraftMemo = async ({ memoEndPoint, version }) => {
  const draftVersion = version + 1
  const params = {
    memoEndPoint,
    version: draftVersion,
    status: 'draft',
  }
  log.info(`Checking if there's a draft memo for`, params)
  const result = await CourseMemo.findOne(params)

  if (!result) return undefined

  log.info(`Found draft version`)

  return result
}

const processMemo = async memo => {
  const { memoEndPoint, syllabusValid, version, courseCode } = memo
  //   const memoDB = await fetchMemoByEndPointAndStatus(memoEndPoint, 'published')

  const params = { memoEndPoint, version, status: 'published', data: { syllabusValid } }
  log.info('Updating memo with params', params)
  const updatePublishedOK = await updateMemo(params)

  const draft = await getPossibleDraftMemo(memo)

  if (draft) {
    const draftParams = { memoEndPoint, version: draft.version, status: draft.status, data: { syllabusValid } }
    log.info('Found draft. Updating draft with params', draftParams)
    const updateDraftOk = await updateMemo(draftParams)

    return {
      courseCode,
      memoEndPoint,
      updatePublishedOK,
      hasDraft: true,
      updateDraftOk,
    }
  }

  return { courseCode, memoEndPoint, updatePublishedOK, hasDraft: false }
}

const processMemosSequentially = async memos => {
  const results = []

  for (const memo of memos) {
    const result = await processMemo(memo)
    results.push(result)
  }

  return results
}

const logMemoResult = result => ({
  ...result,
  url: createMemoLink(result),
})

const processMemos = async memos => {
  const results = await processMemosSequentially(memos)

  const niceResults = results.map(logMemoResult)
  console.table(niceResults)

  return niceResults
}

const memos = readIncompleteMemos('courseMemoFix_data_2026-03-05T13-19-16-enhanced')

console.log(memos)

processMemos(memos).then(results => {
  console.log('URLS to test:')
  console.log(results.map(({ url }) => url))
  console.log('Done')
  process.exit()
})

/**
 * TODO
 *
 * - find memo based on memoEndpoint and version
 * - find draft memo with versionNumber higher than the current one
 * - update and save
 *
 */
