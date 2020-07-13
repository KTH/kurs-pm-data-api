import React, { Profiler } from 'react'
import { Document } from '@react-pdf/renderer'

import CourseMemoCoverSheet from './CourseMemoCoverSheet'
import CourseMemoPages from './CourseMemoPages'
import { data as propTypeData } from './CourseMemoPropTypes'
import { concatMemoName, profilerToLog, timer } from '../lib/pdfUtils'

const CourseMemoDocument = ({ data }) => {
  const title = concatMemoName(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr)
  return (
    <Profiler id="CourseMemoDocument" onRender={profilerToLog}>
      <Document title={title} author="KTH" onRender={timer('CourseMemoDocument', Date.now())}>
        <Profiler id="CourseMemoCoverSheet" onRender={profilerToLog}>
          <CourseMemoCoverSheet data={data} />
        </Profiler>
        <Profiler id="CourseMemoPages" onRender={profilerToLog}>
          <CourseMemoPages data={data} />
        </Profiler>
      </Document>
    </Profiler>
  )
}

CourseMemoDocument.propTypes = {
  data: propTypeData.isRequired
}

export default CourseMemoDocument
