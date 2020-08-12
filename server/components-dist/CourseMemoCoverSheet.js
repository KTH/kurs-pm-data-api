"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

var _CourseMemoStyles = _interopRequireDefault(require("./CourseMemoStyles"));

var _CourseMemoPropTypes = require("./CourseMemoPropTypes");

var _pdfUtils = require("../lib/pdfUtils");

var _pdfConstants = require("../lib/pdfConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var CourseMemoCoverSheet = function CourseMemoCoverSheet(_ref) {
  var data = _ref.data;
  var courseTitle = data.courseTitle || _pdfConstants.NOT_AVAILABLE; // TODO: Remove and use name from API data when it is available
  // I.e. ”Course memo Autumn 2020-1”

  var courseMemoName = (0, _pdfUtils.concatMemoName)(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr); // ”Ver” string seems to be language agnostic

  var version = "Ver ".concat(data.version, " ").concat((0, _pdfUtils.formatVersionDate)(data.memoCommonLangAbbr, data.lastChangeDate));
  var language = _pdfConstants.LANGUAGE[data.memoCommonLangAbbr];
  var departmentName = data.departmentName || _pdfConstants.NOT_AVAILABLE;

  var _getMessages = (0, _pdfUtils.getMessages)(data.memoCommonLangAbbr),
      courseFactsLabels = _getMessages.courseFactsLabels;

  return (
    /*#__PURE__*/

    /* A4 is default page size value, explicitly set for clarity */
    _react["default"].createElement(_renderer.Page, {
      size: "A4",
      style: _CourseMemoStyles["default"].coverSheet
    }, /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      style: _CourseMemoStyles["default"].coverSheetContainer
    }, /*#__PURE__*/_react["default"].createElement(_renderer.Image, {
      style: _CourseMemoStyles["default"].logotype,
      src: _pdfConstants.logotypePath
    }), /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      style: _CourseMemoStyles["default"].titleContainer
    }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: _CourseMemoStyles["default"].title
    }, courseTitle), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: _CourseMemoStyles["default"].subTitle
    }, courseMemoName), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: _CourseMemoStyles["default"].version
    }, version), /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      style: _CourseMemoStyles["default"].infoContainer
    }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: _CourseMemoStyles["default"].infoHeader
    }, courseFactsLabels.roundsTitle), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: _CourseMemoStyles["default"].infoText
    }, data.memoName), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: _CourseMemoStyles["default"].infoHeader
    }, courseFactsLabels.languageOfInstructionTitle), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: _CourseMemoStyles["default"].infoText
    }, language), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: _CourseMemoStyles["default"].infoHeader
    }, courseFactsLabels.offeredByTitle), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: _CourseMemoStyles["default"].infoText
    }, departmentName)))))
  );
};

CourseMemoCoverSheet.propTypes = {
  data: _CourseMemoPropTypes.data.isRequired
};
var _default = CourseMemoCoverSheet;
exports["default"] = _default;