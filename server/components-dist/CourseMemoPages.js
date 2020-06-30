"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _renderer = require("@react-pdf/renderer");

var _CourseMemoContent = _interopRequireDefault(require("./CourseMemoContent"));

var _CourseMemoPageFooter = _interopRequireDefault(require("./CourseMemoPageFooter"));

var _pdfUtils = require("../lib/pdfUtils");

var _pdfConstants = require("../lib/pdfConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable react/prop-types */
// import CourseMemoPageHeader from './CourseMemoPageHeader'
var A4 = _pdfConstants.pageMeasurements.A4;

var styles = _renderer.StyleSheet.create({
  pages: {
    padding: A4.pageMargin,
    flexDirection: 'column'
  },
  header: {
    flexGrow: 0
  },
  // content: { flexGrow: 1, padding: '10mm 0 10mm 0' },
  content: {
    flexGrow: 1,
    padding: '0 0 10mm 0'
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
  }, /*#__PURE__*/_react["default"].createElement(_react.Profiler, {
    id: "CourseMemoContent",
    onRender: _pdfUtils.profilerToLog
  }, /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: styles.content
  }, /*#__PURE__*/_react["default"].createElement(_CourseMemoContent["default"], {
    data: data
  }))), /*#__PURE__*/_react["default"].createElement(_react.Profiler, {
    id: "CourseMemoPageFooter",
    onRender: _pdfUtils.profilerToLog
  }, /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    fixed: true,
    style: styles.footer
  }, /*#__PURE__*/_react["default"].createElement(_CourseMemoPageFooter["default"], {
    data: data
  }))));
};

var _default = CourseMemoPages;
exports["default"] = _default;