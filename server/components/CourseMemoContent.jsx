/* eslint-disable react/prop-types */
import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'

import { decodeHtml } from '../lib/pdfUtils'

const styles = StyleSheet.create({
  contentContainer: { fontFamily: 'Georgia', fontSize: '12pt' },
  h2: { fontFamily: 'Open Sans SemiBold', fontSize: '18pt', marginBottom: '9pt' }
})

const CourseMemoContent = ({ data }) => (
  <View style={styles.contentContainer}>
    <Text style={styles.h2}>Course Content</Text>
    <Text>{decodeHtml(data.courseContent)}</Text>
  </View>
)

export default CourseMemoContent
