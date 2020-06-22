/* eslint-disable react/prop-types */
import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import parse, { domToReact } from 'html-react-parser'

const styles = StyleSheet.create({
  contentContainer: { fontFamily: 'Georgia', fontSize: '12pt' },
  h2: { fontFamily: 'Open Sans SemiBold', fontSize: '18pt', marginTop: '18pt', marginBottom: '9pt' }
})

const options = {
  replace: domNode => {
    if (domNode.type === 'tag' && domNode.name === 'ul') {
      return <View>{domToReact(domNode.children, options)}</View>
    }
    if (domNode.type === 'tag' && domNode.name === 'li') {
      return <View>{domToReact(domNode.children, options)}</View>
    }
    if (domNode.type === 'tag' && domNode.name === 'p') {
      return <View>{domToReact(domNode.children, options)}</View>
    }
    if (domNode.type === 'text') {
      return <Text>{domNode.data}</Text>
    }
    return <React.Fragment />
  }
}

const CourseMemoContent = ({ data }) => {
  const courseContent = parse(data.courseContent)
  const learningOutcomes = parse(data.learningOutcomes, options)
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.h2}>Course Content</Text>
      <Text>{courseContent}</Text>
      <Text style={styles.h2}>Learning Outcomes</Text>
      <Text>{learningOutcomes}</Text>
    </View>
  )
}

export default CourseMemoContent
