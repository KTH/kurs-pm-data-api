/* eslint-disable react/prop-types */
import React from 'react'
import { View, Text, StyleSheet, Image } from '@react-pdf/renderer'

import { concatMemoName } from '../lib/pdfUtils'

const styles = StyleSheet.create({
  pageHeader: { flexDirection: 'row', fontSize: '12pt' },
  logo: { height: '15mm', width: '15mm' },
  headerLeft: { width: '50%', textAlign: 'left' },
  headerRight: { width: '50%', textAlign: 'right' }
})

const CourseMemoPageHeader = ({ data }) => {
  const title = concatMemoName(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr)
  return (
    <View style={styles.pageHeader}>
      <View style={styles.headerLeft}>
        <Image style={styles.logo} src="server/img/KTH_Logotyp_RGB_2013.png" />
      </View>
      <View style={styles.headerRight}>
        <Text>{title}</Text>
        <Text>{data.courseCode}</Text>
      </View>
    </View>
  )
}

export default CourseMemoPageHeader
