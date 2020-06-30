"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _renderer = require("@react-pdf/renderer");

var styles = _renderer.StyleSheet.create({
  contentContainer: {
    fontFamily: 'Georgia',
    fontSize: '12pt'
  },
  h2: {
    fontFamily: 'Open Sans SemiBold',
    fontSize: 24,
    marginTop: 24,
    marginBottom: 0
  },
  h3: {
    fontFamily: 'Open Sans SemiBold',
    fontSize: 18,
    marginTop: 18,
    marginBottom: 6
  },
  h4: {
    fontFamily: 'Open Sans SemiBold',
    fontSize: 14,
    marginBottom: 3
  },
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
});

var _default = styles;
exports["default"] = _default;