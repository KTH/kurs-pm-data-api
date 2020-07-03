import React, { Profiler } from 'react'
import { View, Text } from '@react-pdf/renderer'

import parse from './CourseMemoHtmlParser'
import styles from './CourseMemoStyles'
import {
  data as propTypeData,
  section as propTypeSection,
  subSection as propTypeSubSection
} from './CourseMemoPropTypes'

const { getMessages, filterVisibible, profilerToLog } = require('../lib/pdfUtils')
const { EMPTY } = require('../lib/pdfConstants')
const { sections, context } = require('../lib/fieldsByType')

const Section = ({ section, data }) => {
  const sectionHeader = section.id
  const { sectionsLabels } = getMessages(data.memoCommonLangAbbr)
  const translatedSectionHeader = sectionsLabels[sectionHeader]
  const visibleSubSections = filterVisibible(section, data)
  const extraSubSections =
    section.extraHeaderTitle && Array.isArray(data[section.extraHeaderTitle]) ? data[section.extraHeaderTitle] : []

  if (visibleSubSections.length === 0 && extraSubSections.length === 0) {
    const langIndex = data.memoCommonLangAbbr === 'en' ? 0 : 1
    const contentHtml = EMPTY[langIndex]
    return (
      <View key={sectionHeader}>
        <Text style={styles.h2}>{translatedSectionHeader}</Text>
        <Text style={styles.emptySectionText}>{contentHtml}</Text>
      </View>
    )
  }

  return (
    <View key={sectionHeader}>
      <Text style={styles.h2}>{translatedSectionHeader}</Text>
      {visibleSubSections.map(subSection => (
        <SubSection key={subSection} subSection={subSection} data={data} />
      ))}
      {extraSubSections.map(extraSubSection => (
        <ExtraSubSection key={sectionHeader + extraSubSection.title} subSection={extraSubSection} />
      ))}
    </View>
  )
}

const SubSection = ({ subSection, data }) => {
  const subSectionHeader = subSection
  const { memoTitlesByMemoLang, sourceInfo } = getMessages(data.memoCommonLangAbbr)
  const translatedSubSectionHeader = memoTitlesByMemoLang[subSectionHeader]
  const translatedInsertedSubSectionText = sourceInfo.insertedSubSection
  let contentHtml = data[subSectionHeader]
  if (!contentHtml) {
    const { isRequired, type } = context[subSectionHeader]
    if (isRequired && (type === 'mandatory' || type === 'mandatoryAndEditable')) {
      const langIndex = data.memoCommonLangAbbr === 'en' ? 0 : 1
      contentHtml = EMPTY[langIndex]
    }
  }
  const isAddedSubSection =
    // eslint-disable-next-line react/destructuring-assignment
    context[subSectionHeader].hasParentTitle && subSectionHeader !== 'permanentDisabilitySubSection'
  const fromSyllabus = {
    // eslint-disable-next-line react/destructuring-assignment
    is: context[subSectionHeader].source === '(s)',
    subHeader: subSectionHeader === 'examination' || subSectionHeader === 'ethicalApproach'
  }
  return (
    <View key={subSectionHeader}>
      {isAddedSubSection && <Text style={styles.addedSubSection}>{translatedInsertedSubSectionText}</Text>}
      {translatedSubSectionHeader && (
        <Text style={styles.h3}>{`${translatedSubSectionHeader} ${fromSyllabus ? '*' : ''}`}</Text>
      )}
      <View>{parse(contentHtml)}</View>
    </View>
  )
}

const ExtraSubSection = ({ subSection }) => {
  if (!subSection.visibleInMemo) return null

  const subSectionHeader = subSection.title
  return (
    <View key={subSectionHeader.uKey}>
      <Text style={styles.h3}>{subSectionHeader}</Text>
      <View>{parse(subSection.htmlContent)}</View>
    </View>
  )
}

const CourseMemoContent = ({ data }) => {
  return (
    <View style={styles.contentContainer}>
      {sections.map(section => (
        <Profiler key={`profiler-${section.id}`} id={section.id} onRender={profilerToLog}>
          <Section key={section.id} section={section} data={data} />
        </Profiler>
      ))}
    </View>
  )
}

CourseMemoContent.propTypes = {
  data: propTypeData.isRequired
}

Section.propTypes = {
  section: propTypeSection.isRequired,
  data: propTypeData.isRequired
}

SubSection.propTypes = {
  subSection: propTypeSubSection.isRequired,
  data: propTypeData.isRequired
}

ExtraSubSection.propTypes = {
  subSection: propTypeSubSection.isRequired
}

export default CourseMemoContent
