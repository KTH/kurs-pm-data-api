"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

var _CourseMemoCoverSheet = _interopRequireDefault(require("./CourseMemoCoverSheet"));

var _CourseMemoPages = _interopRequireDefault(require("./CourseMemoPages"));

var _pdfUtils = require("../lib/pdfUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable react/prop-types */
_renderer.Font.register({
  family: 'Open Sans',
  src: 'server/fonts/OpenSans-Regular.ttf'
});

_renderer.Font.register({
  family: 'Open Sans SemiBold',
  src: 'server/fonts/OpenSans-SemiBold.ttf'
});

_renderer.Font.register({
  family: 'Georgia',
  src: 'server/fonts/Georgia.ttf'
});

var CourseMemoDocument = function CourseMemoDocument(_ref) {
  var data = _ref.data;
  var title = (0, _pdfUtils.concatMemoName)(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr);
  return /*#__PURE__*/_react["default"].createElement(_renderer.Document, {
    title: title,
    author: "KTH"
  }, /*#__PURE__*/_react["default"].createElement(_CourseMemoCoverSheet["default"], {
    data: data
  }), /*#__PURE__*/_react["default"].createElement(_CourseMemoPages["default"], {
    data: data
  }));
};

var _default = CourseMemoDocument;
exports["default"] = _default;