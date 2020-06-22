/* eslint-disable react/prop-types */
import React from 'react'
import { Document, Font } from '@react-pdf/renderer'

import CourseMemoCoverSheet from './CourseMemoCoverSheet'
import CourseMemoPages from './CourseMemoPages'

import { concatMemoName } from '../lib/pdfUtils'

Font.register({ family: 'Open Sans', src: 'server/fonts/OpenSans-Regular.ttf' })
Font.register({ family: 'Open Sans SemiBold', src: 'server/fonts/OpenSans-SemiBold.ttf' })
Font.register({ family: 'Georgia', src: 'server/fonts/Georgia.ttf' })

const CourseMemoDocument = ({ data }) => {
  const title = concatMemoName(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr)
  return (
    <Document title={title} author="KTH">
      <CourseMemoCoverSheet data={data} />
      <CourseMemoPages data={data} />
    </Document>
  )
}

export default CourseMemoDocument
