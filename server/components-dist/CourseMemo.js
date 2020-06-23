"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _CourseMemoDocument = _interopRequireDefault(require("./CourseMemoDocument"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable react/prop-types */

/*
  Course Memo Components Overview
  - CourseMemo
    - CourseMemoDocument
      - CourseMemoCoverSheet
      - CourseMemoPages
        - CourseMemoPageHeader
        - CourseMemoContent
        - CourseMemoPageFooter
*/
var CourseMemo = function CourseMemo(_ref) {
  var data = _ref.data;
  return /*#__PURE__*/_react["default"].createElement(_CourseMemoDocument["default"], {
    data: data
  });
};

var _default = CourseMemo;
exports["default"] = _default;