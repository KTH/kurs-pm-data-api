"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propTypeString = exports.subSection = exports.section = exports.data = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var data = _propTypes["default"].shape({
  semester: _propTypes["default"].string,
  ladokRoundIds: _propTypes["default"].array,
  memoCommonLangAbbr: _propTypes["default"].string,
  courseCode: _propTypes["default"].string,
  title: _propTypes["default"].string,
  credits: _propTypes["default"].string,
  creditUnitAbbr: _propTypes["default"].string
});

exports.data = data;

var section = _propTypes["default"].shape({
  id: _propTypes["default"].string,
  extraHeaderTitle: _propTypes["default"].string
});

exports.section = section;

var subSection = _propTypes["default"].shape({
  visibleInMemo: _propTypes["default"].bool,
  title: _propTypes["default"].string,
  htmlContent: _propTypes["default"].string
});

exports.subSection = subSection;
var propTypeString = _propTypes["default"].string;
exports.propTypeString = propTypeString;