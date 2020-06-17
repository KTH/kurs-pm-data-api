/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import React from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
})

// Create Document Component
export const MyDocument = ({ title }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{title}</Text>
      </View>
    </Page>
  </Document>
)
