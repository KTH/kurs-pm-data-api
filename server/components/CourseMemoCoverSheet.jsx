import React from 'react'
import { Page, View, Text, Image } from '@react-pdf/renderer'

import styles from './CourseMemoStyles'
import { data as propTypeData } from './CourseMemoPropTypes'
import { concatMemoName, formatVersionDate, getMessages } from '../lib/pdfUtils'
import { logotypePath, NOT_AVAILABLE, LANGUAGE } from '../lib/pdfConstants'

const CourseMemoCoverSheet = ({ data }) => {
  const courseTitle = data.courseTitle || NOT_AVAILABLE

  // TODO: Remove and use name from API data when it is available
  // I.e. ”Course memo Autumn 2020-1”
  const courseMemoName = concatMemoName(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr)

  // ”Ver” string seems to be language agnostic
  const version = `Version ${data.version} — ${formatVersionDate(data.memoCommonLangAbbr, data.lastChangeDate)}`

  const language = LANGUAGE[data.memoCommonLangAbbr]

  const departmentName = data.departmentName || NOT_AVAILABLE

  const { courseFactsLabels } = getMessages(data.memoCommonLangAbbr)

  return (
    /* A4 is default page size value, explicitly set for clarity */
    <Page size="A4" style={styles.coverSheet}>
      <View style={styles.coverSheetContainer}>
        <Image style={styles.logotype} src={logotypePath} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{courseTitle}</Text>
          <Text style={styles.subTitle}>{courseMemoName}</Text>
          <Text style={styles.version}>{version}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoHeader}>{courseFactsLabels.roundsTitle}</Text>
            <Text style={styles.infoText}>{data.memoName}</Text>
            <Text style={styles.infoHeader}>{courseFactsLabels.languageOfInstructionTitle}</Text>
            <Text style={styles.infoText}>{language}</Text>
            <Text style={styles.infoHeader}>{courseFactsLabels.offeredByTitle}</Text>
            <Text style={styles.infoText}>{departmentName}</Text>
          </View>
        </View>
      </View>
    </Page>
  )
}

CourseMemoCoverSheet.propTypes = {
  data: propTypeData.isRequired
}

export default CourseMemoCoverSheet
