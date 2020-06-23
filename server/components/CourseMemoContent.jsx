/* eslint-disable react/prop-types */
import React, { Fragment } from 'react'
import { View, Text, StyleSheet, Link } from '@react-pdf/renderer'
import parse, { domToReact } from 'html-react-parser'

const styles = StyleSheet.create({
  contentContainer: { fontFamily: 'Georgia', fontSize: '12pt' },
  h2: { fontFamily: 'Open Sans SemiBold', fontSize: '18pt', marginTop: '18pt', marginBottom: '9pt' },
  table: {
    fontFamily: 'Open Sans',
    margin: 0,
    padding: 0,
    borderColor: '#65656c',
    borderTop: '1pt',
    borderBottom: '1pt',
    borderLeft: '1pt'
  },
  thead: {
    color: 'white',
    margin: 0,
    padding: 0,
    backgroundColor: '#65656c'
  },
  tr: {
    margin: 0,
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  th: {
    margin: 0,
    padding: '3pt',
    borderRight: '1pt',
    borderRightColor: '#65656c',
    flexBasis: 0,
    flexGrow: 1
  },
  td: {
    margin: 0,
    padding: '3pt',
    borderRight: '1pt',
    borderRightColor: 'black',
    flexBasis: 0,
    flexGrow: 1
  }
})

const options = {
  replace: domNode => {
    if (domNode.name === 'ul') {
      return <View>{domToReact(domNode.children, options)}</View>
    }
    if (domNode.name === 'li') {
      return (
        <Text>
          {/* TODO: Bullet and spacing should maybe be CSS instead */}
          {`\n• `}
          {domToReact(domNode.children, options)}
        </Text>
      )
    }
    if (domNode.name === 'p') {
      // Handle contacts
      if (domNode.attribs.class === 'person') {
        return (
          <View>
            {domToReact(
              domNode.children.filter(c => c.type === 'tag' && c.name === 'a'),
              options
            )}
          </View>
        )
      }
      return <Text>{domToReact(domNode.children, options)}</Text>
    }
    if (domNode.name === 'a') {
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      return <Link src={domNode.attribs.href}>{domToReact(domNode.children, options)}</Link>
    }
    if (domNode.name === 'img') {
      return <React.Fragment>{domToReact(domNode.children, options)}</React.Fragment>
    }
    if (domNode.name === 'table') {
      return <View style={styles.table}>{domToReact(domNode.children, options)}</View>
    }
    if (domNode.name === 'thead') {
      return <View style={styles.thead}>{domToReact(domNode.children, options)}</View>
    }
    if (domNode.name === 'tbody') {
      return <View>{domToReact(domNode.children, options)}</View>
    }
    if (domNode.name === 'tr') {
      return <View style={styles.tr}>{domToReact(domNode.children, options)}</View>
    }
    if (domNode.name === 'th') {
      return <Text style={styles.th}>{domToReact(domNode.children, options)}</Text>
    }
    if (domNode.name === 'td') {
      return <View style={styles.td}>{domToReact(domNode.children, options)}</View>
    }
    if (domNode.type === 'text') {
      return <Text>{domNode.data}</Text>
    }
    return <Fragment />
  }
}

const CourseMemoContent = ({ data }) => {
  const courseContent = parse(data.courseContent.replace(/\n/g, ''), options)
  const learningOutcomes = parse(data.learningOutcomes.replace(/\n/g, ''), options)
  const permanentDisability = parse(data.permanentDisability.replace(/\n/g, ''), options)
  const examiner = parse(data.examiner.replace(/\n/g, ''), options)
  const scheduleDetails = parse(data.scheduleDetails.replace(/\n/g, ''), options)
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
