'use strict'

const fontPaths = {
  OpenSans: 'server/fonts/OpenSans-Regular.ttf',
  Georgia: 'server/fonts/Georgia.ttf'
}

const fontSizes = {
  h1: 36,
  h2: 24,
  h3: 18,
  p: 12
}

const paragraphGaps = {
  h1: 18,
  h2: 12,
  h3: 6,
  p: 18
}

const pageMargins = 20

const pageSize = 'A4'

const messages = [
  {
    season: {
      1: 'Spring ',
      2: 'Autumn '
    },
    memoLabel: 'Course memo',
    headers: {
      contentAndOutcomes: 'Content and learning outcomes',
      courseContent: 'Course contents',
      learningOutcomes: 'Intended learning outcomes',
      learningActivities: 'Learning activities',
      scheduleDetails: 'Schedule details'
    }
  },
  {
    season: {
      1: 'VT ',
      2: 'HT '
    },
    memoLabel: 'Kurs-PM',
    headers: {
      contentAndOutcomes: 'Innehåll och lärandemål',
      courseContent: 'Kursinnehåll',
      learningOutcomes: 'Lärandemål',
      learningActivities: 'Läraktiviteter',
      scheduleDetails: 'Detaljschema'
    }
  }
]

const sections = [
  {
    id: 'contentAndOutcomes',
    content: ['courseContent', 'learningOutcomes', 'learningActivities', 'scheduleDetails']
  }
]

module.exports = {
  fontPaths,
  fontSizes,
  paragraphGaps,
  pageMargins,
  pageSize,
  messages,
  sections
}
