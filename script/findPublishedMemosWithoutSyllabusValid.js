/* eslint-disable no-console */
const { CourseMemo } = require('../server/models/mainMemoModel')

async function findPublishedMemosWithoutSyllabusValid() {
  const result = await CourseMemo.find({
    $and: [
      {
        $or: [{ 'syllabusValid.textFromTo': '' }, { 'syllabusValid.textFromTo': ' - ' }],
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

function createMemoLink({ courseCode, memoEndPoint }) {
  return `${process.env.BASE_URL}${courseCode}/${memoEndPoint}`
}

function getInterestingData(memos) {
  return memos.map(memo => ({
    courseCode: memo.courseCode,
    semester: memo.semester,
    version: memo.version,
    url: createMemoLink(memo),
  }))
}

function printRow(memo, headers) {
  return `|${headers.map(header => memo[header]).join('|')}|`
}

function printMarkdown(memos, headersInput) {
  const headers = headersInput ? headersInput : Object.keys(memos[0])

  let output = `|${headers.join('|')}|\n`
  output += `|${headers.map(() => '--').join('|')}|\n`

  output += memos.map(memo => printRow(memo, headers)).join('\n')

  console.log(output)
}

findPublishedMemosWithoutSyllabusValid().then(result => {
  const interestingData = getInterestingData(result)
  printMarkdown(interestingData)

  console.log('Done')
  process.exit()
})
