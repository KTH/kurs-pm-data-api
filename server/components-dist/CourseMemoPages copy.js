'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports['default'] = void 0

var _react = _interopRequireDefault(require('react'))

var _renderer = require('@react-pdf/renderer')

var _CourseMemoContent = _interopRequireDefault(require('./CourseMemoContent'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

/* eslint-disable react/prop-types */
_renderer.Font.register({
  family: 'Open Sans',
  src: 'server/fonts/OpenSans-Regular.ttf'
})

_renderer.Font.register({
  family: 'Open Sans',
  src: 'server/fonts/OpenSans-Bold.ttf'
})

_renderer.Font.register({
  family: 'Georgia',
  src: 'server/fonts/Georgia.ttf'
})

var styles = _renderer.StyleSheet.create({
  pages: {
    fontFamily: 'Open Sans',
    fontSize: '12pt',
    padding: '15mm'
  },
  pageHeader: {
    display: 'flex',
    fontFamily: 'Open Sans'
  },
  logo: {
    height: '15mm',
    width: '15mm'
  },
  titleContainer: {
    top: '30mm'
  },
  title: {
    fontSize: '36pt'
  },
  infoContainer: {
    marginTop: '18pt',
    fontSize: '12pt'
  },
  subHeader: {
    marginTop: '6pt',
    fontWeight: 600
  }
})
/* A4 is default page size value, explicitly set for clarity */

var CourseMemoPages = function CourseMemoPages(_ref) {
  var data = _ref.data
  return /*#__PURE__*/ _react['default'].createElement(
    _renderer.Page,
    {
      size: 'A4',
      style: styles.pages
    },
    /*#__PURE__*/ _react['default'].createElement(
      _renderer.View,
      {
        style: styles.pageHeader,
        fixed: true
      },
      /*#__PURE__*/ _react['default'].createElement(_renderer.Image, {
        style: styles.logo,
        src: 'server/img/KTH_Logotyp_RGB_2013.png'
      }),
      /*#__PURE__*/ _react['default'].createElement(_renderer.Text, null, data.courseCode)
    ),
    /*#__PURE__*/ _react['default'].createElement(
      _renderer.View,
      null,
      /*#__PURE__*/ _react['default'].createElement(_renderer.Text, null, data.memoName)
    ),
    /*#__PURE__*/ _react['default'].createElement(_CourseMemoContent['default'], {
      data: data
    })
  )
}

var _default = CourseMemoPages
exports['default'] = _default
