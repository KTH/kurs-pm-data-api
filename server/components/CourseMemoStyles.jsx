import { Font, StyleSheet } from '@react-pdf/renderer'

import { pageMeasurements, typography } from '../lib/pdfConstants'

Font.register({ family: 'Open Sans', src: 'server/fonts/OpenSans-Regular.ttf' })
Font.register({ family: 'Open Sans Italic', src: 'server/fonts/OpenSans-Italic.ttf' })
Font.register({ family: 'Open Sans SemiBold', src: 'server/fonts/OpenSans-SemiBold.ttf' })
Font.register({ family: 'Open Sans Bold', src: 'server/fonts/OpenSans-Bold.ttf' })
Font.register({ family: 'Georgia', src: 'server/fonts/Georgia.ttf' })

const { A4 } = pageMeasurements

const styles = StyleSheet.create({
  contentContainer: { fontFamily: 'Georgia', fontSize: '12pt' },
  h2: { fontFamily: 'Open Sans SemiBold', fontSize: 24, marginTop: 24, marginBottom: 0 },
  h3: { fontFamily: 'Open Sans SemiBold', fontSize: 18, marginTop: 18, marginBottom: 6 },
  h4: { fontFamily: 'Open Sans SemiBold', fontSize: 14, marginBottom: 3 },
  addedSubSection: { fontFamily: 'Open Sans', fontSize: 12, marginTop: 18, marginBottom: 6 },
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
  },
  coverSheet: { padding: A4.pageMargin },
  coverSheetContainer: { height: '100%', borderBottom: '1 solid #1954A6' },
  logotype: { height: A4.logotype, width: A4.logotype },
  titleContainer: { marginTop: A4.crownDoubleAdjusted, marginLeft: A4.logotypeHalf },
  title: { fontFamily: typography.bold, fontSize: typography.h1 },
  subTitle: { fontFamily: typography.bold, fontSize: typography.h2 },
  version: { fontFamily: typography.regular, fontSize: typography.p, marginTop: 6 },
  infoContainer: { marginTop: '13mm' },
  infoHeader: { fontFamily: typography.bold, fontSize: typography.h4 },
  infoText: { marginTop: 6, marginBottom: 12, fontFamily: typography.regular, fontSize: typography.p },
  pages: { padding: A4.pageMargin, flexDirection: 'column' },
  header: { flexGrow: 0 },
  content: { flexGrow: 1, padding: '0 0 10mm 0' },
  footer: { flexGrow: 0 },
  emptySectionText: { marginTop: 18 },
  italic: {
    fontFamily: 'Open Sans Italic'
  },
  pageFooter: {
    fontFamily: 'Open Sans',
    fontSize: 12,
    flexDirection: 'row',
    borderTop: '1px solid black',
    paddingTop: '6pt'
  },
  pageNumberLeft: {
    flexGrow: 0,
    flexDirection: 'column',
    fontSize: 12,
    textAlign: 'left'
  },
  pageFooterRight: {
    flexGrow: 1,
    fontSize: 12,
    textAlign: 'right'
  }
})

export default styles
