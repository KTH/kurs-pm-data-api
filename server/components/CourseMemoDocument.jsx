/* eslint-disable react/prop-types */
import React, { Profiler } from 'react'
import { Document, Font } from '@react-pdf/renderer'
import log from 'kth-node-log'

import CourseMemoCoverSheet from './CourseMemoCoverSheet'
import CourseMemoPages from './CourseMemoPages'

import { concatMemoName } from '../lib/pdfUtils'

Font.register({ family: 'Open Sans', src: 'server/fonts/OpenSans-Regular.ttf' })
Font.register({ family: 'Open Sans SemiBold', src: 'server/fonts/OpenSans-SemiBold.ttf' })
Font.register({ family: 'Georgia', src: 'server/fonts/Georgia.ttf' })

const profilerToLog = (id, phase, actualTime, baseTime, startTime, commitTime, interactions) => {
  log.debug(
    'Profiler',
    id,
    'phase:',
    phase,
    'actualTime:',
    actualTime,
    'baseTime:',
    baseTime,
    'startTime:',
    startTime,
    'commitTime:',
    commitTime,
    'interactions:',
    interactions
  )
}

const CourseMemoDocument = ({ data }) => {
  const title = concatMemoName(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr)
  return (
    <Profiler id="CourseMemoDocument" onRender={profilerToLog}>
      <Document title={title} author="KTH">
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

export default CourseMemoDocument
