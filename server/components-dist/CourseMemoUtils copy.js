"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = exports.options = void 0;

var _react = _interopRequireWildcard(require("react"));

var _renderer = require("@react-pdf/renderer");

var _htmlReactParser = require("html-react-parser");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable react/prop-types */
var options = {
  replace: function replace(domNode) {
    if (domNode.name === 'ul') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, null, (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.name === 'li') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, "\n\u2022 ", (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.name === 'p') {
      // Handle contacts
      if (domNode.attribs["class"] === 'person') {
        return /*#__PURE__*/_react["default"].createElement(_renderer.View, null, (0, _htmlReactParser.domToReact)(domNode.children.filter(function (c) {
          return c.type === 'tag' && c.name === 'a';
        }), options));
      }

      return /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.name === 'a') {
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      return /*#__PURE__*/_react["default"].createElement(_renderer.Link, {
        src: domNode.attribs.href
      }, (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.name === 'img') {
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.name === 'table') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
        style: styles.table
      }, (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.name === 'thead') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
        style: styles.thead
      }, (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.name === 'tbody') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, null, (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.name === 'tr') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
        style: styles.tr
      }, (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.name === 'th') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
        style: styles.th
      }, (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.name === 'td') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
        style: styles.td
      }, (0, _htmlReactParser.domToReact)(domNode.children, options));
    }

    if (domNode.type === 'text') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, domNode.data);
    }

    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null);
  }
};
exports.options = options;

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
  },
  table: {
    fontFamily: 'Open Sans',
    margin: 0,
    padding: 0,
    borderColor: '#65656c',
    borderTop: '1pt',
    borderBottom: '1pt',
    borderLeft: '1pt'
  },
  thead: {
    color: 'white',
    margin: 0,
    padding: 0,
    backgroundColor: '#65656c'
  },
  tr: {
    margin: 0,
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  th: {
    margin: 0,
    padding: '3pt',
    borderRight: '1pt',
    borderRightColor: '#65656c',
    flexBasis: 0,
    flexGrow: 1
  },
  td: {
    margin: 0,
    padding: '3pt',
    borderRight: '1pt',
    borderRightColor: 'black',
    flexBasis: 0,
    flexGrow: 1
  }
});

exports.styles = styles;