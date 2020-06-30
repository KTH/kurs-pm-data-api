"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

var _pdfUtils = require("../lib/pdfUtils");

var _pdfConstants = require("../lib/pdfConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable react/prop-types */
var A4 = _pdfConstants.pageMeasurements.A4;

var styles = _renderer.StyleSheet.create({
  coverSheet: {
    padding: A4.pageMargin
  },
  coverSheetContainer: {
    height: '100%',
    borderBottom: '1 solid #1954A6'
  },
  logotype: {
    height: A4.logotype,
    width: A4.logotype
  },
  titleContainer: {
    marginTop: A4.crownDoubleAdjusted,
    marginLeft: A4.logotypeHalf
  },
  title: {
    fontFamily: _pdfConstants.typography.bold,
    fontSize: _pdfConstants.typography.h1
  },
  subTitle: {
    fontFamily: _pdfConstants.typography.bold,
    fontSize: _pdfConstants.typography.h2
  },
  version: {
    fontFamily: _pdfConstants.typography.regular,
    fontSize: _pdfConstants.typography.p,
    marginTop: 6
  },
  infoContainer: {
    marginTop: '13mm'
  },
  infoHeader: {
    fontFamily: _pdfConstants.typography.bold,
    fontSize: _pdfConstants.typography.h4
  },
  infoText: {
    marginTop: 6,
    marginBottom: 12,
    fontFamily: _pdfConstants.typography.regular,
    fontSize: _pdfConstants.typography.p
  }
});

var CourseMemoCoverSheet = function CourseMemoCoverSheet(_ref) {
  var data = _ref.data;
  // TODO: Remove and use data from API when it is availabe
  // MJ2462 Achieving Energy Efficiency in Existing Buildings 6 credits
  var courseName = "".concat(data.courseCode, "\n").concat(data.title ? data.title : '', " ").concat((0, _pdfUtils.formatCredits)(data.credits, data.creditUnitAbbr, data.memoCommonLangAbbr)); // TODO: Remove and use name from API data when it is available
  // I.e. ”Course memo Autumn 2020-1”

  var courseMemoName = (0, _pdfUtils.concatMemoName)(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr); // ”Ver” string seems to be language agnostic

  var version = "Ver ".concat(data.version, " ").concat((0, _pdfUtils.formatVersionDate)(data.memoCommonLangAbbr, data.lastChangeDate));
  return (
    /*#__PURE__*/

    /* A4 is default page size value, explicitly set for clarity */
    _react["default"].createElement(_renderer.Page, {
      size: "A4",
      style: styles.coverSheet
    }, /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      style: styles.coverSheetContainer
    }, /*#__PURE__*/_react["default"].createElement(_renderer.Image, {
      style: styles.logotype,
      src: _pdfConstants.logotypePath
    }), /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      style: styles.titleContainer
    }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: styles.title
    }, courseName), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: styles.subTitle
    }, courseMemoName), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: styles.version
    }, version), /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      style: styles.infoContainer
    }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: styles.infoHeader
    }, "Kursomg\xE5ng"), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: styles.infoText
    }, data.memoName), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: styles.infoHeader
    }, "Undervisningsspr\xE5k"), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: styles.infoText
    }, data.memoCommonLangAbbr === 'en' ? 'English' : 'Svenska'), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: styles.infoHeader
    }, "Kursen ges av"), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: styles.infoText
    }, data.departmentName ? data.departmentName : '')))))
  );
};

var _default = CourseMemoCoverSheet;
exports["default"] = _default;