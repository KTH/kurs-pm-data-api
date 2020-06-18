"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

var _pdfUtils = require("../lib/pdfUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable react/prop-types */
var styles = _renderer.StyleSheet.create({
  contentContainer: {
    fontFamily: 'Georgia',
    fontSize: '12pt'
  },
  h2: {
    fontFamily: 'Open Sans SemiBold',
    fontSize: '18pt',
    marginBottom: '9pt'
  }
});

var CourseMemoContent = function CourseMemoContent(_ref) {
  var data = _ref.data;
  return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: styles.contentContainer
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: styles.h2
  }, "Course Content"), /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, (0, _pdfUtils.decodeHtml)(data.courseContent)));
};

var _default = CourseMemoContent;
exports["default"] = _default;