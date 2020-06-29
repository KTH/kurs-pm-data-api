/* eslint-disable react/prop-types */
import React, { Fragment } from 'react'
import { View, Text, Link } from '@react-pdf/renderer'
import parse, { domToReact } from 'html-react-parser'

import styles from './CourseMemoStyles'

const htmlParseOptions = {
  replace: domNode => {
    if (domNode.name === 'ul') {
      return <View>{domToReact(domNode.children, htmlParseOptions)}</View>
    }
    if (domNode.name === 'li') {
      return (
        <Text>
          {/* TODO: Bullet and spacing should maybe be CSS instead */}
          {`\n• `}
          {domToReact(domNode.children, htmlParseOptions)}
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
              htmlParseOptions
            )}
          </View>
        )
      }
      return <Text>{domToReact(domNode.children, htmlParseOptions)}</Text>
    }
    if (domNode.name === 'a') {
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      return <Link src={domNode.attribs.href}>{domToReact(domNode.children, htmlParseOptions)}</Link>
    }
    if (domNode.name === 'img') {
      return <React.Fragment>{domToReact(domNode.children, htmlParseOptions)}</React.Fragment>
    }
    if (domNode.name === 'table') {
      return <View style={styles.table}>{domToReact(domNode.children, htmlParseOptions)}</View>
    }
    if (domNode.name === 'thead') {
      return <View style={styles.thead}>{domToReact(domNode.children, htmlParseOptions)}</View>
    }
    if (domNode.name === 'tbody') {
      return <View>{domToReact(domNode.children, htmlParseOptions)}</View>
    }
    if (domNode.name === 'tr') {
      return <View style={styles.tr}>{domToReact(domNode.children, htmlParseOptions)}</View>
    }
    if (domNode.name === 'th') {
      return <Text style={styles.th}>{domToReact(domNode.children, htmlParseOptions)}</Text>
    }
    if (domNode.name === 'td') {
      return <View style={styles.td}>{domToReact(domNode.children, htmlParseOptions)}</View>
    }
    if (domNode.type === 'text') {
      return <Text>{domNode.data}</Text>
    }
    return <Fragment />
  }
}

const htmlParser = html => {
  console.time('htmlParser: cleanHtml')
  const cleanHtml = html.replace(/\n/g, '')
  console.timeEnd('htmlParser: cleanHtml')
  console.time('htmlParser: parse')
  const parsedHtml = parse(cleanHtml, htmlParseOptions)
  console.timeEnd('htmlParser: parse')
  return parsedHtml
}

export default htmlParser
