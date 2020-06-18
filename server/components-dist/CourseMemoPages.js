"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

var _CourseMemoContent = _interopRequireDefault(require("./CourseMemoContent"));

var _CourseMemoPageHeader = _interopRequireDefault(require("./CourseMemoPageHeader"));

var _CourseMemoPageFooter = _interopRequireDefault(require("./CourseMemoPageFooter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable react/prop-types */
var styles = _renderer.StyleSheet.create({
  pages: {
    padding: '15mm',
    flexDirection: 'column'
  },
  header: {
    flexGrow: 0
  },
  content: {
    flexGrow: 1,
    padding: '10mm 0 10mm 0'
  },
  footer: {
    flexGrow: 0
  }
});
/* A4 is default page size value, explicitly set for clarity */


var CourseMemoPages = function CourseMemoPages(_ref) {
  var data = _ref.data;
  return /*#__PURE__*/_react["default"].createElement(_renderer.Page, {
    size: "A4",
    style: styles.pages
  }, /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    fixed: true,
    style: styles.header
  }, /*#__PURE__*/_react["default"].createElement(_CourseMemoPageHeader["default"], {
    data: data
  })), /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: styles.content
  }, /*#__PURE__*/_react["default"].createElement(_CourseMemoContent["default"], {
    data: data
  })), /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    fixed: true,
    style: styles.footer
  }, /*#__PURE__*/_react["default"].createElement(_CourseMemoPageFooter["default"], {
    data: data
  })));
};

var _default = CourseMemoPages;
exports["default"] = _default;