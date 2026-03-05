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

async function findPublishedMemosWithoutSyllabusValid() {
  const result = await CourseMemo.find({
    $and: [
      {
        $or: [
          { 'syllabusValid.textFromTo': '' },
          { 'syllabusValid.textFromTo': ' - ' },
          {
            'syllabusValid.textFromTo': {
              $exists: false,
            },
          },
        ],
      },
      {
        $or: [
          { 'syllabusValid.validFromTerm': '' },
          {
            'syllabusValid.validFromTerm': {
              $exists: false,
            },
          },
          { 'syllabusValid.validFromTerm': null },
        ],
      },
      {
        $or: [
          { 'syllabusValid.validUntilTerm': '' },
          {
            'syllabusValid.validUntilTerm': {
              $exists: false,
            },
          },
          { 'syllabusValid.validUntilTerm': null },
        ],
      },
      { status: 'published' },
      { semester: { $gte: '20251' } },
    ],
  })

  console.log(`Found ${result.length} results`)
  return result
}

require('../server/database').connect()

function getInterestingData(memos) {
  return memos.map(memo => ({
    courseCode: memo.courseCode,
    semester: memo.semester,
    version: memo.version,
    memoLang: memo.memoCommonLangAbbr,
    memoEndPoint: memo.memoEndPoint,
    url: createMemoLink(memo),
  }))
}

function printRow(memo, headers) {
  return `|${headers.map(header => memo[header]).join('|')}|`
}

function printCsvRow(memo, headers) {
  return `${headers.map(header => memo[header]).join(',')}`
}

function printMarkdown(memos, headersInput) {
  const headers = headersInput ? headersInput : Object.keys(memos[0])

  let output = `|${headers.join('|')}|\n`
  output += `|${headers.map(() => '--').join('|')}|\n`

  output += memos.map(memo => printRow(memo, headers)).join('\n')

  console.log(output)
}

function printCsv(memos, headersInput) {
  const headers = headersInput ? headersInput : Object.keys(memos[0])

  let output = `${headers.join(',')}\n`

  output += memos.map(memo => printCsvRow(memo, headers)).join('\n')

  console.log(output)
}

function saveJson(data) {
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')
  const filename = `courseMemoFix_data_${timestamp}.json`
  console.log('Writing to JSON file', filename)

  fs.writeFileSync(filename, JSON.stringify(data, null, 2))
}

findPublishedMemosWithoutSyllabusValid().then(result => {
  if (result.length > 0) {
    const interestingData = getInterestingData(result)
    printMarkdown(interestingData)
    // printCsv(interestingData)
    console.table(interestingData)

    console.log('URLS to test:')
    console.log(interestingData.map(({ url }) => url))

    saveJson(interestingData)
  } else {
    console.log('Nothing found')
  }

  console.log('Done')
  process.exit()
})
