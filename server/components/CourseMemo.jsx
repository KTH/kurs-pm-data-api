/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
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
*/
export const CourseMemo = ({ data }) => <CourseMemoDocument data={data} />
