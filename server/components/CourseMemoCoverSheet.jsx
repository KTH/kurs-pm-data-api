import React from 'react'
import { Page, View, Text, Image } from '@react-pdf/renderer'

import styles from './CourseMemoStyles'
import { data as propTypeData } from './CourseMemoPropTypes'
import { concatMemoName, formatCredits, formatVersionDate } from '../lib/pdfUtils'
import { logotypePath } from '../lib/pdfConstants'

const CourseMemoCoverSheet = ({ data }) => {
  // TODO: Remove and use data from API when it is availabe
  // MJ2462 Achieving Energy Efficiency in Existing Buildings 6 credits
  const courseName = `${data.courseCode}\n${data.title ? data.title : ''} ${formatCredits(
    data.credits,
    data.creditUnitAbbr,
    data.memoCommonLangAbbr
  )}`

  // TODO: Remove and use name from API data when it is available
  // I.e. ”Course memo Autumn 2020-1”
  const courseMemoName = concatMemoName(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr)

  // ”Ver” string seems to be language agnostic
  const version = `Ver ${data.version} ${formatVersionDate(data.memoCommonLangAbbr, data.lastChangeDate)}`

  return (
    /* A4 is default page size value, explicitly set for clarity */
    <Page size="A4" style={styles.coverSheet}>
      <View style={styles.coverSheetContainer}>
        <Image style={styles.logotype} src={logotypePath} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{courseName}</Text>
          <Text style={styles.subTitle}>{courseMemoName}</Text>
          <Text style={styles.version}>{version}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoHeader}>Kursomgång</Text>
            <Text style={styles.infoText}>{data.memoName}</Text>
            <Text style={styles.infoHeader}>Undervisningsspråk</Text>
            <Text style={styles.infoText}>{data.memoCommonLangAbbr === 'en' ? 'English' : 'Svenska'}</Text>
            <Text style={styles.infoHeader}>Kursen ges av</Text>
            <Text style={styles.infoText}>{data.departmentName ? data.departmentName : ''}</Text>
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
