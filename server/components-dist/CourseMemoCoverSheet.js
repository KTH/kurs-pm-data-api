"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

var _pdfUtils = require("../lib/pdfUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable react/prop-types */
var styles = _renderer.StyleSheet.create({
  coverSheet: {
    padding: '15mm'
  },
  logo: {
    height: '30mm',
    width: '30mm'
  },
  titleContainer: {
    top: '30mm',
    marginLeft: '15mm'
  },
  title: {
    fontSize: '36pt'
  },
  subTitle: {
    fontSize: '18pt'
  },
  infoContainer: {
    marginTop: '18pt',
    fontSize: '12pt'
  },
  infoHeader: {
    marginTop: '6pt',
    fontFamily: 'Open Sans SemiBold'
  }
});
/* A4 is default page size value, explicitly set for clarity */


var CourseMemoCoverSheet = function CourseMemoCoverSheet(_ref) {
  var data = _ref.data;
  var title = (0, _pdfUtils.concatMemoName)(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr);
  return /*#__PURE__*/_react["default"].createElement(_renderer.Page, {
    size: "A4",
    style: styles.coverSheet
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Image, {
    style: styles.logo,
    src: "server/img/KTH_Logotyp_RGB_2013.png"
  }), /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: styles.titleContainer
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: styles.title
  }, title), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: styles.subTitle
  }, data.courseCode), /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: styles.infoContainer
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: styles.infoHeader
  }, "Kursen ges av"), /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, "N/A"), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: styles.infoHeader
  }, "Undervisningsspr\xE5k"), /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, data.memoCommonLangAbbr === 'en' ? 'English' : 'Svenska'), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: styles.infoHeader
  }, "Kursomg\xE5ng"), /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, data.memoName))));
};

var _default = CourseMemoCoverSheet;
exports["default"] = _default;