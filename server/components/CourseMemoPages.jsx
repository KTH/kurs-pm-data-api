/* eslint-disable react/prop-types */
import React, { Profiler } from 'react'
import { Page, View, StyleSheet } from '@react-pdf/renderer'

import CourseMemoContent from './CourseMemoContent'
// import CourseMemoPageHeader from './CourseMemoPageHeader'
import CourseMemoPageFooter from './CourseMemoPageFooter'
import { profilerToLog } from '../lib/pdfUtils'
import { pageMeasurements } from '../lib/pdfConstants'

const { A4 } = pageMeasurements

const styles = StyleSheet.create({
  pages: { padding: A4.pageMargin, flexDirection: 'column' },
  header: { flexGrow: 0 },
  // content: { flexGrow: 1, padding: '10mm 0 10mm 0' },
  content: { flexGrow: 1, padding: '0 0 10mm 0' },
  footer: { flexGrow: 0 }
})

/* A4 is default page size value, explicitly set for clarity */
const CourseMemoPages = ({ data }) => (
  <Page size="A4" style={styles.pages}>
    {/* <Profiler id="CourseMemoPageHeader" onRender={profilerToLog}>
      <View fixed style={styles.header}>
        <CourseMemoPageHeader data={data} />
      </View>
    </Profiler> */}
    <Profiler id="CourseMemoContent" onRender={profilerToLog}>
      <View style={styles.content}>
        <CourseMemoContent data={data} />
      </View>
    </Profiler>
    <Profiler id="CourseMemoPageFooter" onRender={profilerToLog}>
      <View fixed style={styles.footer}>
        <CourseMemoPageFooter data={data} />
      </View>
    </Profiler>
  </Page>
)

export default CourseMemoPages
