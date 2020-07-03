import React from 'react'
import { View, Text } from '@react-pdf/renderer'

import styles from './CourseMemoStyles'
import { data as propTypeData } from './CourseMemoPropTypes'
import { concatMemoName, concatSyllabusName, formatVersionDate } from '../lib/pdfUtils'

const CourseMemoPageFooter = ({ data }) => {
  const syllabusText = concatSyllabusName(data.memoCommonLangAbbr)
  const courseMemoName = concatMemoName(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr)
  const version = `Ver ${data.version} ${formatVersionDate(data.memoCommonLangAbbr, data.lastChangeDate)}`
  const memoNameText = `${data.courseCode} - ${courseMemoName}, ${version}`
  return (
    <View style={styles.pageFooter}>
      <View style={styles.pageFooterLeft}>
        <Text style={styles.italic} fixed>
          {syllabusText}
        </Text>
        <Text fixed>{memoNameText}</Text>
      </View>
      <Text
        style={styles.pageFooterRight}
        render={({ pageNumber, totalPages }) => `\n${pageNumber - 1} (${totalPages - 1})`}
        fixed
      />
    </View>
  )
}

CourseMemoPageFooter.propTypes = {
  data: propTypeData.isRequired
}

export default CourseMemoPageFooter
