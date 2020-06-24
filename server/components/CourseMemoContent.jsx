/* eslint-disable react/prop-types */
import React from 'react'
import { View, Text } from '@react-pdf/renderer'

import parse from './CourseMemoHtmlParser'
import styles from './CourseMemoStyles'

const { getMessages } = require('../lib/pdfUtils')
const { sections } = require('../lib/pdfConstants')

const Section = ({ section, data }) => {
  const sectionHeader = section.id
  const { sectionsLabels } = getMessages(data.memoCommonLangAbbr)
  const translatedSectionHeader = sectionsLabels[sectionHeader]
  return (
    <View key={sectionHeader}>
      <Text style={styles.h2}>{translatedSectionHeader}</Text>
      {section.content.map(subSection => (
        <SubSection key={subSection} subSection={subSection} data={data} />
      ))}
    </View>
  )
}

const SubSection = ({ subSection, data }) => {
  const subSectionHeader = subSection
  const { memoTitlesByMemoLang } = getMessages(data.memoCommonLangAbbr)
  const translatedSubSectionHeader = memoTitlesByMemoLang[subSectionHeader]
  return (
    <View key={subSectionHeader}>
      <Text style={styles.h3}>{translatedSubSectionHeader}</Text>
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
