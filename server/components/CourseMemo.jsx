import React from 'react'

import CourseMemoDocument from './CourseMemoDocument'
import { data as propTypeData } from './CourseMemoPropTypes'

const CourseMemo = ({ data }) => <CourseMemoDocument data={data} />

CourseMemo.propTypes = {
  data: propTypeData.isRequired
}

export default CourseMemo
