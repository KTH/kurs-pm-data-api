/* eslint-disable react/prop-types */
import React from 'react'
import { Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer'

import { concatMemoName } from '../lib/pdfUtils'

const styles = StyleSheet.create({
  coverSheet: { padding: '15mm' },
  logo: { height: '30mm', width: '30mm' },
  titleContainer: { top: '30mm', marginLeft: '15mm' },
  title: { fontSize: '36pt' },
  subTitle: { fontSize: '18pt' },
  infoContainer: { marginTop: '18pt', fontSize: '12pt' },
  infoHeader: { marginTop: '6pt', fontFamily: 'Open Sans SemiBold' }
})

/* A4 is default page size value, explicitly set for clarity */
const CourseMemoCoverSheet = ({ data }) => {
  const title = concatMemoName(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr)
  return (
    <Page size="A4" style={styles.coverSheet}>
      <Image style={styles.logo} src="server/img/KTH_Logotyp_RGB_2013.png" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{data.courseCode}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoHeader}>Kursen ges av</Text>
          <Text>N/A</Text>
          <Text style={styles.infoHeader}>Undervisningsspråk</Text>
          <Text>{data.memoCommonLangAbbr === 'en' ? 'English' : 'Svenska'}</Text>
          <Text style={styles.infoHeader}>Kursomgång</Text>
          <Text>{data.memoName}</Text>
        </View>
      </View>
    </Page>
  )
}

export default CourseMemoCoverSheet
