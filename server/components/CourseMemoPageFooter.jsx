/* eslint-disable react/prop-types */
import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  pageFooter: {
    borderTop: '1px solid black',
    paddingTop: '6pt'
  },
  pageNumber: {
    fontSize: '12pt',
    textAlign: 'right'
  }
})

const CourseMemoPageFooter = () => {
  return (
    <View style={styles.pageFooter}>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber - 1} (${totalPages - 1})`}
        fixed
      />
    </View>
  )
}

export default CourseMemoPageFooter
