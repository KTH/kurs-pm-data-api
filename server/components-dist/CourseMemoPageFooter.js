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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var CourseMemoPageFooter = function CourseMemoPageFooter(_ref) {
  var data = _ref.data;
  var syllabusText = (0, _pdfUtils.concatSyllabusName)(data.syllabusValid, data.memoCommonLangAbbr);
  var courseMemoName = (0, _pdfUtils.concatMemoName)(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr);
  var version = "Version ".concat(data.version, " \u2014 ").concat((0, _pdfUtils.formatVersionDate)(data.memoCommonLangAbbr, data.lastChangeDate));
  var memoNameText = "".concat(data.courseCode, " - ").concat(courseMemoName, ", ").concat(version);
  return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: _CourseMemoStyles["default"].pageFooter
  }, /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: _CourseMemoStyles["default"].pageFooterLeft
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: _CourseMemoStyles["default"].italic,
    fixed: true
  }, syllabusText), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    fixed: true
  }, memoNameText)), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: _CourseMemoStyles["default"].pageFooterRight,
    render: function render(_ref2) {
      var pageNumber = _ref2.pageNumber,
          totalPages = _ref2.totalPages;
      return "\n".concat(pageNumber - 1, " (").concat(totalPages - 1, ")");
    },
    fixed: true
  }));
};

CourseMemoPageFooter.propTypes = {
  data: _CourseMemoPropTypes.data.isRequired
};
var _default = CourseMemoPageFooter;
exports["default"] = _default;