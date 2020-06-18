'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports['default'] = void 0

var _react = _interopRequireDefault(require('react'))

var _renderer = require('@react-pdf/renderer')

var _pdfUtils = require('../lib/pdfUtils')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

/* eslint-disable react/prop-types */
_renderer.Font.register({
  family: 'Open Sans',
  src: 'server/fonts/OpenSans-Regular.ttf'
})

var styles = _renderer.StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    fontFamily: 'Open Sans'
  },
  logo: {
    height: '15mm',
    width: '15mm'
  },
  labelLeft: {
    width: '50%',
    textAlign: 'left'
  },
  labelRight: {
    width: '50%',
    textAlign: 'right'
  }
})

var CourseMemoPageHeader = function CourseMemoPageHeader(_ref) {
  var data = _ref.data
  var title = (0, _pdfUtils.concatMemoName)(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr)
  return /*#__PURE__*/ _react['default'].createElement(
    _renderer.View,
    {
      style: styles.pageHeader,
      fixed: true
    },
    /*#__PURE__*/ _react['default'].createElement(
      _renderer.View,
      {
        style: styles.labelLeft
      },
      /*#__PURE__*/ _react['default'].createElement(_renderer.Image, {
        style: styles.logo,
        src: 'server/img/KTH_Logotyp_RGB_2013.png'
      })
    ),
    /*#__PURE__*/ _react['default'].createElement(
      _renderer.View,
      {
        style: styles.labelRight
      },
      /*#__PURE__*/ _react['default'].createElement(_renderer.Text, null, title),
      /*#__PURE__*/ _react['default'].createElement(_renderer.Text, null, data.courseCode)
    )
  )
}

var _default = CourseMemoPageHeader
exports['default'] = _default
