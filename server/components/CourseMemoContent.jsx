/* eslint-disable react/prop-types */
import React from 'react'
import { View, Text } from '@react-pdf/renderer'

import parse from './CourseMemoHtmlParser'
import styles from './CourseMemoStyles'

const { sections } = require('../lib/pdfConstants')

const Section = ({ section, data }) => {
  const sectionHeader = section.id
  return (
    <View key={sectionHeader}>
      <Text style={styles.h2}>{sectionHeader}</Text>
      {section.content.map(subSection => (
        <SubSection key={subSection} subSection={subSection} data={data} />
      ))}
    </View>
  )
}

const SubSection = ({ subSection, data }) => {
  const subSectionHeader = subSection
  return (
    <View key={subSectionHeader}>
      <Text style={styles.h3}>{subSectionHeader}</Text>
      <View>{parse(data[subSection])}</View>
    </View>
  )
}

const CourseMemoContent = ({ data }) => {
  return (
    <View style={styles.contentContainer}>
      {sections.map(section => (
        <Section key={section.id} section={section} data={data} />
      ))}
    </View>
  )
}

export default CourseMemoContent
