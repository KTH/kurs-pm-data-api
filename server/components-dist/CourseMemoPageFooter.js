"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable react/prop-types */
var styles = _renderer.StyleSheet.create({
  pageFooter: {
    borderTop: '1px solid black',
    paddingTop: '6pt'
  },
  pageNumber: {
    fontSize: '12pt',
    textAlign: 'right'
  }
});

var CourseMemoPageFooter = function CourseMemoPageFooter() {
  return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: styles.pageFooter
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: styles.pageNumber,
    render: function render(_ref) {
      var pageNumber = _ref.pageNumber,
          totalPages = _ref.totalPages;
      return "".concat(pageNumber - 1, " (").concat(totalPages - 1, ")");
    },
    fixed: true
  }));
};

var _default = CourseMemoPageFooter;
exports["default"] = _default;