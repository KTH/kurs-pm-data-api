'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.MyDocument = void 0

var _react = _interopRequireDefault(require('react'))

var _renderer = require('@react-pdf/renderer')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

/* eslint-disable import/prefer-default-export */
// Create styles
var styles = _renderer.StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
}) // Create Document Component

var MyDocument = function MyDocument() {
  return /*#__PURE__*/ _react['default'].createElement(
    _renderer.Document,
    null,
    /*#__PURE__*/ _react['default'].createElement(
      _renderer.Page,
      {
        size: 'A4',
        style: styles.page
      },
      /*#__PURE__*/ _react['default'].createElement(
        _renderer.View,
        {
          style: styles.section
        },
        /*#__PURE__*/ _react['default'].createElement(_renderer.Text, null, 'Section #1')
      ),
      /*#__PURE__*/ _react['default'].createElement(
        _renderer.View,
        {
          style: styles.section
        },
        /*#__PURE__*/ _react['default'].createElement(_renderer.Text, null, 'Section #2')
      )
    )
  )
}

exports.MyDocument = MyDocument
