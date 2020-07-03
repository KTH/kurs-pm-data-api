/* eslint-disable react/prop-types */
import React from 'react'

import CourseMemoDocument from './CourseMemoDocument'

/*
  Course Memo Components Overview
  - CourseMemo
    - CourseMemoDocument
      - CourseMemoCoverSheet
      - CourseMemoPages
        - CourseMemoPageHeader
        - CourseMemoContent
        - CourseMemoPageFooter
  - CourseMemoStyles
  - CourseMemoHtmlParser
*/
const CourseMemo = ({ data }) => <CourseMemoDocument data={data} />

export default CourseMemo
