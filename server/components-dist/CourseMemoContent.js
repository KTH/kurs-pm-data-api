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
var _require = require('../lib/pdfUtils'),
    getMessages = _require.getMessages;

var _require2 = require('../lib/pdfConstants'),
    sections = _require2.sections;

var Section = function Section(_ref) {
  var section = _ref.section,
      data = _ref.data;
  var sectionHeader = section.id;

  var _getMessages = getMessages(data.memoCommonLangAbbr),
      sectionsLabels = _getMessages.sectionsLabels;

  var translatedSectionHeader = sectionsLabels[sectionHeader];
  return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    key: sectionHeader
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: _CourseMemoStyles["default"].h2
  }, translatedSectionHeader), section.content.map(function (subSection) {
    return /*#__PURE__*/_react["default"].createElement(SubSection, {
      key: subSection,
      subSection: subSection,
      data: data
    });
  }));
};

var SubSection = function SubSection(_ref2) {
  var subSection = _ref2.subSection,
      data = _ref2.data;
  var subSectionHeader = subSection;

  var _getMessages2 = getMessages(data.memoCommonLangAbbr),
      memoTitlesByMemoLang = _getMessages2.memoTitlesByMemoLang;

  var translatedSubSectionHeader = memoTitlesByMemoLang[subSectionHeader];
  return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    key: subSectionHeader
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: _CourseMemoStyles["default"].h3
  }, translatedSubSectionHeader), /*#__PURE__*/_react["default"].createElement(_renderer.View, null, (0, _CourseMemoHtmlParser["default"])(data[subSection])));
};

var CourseMemoContent = function CourseMemoContent(_ref3) {
  var data = _ref3.data;
  return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: _CourseMemoStyles["default"].contentContainer
  }, sections.map(function (section) {
    return /*#__PURE__*/_react["default"].createElement(Section, {
      key: section.id,
      section: section,
      data: data
    });
  }));
};

var _default = CourseMemoContent;
exports["default"] = _default;