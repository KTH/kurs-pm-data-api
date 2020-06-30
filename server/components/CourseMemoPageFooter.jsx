/* eslint-disable react/prop-types */
import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'

import i18n from '../../i18n'

import { concatMemoName, concatSyllabusName, formatVersionDate } from '../lib/pdfUtils'

const styles = StyleSheet.create({
  italic: {
    fontFamily: 'Open Sans Italic'
  },
  pageFooter: {
    fontFamily: 'Open Sans',
    fontSize: 12,
    flexDirection: 'row',
    borderTop: '1px solid black',
    paddingTop: '6pt'
  },
  pageNumberLeft: {
    flexGrow: 0,
    flexDirection: 'column',
    fontSize: 12,
    textAlign: 'left'
  },
  pageFooterRight: {
    flexGrow: 1,
    fontSize: 12,
    textAlign: 'right'
  }
})

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

export default CourseMemoPageFooter
