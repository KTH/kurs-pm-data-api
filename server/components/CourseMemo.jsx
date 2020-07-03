import React from 'react'

import CourseMemoDocument from './CourseMemoDocument'
import { data as propTypeData } from './CourseMemoPropTypes'

/*
  Course Memo Components Overview
  - CourseMemo
    - CourseMemoDocument
      - CourseMemoCoverSheet
      - CourseMemoPages
        - CourseMemoContent
        - CourseMemoPageFooter
  - CourseMemoStyles
  - CourseMemoHtmlParser
*/
const CourseMemo = ({ data }) => <CourseMemoDocument data={data} />

CourseMemo.propTypes = {
  data: propTypeData.isRequired
}

export default CourseMemo
