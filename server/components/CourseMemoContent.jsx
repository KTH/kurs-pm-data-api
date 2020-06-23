/* eslint-disable react/prop-types */
import React from 'react'
import { View, Text } from '@react-pdf/renderer'

import parse from './CourseMemoHtmlParser'
import styles from './CourseMemoStyles'

// TODO: Cleanup and only iterate over content here
const CourseMemoContent = ({ data }) => {
  const courseContent = parse(data.courseContent)
  const learningOutcomes = parse(data.learningOutcomes)
  const permanentDisability = parse(data.permanentDisability)
  const examiner = parse(data.examiner)
  const scheduleDetails = parse(data.scheduleDetails)

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.h2}>Course Content</Text>
      <View>{courseContent}</View>
      <Text style={styles.h2}>Learning Outcomes</Text>
      <View>{learningOutcomes}</View>
      <Text style={styles.h2}>Permanent Disability</Text>
      <View>{permanentDisability}</View>
      <Text style={styles.h2}>Examiner</Text>
      <View>{examiner}</View>
      <Text style={styles.h2}>Schedule Details</Text>
      <View>{scheduleDetails}</View>
    </View>
  )
}

export default CourseMemoContent
