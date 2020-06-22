"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CourseMemo = void 0;

var _react = _interopRequireDefault(require("react"));

var _CourseMemoDocument = _interopRequireDefault(require("./CourseMemoDocument"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable react/prop-types */

/* eslint-disable import/prefer-default-export */

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

exports.CourseMemo = CourseMemo;