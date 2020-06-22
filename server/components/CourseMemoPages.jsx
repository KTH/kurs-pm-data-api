/* eslint-disable react/prop-types */
import React from 'react'
import { Page, View, StyleSheet } from '@react-pdf/renderer'

import CourseMemoContent from './CourseMemoContent'
import CourseMemoPageHeader from './CourseMemoPageHeader'
import CourseMemoPageFooter from './CourseMemoPageFooter'

const styles = StyleSheet.create({
  pages: { padding: '15mm', flexDirection: 'column' },
  header: { flexGrow: 0 },
  content: { flexGrow: 1, padding: '10mm 0 10mm 0' },
  footer: { flexGrow: 0 }
})

/* A4 is default page size value, explicitly set for clarity */
const CourseMemoPages = ({ data }) => (
  <Page size="A4" style={styles.pages}>
    <View fixed style={styles.header}>
      <CourseMemoPageHeader data={data} />
    </View>
    <View style={styles.content}>
      <CourseMemoContent data={data} />
    </View>
    <View fixed style={styles.footer}>
      <CourseMemoPageFooter data={data} />
    </View>
  </Page>
)

export default CourseMemoPages
