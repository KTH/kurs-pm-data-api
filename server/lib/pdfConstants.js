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

// TODO: How do we sync these fields up between all kurs-pm apps
const sections = [
  {
    id: 'contentAndOutcomes',
    title: 'Innehåll och lärandemål', // TODO: Later, to use i18n messages.sections for en/Sv somehow
    content: ['courseContent', 'learningOutcomes', 'learningActivities', 'scheduleDetails'],
    extraHeaderTitle: 'extraHeaders1'
  },
  {
    id: 'prep',
    title: 'Förbereda inför kursstart',
    content: [
      'prerequisites',
      'preparations',
      'literature',
      'equipment',
      'software',
      'permanentDisability',
      'permanentDisabilitySubSection'
    ],
    extraHeaderTitle: 'extraHeaders2'
  },
  {
    id: 'reqToFinal',
    title: 'Examination',
    content: [
      'gradingScale',
      'examination',
      'examinationSubSection',
      'otherRequirementsForFinalGrade',
      'gradingCriteria',
      'possibilityToCompletion',
      'possibilityToAddition',
      'possibilityToCompensate',
      'reportingResults',
      'ethicalApproach',
      'ethicalApproachSubSection'
    ],
    extraHeaderTitle: 'extraHeaders3'
  },
  {
    id: 'extra',
    title: 'Ytterligare Information',
    content: ['additionalRegulations', 'infoForReregisteredStudents'],
    extraHeaderTitle: 'extraHeaders4'
  },
  {
    id: 'contacts',
    title: 'Kontakter',
    content: [
      'communicationDuringCourse',
      'courseCoordinator',
      'teacher',
      'teacherAssistants',
      'examiner',
      'otherContacts'
    ],
    extraHeaderTitle: null
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
