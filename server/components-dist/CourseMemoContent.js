"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

var _htmlReactParser = _interopRequireWildcard(require("html-react-parser"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable react/prop-types */
var styles = _renderer.StyleSheet.create({
  contentContainer: {
    fontFamily: 'Georgia',
    fontSize: '12pt'
  },
  h2: {
    fontFamily: 'Open Sans SemiBold',
    fontSize: '18pt',
    marginTop: '18pt',
    marginBottom: '9pt'
  }
});

var options = {
  replace: function replace(domNode) {
    if (domNode.type === 'tag' && domNode.name === 'ul') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, null, (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.type === 'tag' && domNode.name === 'li') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, null, /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, "\n\u2022"), (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.type === 'tag' && domNode.name === 'p') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, null, (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.type === 'tag' && domNode.name === 'a') {
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      return /*#__PURE__*/_react["default"].createElement(_renderer.Link, {
        src: domNode.attribs.href
      }, (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.type === 'text') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, domNode.data);
    }

    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null);
  }
};

var CourseMemoContent = function CourseMemoContent(_ref) {
  var data = _ref.data;
  var courseContent = (0, _htmlReactParser["default"])(data.courseContent);
  var learningOutcomes = (0, _htmlReactParser["default"])(data.learningOutcomes, options);
  var permanentDisability = (0, _htmlReactParser["default"])(data.permanentDisability, options);
  return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
    style: styles.contentContainer
  }, /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: styles.h2
  }, "Course Content"), /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, courseContent), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: styles.h2
  }, "Learning Outcomes"), /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, learningOutcomes), /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
    style: styles.h2
  }, "Permanent Disability"), /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, permanentDisability));
};

var _default = CourseMemoContent;
exports["default"] = _default;