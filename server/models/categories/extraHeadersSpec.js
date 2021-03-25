// ****** Here goes fields added by teacher ******//
const newSection = {
  uKey: {
    type: String,
    trim: true,
    minlength: 0,
  },
  title: {
    type: String,
    trim: true,
    minlength: 0,
  },
  htmlContent: {
    type: String,
    trim: true,
    minlength: 0,
  },
  visibleInMemo: {
    // remove
    type: Boolean,
    trim: true,
    minlength: 0,
  },
}

const extraHeaders = {
  extraHeaders1: {
    type: Array,
    items: newSection,
    trim: true,
    required: false,
  },
  extraHeaders2: {
    type: Array,
    items: newSection,
    trim: true,
    required: false,
  },
  extraHeaders3: {
    type: Array,
    items: newSection,
    trim: true,
    required: false,
  },
  extraHeaders4: {
    type: Array,
    items: newSection,
    trim: true,
    required: false,
  },
}

module.exports = extraHeaders
