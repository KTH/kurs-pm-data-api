"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _renderer = require("@react-pdf/renderer");

var _CourseMemoCoverSheet = _interopRequireDefault(require("./CourseMemoCoverSheet"));

var _CourseMemoPages = _interopRequireDefault(require("./CourseMemoPages"));

var _CourseMemoPropTypes = require("./CourseMemoPropTypes");

var _pdfUtils = require("../lib/pdfUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var CourseMemoDocument = function CourseMemoDocument(_ref) {
  var data = _ref.data;
  var title = (0, _pdfUtils.concatMemoName)(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr);
  return /*#__PURE__*/_react["default"].createElement(_react.Profiler, {
    id: "CourseMemoDocument",
    onRender: _pdfUtils.profilerToLog
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Document, {
    title: title,
    author: "KTH",
    onRender: (0, _pdfUtils.timer)('CourseMemoDocument', Date.now())
  }, /*#__PURE__*/_react["default"].createElement(_react.Profiler, {
    id: "CourseMemoCoverSheet",
    onRender: _pdfUtils.profilerToLog
  }, /*#__PURE__*/_react["default"].createElement(_CourseMemoCoverSheet["default"], {
    data: data
  })), /*#__PURE__*/_react["default"].createElement(_react.Profiler, {
    id: "CourseMemoPages",
    onRender: _pdfUtils.profilerToLog
  }, /*#__PURE__*/_react["default"].createElement(_CourseMemoPages["default"], {
    data: data
  }))));
};

CourseMemoDocument.propTypes = {
  data: _CourseMemoPropTypes.data.isRequired
};
var _default = CourseMemoDocument;
exports["default"] = _default;