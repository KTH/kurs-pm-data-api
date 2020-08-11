"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.isSrcId = void 0;

var _react = _interopRequireWildcard(require("react"));

var _renderer = require("@react-pdf/renderer");

var _htmlReactParser = _interopRequireWildcard(require("html-react-parser"));

var _CourseMemoStyles = _interopRequireDefault(require("./CourseMemoStyles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable no-console */

/* eslint-disable jsx-a11y/anchor-is-valid */

/* eslint-disable no-use-before-define */
// Borrowed from https://github.com/diegomura/react-pdf/
var PROTOCOL_REGEXP = /^([a-z]+:(\/\/)?)/i;
var DEST_REGEXP = /^#.+/;

var isSrcId = function isSrcId(src) {
  return src.match(DEST_REGEXP);
};

exports.isSrcId = isSrcId;

var getURL = function getURL(value) {
  if (!value) return '';
  if (isSrcId(value)) return value; // don't modify it if it is an id

  if (typeof value === 'string' && !value.match(PROTOCOL_REGEXP)) {
    return "https://kth.se".concat(value); // Fix internal links, like profiles
  }

  return value;
}; // End borrowed from https://github.com/diegomura/react-pdf/


var components = {
  p: function p(domNode) {
    return domNode.attribs["class"] === 'person' ? /*#__PURE__*/_react["default"].createElement(_renderer.View, null, (0, _htmlReactParser.domToReact)(domNode.children.filter(function (c) {
      return c.type === 'tag' && c.name === 'a';
    }), htmlParseOptions)) : /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      style: _CourseMemoStyles["default"].p
    }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
  },
  ul: function ul(domNode) {
    return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      style: _CourseMemoStyles["default"].ul
    }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
  },
  li: function li(domNode) {
    return /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: _CourseMemoStyles["default"].li
    }, "\u2022\xA0", (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
  },
  a: function a(domNode) {
    return /*#__PURE__*/_react["default"].createElement(_renderer.Link, {
      src: getURL(domNode.attribs.href)
    }, getURL(domNode.attribs.href));
  },
  img: function img(domNode) {
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
  },
  table: function table(domNode) {
    return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      wrap: false,
      style: _CourseMemoStyles["default"].table
    }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
  },
  thead: function thead(domNode) {
    return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      style: _CourseMemoStyles["default"].thead
    }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
  },
  tbody: function tbody(domNode) {
    return /*#__PURE__*/_react["default"].createElement(_renderer.View, null, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
  },
  tr: function tr(domNode) {
    return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      style: _CourseMemoStyles["default"].tr
    }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
  },
  th: function th(domNode) {
    return /*#__PURE__*/_react["default"].createElement(_renderer.Text, {
      style: _CourseMemoStyles["default"].th
    }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
  },
  td: function td(domNode) {
    return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      style: _CourseMemoStyles["default"].td
    }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
  },
  h4: function h4(domNode) {
    return /*#__PURE__*/_react["default"].createElement(_renderer.View, {
      style: _CourseMemoStyles["default"].h4
    }, (0, _htmlReactParser.domToReact)(domNode.children, htmlParseOptions));
  },
  "default": function _default() {
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null);
  }
};
var htmlParseOptions = {
  replace: function replace(domNode) {
    if (domNode.type === 'text') {
      return /*#__PURE__*/_react["default"].createElement(_renderer.Text, null, domNode.data);
    }

    var component = components[domNode.name] || components["default"];
    return component(domNode);
  }
};

var replaceLineBreaks = function replaceLineBreaks(html) {
  return html.replace(/\n/g, '').replace(/<br>|<br.*\/>/, '\n');
};

var htmlParser = function htmlParser(rawHtml) {
  console.time('htmlParser: replaceLineBreaks');
  var html = replaceLineBreaks(rawHtml);
  console.timeEnd('htmlParser: replaceLineBreaks');
  console.time('htmlParser: parse');
  var parsedHtml = (0, _htmlReactParser["default"])(html, htmlParseOptions);
  console.timeEnd('htmlParser: parse');
  return parsedHtml;
};

var _default2 = htmlParser;
exports["default"] = _default2;