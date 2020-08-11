"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _renderer = require("@react-pdf/renderer");

var _pdfConstants = require("../lib/pdfConstants");

_renderer.Font.register({
  family: 'Open Sans',
  src: 'server/fonts/OpenSans-Regular.ttf'
});

_renderer.Font.register({
  family: 'Open Sans Italic',
  src: 'server/fonts/OpenSans-Italic.ttf'
});

_renderer.Font.register({
  family: 'Open Sans SemiBold',
  src: 'server/fonts/OpenSans-SemiBold.ttf'
});

_renderer.Font.register({
  family: 'Open Sans Bold',
  src: 'server/fonts/OpenSans-Bold.ttf'
});

_renderer.Font.register({
  family: 'Georgia',
  src: 'server/fonts/Georgia.ttf'
});

var A4 = _pdfConstants.pageMeasurements.A4;

var styles = _renderer.StyleSheet.create({
  contentContainer: {
    fontFamily: 'Georgia',
    fontSize: 13.552714304808,
    lineHeight: 1.563
  },
  h2: {
    fontFamily: 'Open Sans SemiBold',
    fontSize: 22.587857,
    marginTop: 22.587857,
    marginBottom: 0
  },
  h3: {
    fontFamily: 'Open Sans SemiBold',
    fontSize: 18.070286,
    marginTop: 18.070286,
    marginBottom: 6
  },
  h4: {
    fontFamily: 'Open Sans SemiBold',
    fontSize: 15.058571,
    marginBottom: 3
  },
  p: {
    paddingBottom: 12.046857
  },
  ul: {
    paddingLeft: 12.046857
  },
  li: {
    textIndent: -9,
    marginBottom: 3
  },
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
  coverSheet: {
    padding: A4.pageMargin
  },
  coverSheetContainer: {
    height: '100%',
    borderBottom: '1 solid #1954A6'
  },
  logotype: {
    height: A4.logotype,
    width: A4.logotype
  },
  titleContainer: {
    marginTop: A4.crownDoubleAdjusted,
    marginLeft: A4.logotypeHalf,
    marginRight: A4.logotypeHalf
  },
  title: {
    fontFamily: _pdfConstants.typography.bold,
    fontSize: _pdfConstants.typography.h1
  },
  subTitle: {
    fontFamily: _pdfConstants.typography.bold,
    fontSize: _pdfConstants.typography.h2
  },
  version: {
    fontFamily: _pdfConstants.typography.regular,
    fontSize: _pdfConstants.typography.p,
    marginTop: 6
  },
  infoContainer: {
    marginTop: '13mm'
  },
  infoHeader: {
    fontFamily: _pdfConstants.typography.bold,
    fontSize: _pdfConstants.typography.h4
  },
  infoText: {
    marginTop: 3,
    marginBottom: 12,
    fontFamily: _pdfConstants.typography.regular,
    fontSize: _pdfConstants.typography.p
  },
  pages: {
    padding: A4.pageMargin,
    flexDirection: 'column'
  },
  header: {
    flexGrow: 0
  },
  content: {
    flexGrow: 1,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 18,
    paddingLeft: 0
  },
  footer: {
    flexGrow: 0
  },
  emptySectionText: {
    marginTop: 18
  },
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
});

var _default = styles;
exports["default"] = _default;