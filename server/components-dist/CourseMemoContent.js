"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

var _CourseMemoHtmlParser = _interopRequireDefault(require("./CourseMemoHtmlParser"));

var _CourseMemoStyles = _interopRequireDefault(require("./CourseMemoStyles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable react/prop-types */
// TODO: Cleanup and only iterate over content here
var CourseMemoContent = function CourseMemoContent(_ref) {
  var data = _ref.data;
  var courseContent = (0, _CourseMemoHtmlParser["default"])(data.courseContent);
  var learningOutcomes = (0, _CourseMemoHtmlParser["default"])(data.learningOutcomes);
  var permanentDisability = (0, _CourseMemoHtmlParser["default"])(data.permanentDisability);
  var examiner = (0, _CourseMemoHtmlParser["default"])(data.examiner);
  var scheduleDetails = (0, _CourseMemoHtmlParser["default"])(data.scheduleDetails);
  return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: _CourseMemoStyles["default"].contentContainer
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: _CourseMemoStyles["default"].h2
  }, "Course Content"), /*#__PURE__*/_react["default"].createElement(_renderer.View, null, courseContent), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: _CourseMemoStyles["default"].h2
  }, "Learning Outcomes"), /*#__PURE__*/_react["default"].createElement(_renderer.View, null, learningOutcomes), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: _CourseMemoStyles["default"].h2
  }, "Permanent Disability"), /*#__PURE__*/_react["default"].createElement(_renderer.View, null, permanentDisability), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: _CourseMemoStyles["default"].h2
  }, "Examiner"), /*#__PURE__*/_react["default"].createElement(_renderer.View, null, examiner), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: _CourseMemoStyles["default"].h2
  }, "Schedule Details"), /*#__PURE__*/_react["default"].createElement(_renderer.View, null, scheduleDetails));
};

var _default = CourseMemoContent;
exports["default"] = _default;