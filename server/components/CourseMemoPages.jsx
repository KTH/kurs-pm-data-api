import React, { Profiler } from 'react'
import { Page, View } from '@react-pdf/renderer'

import CourseMemoContent from './CourseMemoContent'
import CourseMemoPageFooter from './CourseMemoPageFooter'
import { data as propTypeData } from './CourseMemoPropTypes'
import styles from './CourseMemoStyles'
import { profilerToLog } from '../lib/pdfUtils'

/* A4 is default page size value, explicitly set for clarity */
const CourseMemoPages = ({ data }) => (
  <Page size="A4" style={styles.pages}>
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

CourseMemoPages.propTypes = {
  data: propTypeData.isRequired
}

export default CourseMemoPages
