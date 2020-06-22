/* eslint-disable react/prop-types */
import React from 'react'
import { View, Text, StyleSheet, Link } from '@react-pdf/renderer'
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
      return (
        <View>
          <Text>{`\n•`}</Text>
          {domToReact(domNode.children, options)}
        </View>
      )
    }
    if (domNode.type === 'tag' && domNode.name === 'p') {
      return <View>{domToReact(domNode.children, options)}</View>
    }
    if (domNode.type === 'tag' && domNode.name === 'a') {
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      return <Link src={domNode.attribs.href}>{domToReact(domNode.children, options)}</Link>
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
  const permanentDisability = parse(data.permanentDisability, options)
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.h2}>Course Content</Text>
      <Text>{courseContent}</Text>
      <Text style={styles.h2}>Learning Outcomes</Text>
      <Text>{learningOutcomes}</Text>
      <Text style={styles.h2}>Permanent Disability</Text>
      <Text>{permanentDisability}</Text>
    </View>
  )
}

export default CourseMemoContent
