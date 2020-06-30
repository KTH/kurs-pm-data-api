"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

var _i18n = _interopRequireDefault(require("../../i18n"));

var _pdfUtils = require("../lib/pdfUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable react/prop-types */
var styles = _renderer.StyleSheet.create({
  italic: {
    fontFamily: 'Open Sans Italic'
  },
  pageFooter: {
    fontFamily: 'Open Sans',
    fontSize: 12,
    flexDirection: 'row',
    borderTop: '1px solid black',
    paddingTop: '6pt'
  },
  pageNumberLeft: {
    flexGrow: 0,
    flexDirection: 'column',
    fontSize: 12,
    textAlign: 'left'
  },
  pageFooterRight: {
    flexGrow: 1,
    fontSize: 12,
    textAlign: 'right'
  }
});

var CourseMemoPageFooter = function CourseMemoPageFooter(_ref) {
  var data = _ref.data;
  var syllabusText = (0, _pdfUtils.concatSyllabusName)(data.memoCommonLangAbbr);
  var courseMemoName = (0, _pdfUtils.concatMemoName)(data.semester, data.ladokRoundIds, data.memoCommonLangAbbr);
  var version = "Ver ".concat(data.version, " ").concat((0, _pdfUtils.formatVersionDate)(data.memoCommonLangAbbr, data.lastChangeDate));
  var memoNameText = "".concat(data.courseCode, " - ").concat(courseMemoName, ", ").concat(version);
  return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: styles.pageFooter
  }, /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: styles.pageFooterLeft
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: styles.italic,
    fixed: true
  }, syllabusText), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    fixed: true
  }, memoNameText)), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: styles.pageFooterRight,
    render: function render(_ref2) {
      var pageNumber = _ref2.pageNumber,
          totalPages = _ref2.totalPages;
      return "\n".concat(pageNumber - 1, " (").concat(totalPages - 1, ")");
    },
    fixed: true
  }));
};

var _default = CourseMemoPageFooter;
exports["default"] = _default;