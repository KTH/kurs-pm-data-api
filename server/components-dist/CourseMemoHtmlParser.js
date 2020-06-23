"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _renderer = require("@react-pdf/renderer");

var _htmlReactParser = _interopRequireWildcard(require("html-react-parser"));

var _CourseMemoStyles = _interopRequireDefault(require("./CourseMemoStyles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable react/prop-types */
var htmlParseOptions = {
  replace: function replace(domNode) {
    if (domNode.name === 'ul') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, null, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
    }

    if (domNode.name === 'li') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, "\n\u2022 ", (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
    }

    if (domNode.name === 'p') {
      // Handle contacts
      if (domNode.attribs["class"] === 'person') {
        return /*#__PURE__*/_react["default"].createElement(_renderer.View, null, (0, _htmlReactParser.domToReact)(domNode.children.filter(function (c) {
          return c.type === 'tag' && c.name === 'a';
        }), htmlParseOptions));
      }

      return /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
    }

    if (domNode.name === 'a') {
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      return /*#__PURE__*/_react["default"].createElement(_renderer.Link, {
        src: domNode.attribs.href
      }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
    }

    if (domNode.name === 'img') {
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
    }

    if (domNode.name === 'table') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
        style: _CourseMemoStyles["default"].table
      }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
    }

    if (domNode.name === 'thead') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
        style: _CourseMemoStyles["default"].thead
      }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
    }

    if (domNode.name === 'tbody') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, null, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
    }

    if (domNode.name === 'tr') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
        style: _CourseMemoStyles["default"].tr
      }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
    }

    if (domNode.name === 'th') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
        style: _CourseMemoStyles["default"].th
      }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
    }

    if (domNode.name === 'td') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
        style: _CourseMemoStyles["default"].td
      }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
    }

    if (domNode.type === 'text') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, domNode.data);
    }

    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null);
  }
};

var htmlParser = function htmlParser(html) {
  var cleanHtml = html.replace(/\n/g, '');
  return (0, _htmlReactParser["default"])(cleanHtml, htmlParseOptions);
};

var _default = htmlParser;
exports["default"] = _default;