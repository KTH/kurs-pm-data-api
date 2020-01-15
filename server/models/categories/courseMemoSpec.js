const courseMemoSpec = {
  examinationModules: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  gradingCriteria: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  planning: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  }
}

module.exports = courseMemoSpec
