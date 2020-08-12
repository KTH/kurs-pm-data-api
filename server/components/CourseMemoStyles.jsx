import { Font, StyleSheet } from '@react-pdf/renderer'

import { pageMeasurements, typography } from '../lib/pdfConstants'

Font.register({ family: 'Open Sans', src: 'server/fonts/OpenSans-Regular.ttf' })
Font.register({ family: 'Open Sans Italic', src: 'server/fonts/OpenSans-Italic.ttf' })
Font.register({ family: 'Open Sans SemiBold', src: 'server/fonts/OpenSans-SemiBold.ttf' })
Font.register({ family: 'Open Sans Bold', src: 'server/fonts/OpenSans-Bold.ttf' })
Font.register({ family: 'Georgia', src: 'server/fonts/Georgia.ttf' })

const { A4 } = pageMeasurements

const styles = StyleSheet.create({
  contentContainer: { fontFamily: 'Georgia', fontSize: 13.552714304808, lineHeight: 1.563 },
  h2: { fontFamily: 'Open Sans SemiBold', fontSize: 22.587857, marginTop: 22.587857, marginBottom: 0 },
  h3: { fontFamily: 'Open Sans SemiBold', fontSize: 18.070286, marginTop: 18.070286, marginBottom: 6 },
  h4: { fontFamily: 'Open Sans SemiBold', fontSize: 15.058571, marginBottom: 3 },
  p: { paddingBottom: 12.046857 },
  ul: { paddingLeft: 12.046857 },
  li: { textIndent: -9, marginBottom: 3 },
  addedSubSection: {
    fontFamily: 'Open Sans',
    fontSize: 13.552714304808,
    lineHeight: 1.563,
    marginTop: 18,
    marginBottom: 6
  },
  table: {
    fontFamily: 'Open Sans',
    margin: 0,
    padding: 0,
    borderColor: '#65656c',
    borderTop: 1,
    borderBottom: 1,
    borderLeft: 1
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
    padding: 3,
    borderRight: 1,
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
  titleContainer: { marginTop: A4.crownDoubleAdjusted, marginLeft: A4.logotypeHalf, marginRight: A4.logotypeHalf },
  title: { fontFamily: typography.bold, fontSize: typography.h1 },
  subTitle: { fontFamily: typography.bold, fontSize: typography.h2 },
  version: { fontFamily: typography.regular, fontSize: typography.p, marginTop: 6 },
  infoContainer: { marginTop: '13mm' },
  infoHeader: { fontFamily: typography.bold, fontSize: typography.h4 },
  infoText: { marginTop: 3, marginBottom: 12, fontFamily: typography.regular, fontSize: typography.p },
  pages: {
    paddingTop: '20mm',
    paddingRight: '25mm',
    paddingBottom: '30mm',
    paddingLeft: '25mm'
  },
  content: { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
  footer: { position: 'absolute', right: '25mm', bottom: '10mm', width: '100%' },
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
