"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _renderer = require("@react-pdf/renderer");

var _CourseMemoHtmlParser = _interopRequireDefault(require("./CourseMemoHtmlParser"));

var _CourseMemoStyles = _interopRequireDefault(require("./CourseMemoStyles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable react/prop-types */
var _require = require('../lib/pdfUtils'),
    getMessages = _require.getMessages,
    filterVisibible = _require.filterVisibible,
    profilerToLog = _require.profilerToLog;

var _require2 = require('../lib/pdfConstants'),
    EMPTY = _require2.EMPTY;

var _require3 = require('../lib/fieldsByType'),
    sections = _require3.sections,
    context = _require3.context;

var Section = function Section(_ref) {
  var section = _ref.section,
      data = _ref.data;
  var sectionHeader = section.id;

  var _getMessages = getMessages(data.memoCommonLangAbbr),
      sectionsLabels = _getMessages.sectionsLabels;

  var translatedSectionHeader = sectionsLabels[sectionHeader];
  var visibleSubSections = filterVisibible(section, data);
  var extraSubSections = section.extraHeaderTitle && Array.isArray(data[section.extraHeaderTitle]) ? data[section.extraHeaderTitle] : [];

  if (visibleSubSections.length === 0 && extraSubSections.length === 0) {
    var langIndex = data.memoCommonLangAbbr === 'en' ? 0 : 1;
    var contentHtml = EMPTY[langIndex];
    return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      key: sectionHeader
    }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: _CourseMemoStyles["default"].h2
    }, translatedSectionHeader), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: {
        marginTop: 18
      }
    }, contentHtml));
  }

  return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    key: sectionHeader
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: _CourseMemoStyles["default"].h2
  }, translatedSectionHeader), visibleSubSections.map(function (subSection) {
    return /*#__PURE__*/_react["default"].createElement(SubSection, {
      key: subSection,
      subSection: subSection,
      data: data
    });
  }), extraSubSections.map(function (extraSubSection) {
    return /*#__PURE__*/_react["default"].createElement(ExtraSubSection, {
      key: sectionHeader + extraSubSection.title,
      subSection: extraSubSection
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
  var contentHtml = data[subSection];

  if (!contentHtml) {
    var _context$subSection = context[subSection],
        isRequired = _context$subSection.isRequired,
        type = _context$subSection.type;

    if (isRequired && (type === 'mandatory' || type === 'mandatoryAndEditable')) {
      var langIndex = data.memoCommonLangAbbr === 'en' ? 0 : 1;
      contentHtml = EMPTY[langIndex];
    }
  }

  return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    key: subSectionHeader
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: _CourseMemoStyles["default"].h3
  }, translatedSubSectionHeader), /*#__PURE__*/_react["default"].createElement(_renderer.View, null, (0, _CourseMemoHtmlParser["default"])(contentHtml)));
};

var ExtraSubSection = function ExtraSubSection(_ref3) {
  var subSection = _ref3.subSection;
  if (!subSection.visibleInMemo) return null;
  var subSectionHeader = subSection.title;
  return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    key: subSectionHeader.uKey
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: _CourseMemoStyles["default"].h3
  }, subSectionHeader), /*#__PURE__*/_react["default"].createElement(_renderer.View, null, (0, _CourseMemoHtmlParser["default"])(subSection.htmlContent)));
};

var CourseMemoContent = function CourseMemoContent(_ref4) {
  var data = _ref4.data;
  return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: _CourseMemoStyles["default"].contentContainer
  }, sections.map(function (section) {
    return /*#__PURE__*/_react["default"].createElement(_react.Profiler, {
      key: "profiler-".concat(section.id),
      id: section.id,
      onRender: profilerToLog
    }, /*#__PURE__*/_react["default"].createElement(Section, {
      key: section.id,
      section: section,
      data: data
    }));
  }));
};

var _default = CourseMemoContent;
exports["default"] = _default;