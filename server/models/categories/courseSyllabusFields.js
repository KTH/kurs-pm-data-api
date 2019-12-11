// ****** Here goes fields related to course syllabus and fetched from kopps without editing it ******//

// TO DO: USE MAP IF ALL PARAMETERS THE SAME
const courseSyllabus = {
  courseContent: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  learningOutcomes: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  additionalRegulations: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  gradingScale: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  ethicalApproach: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  examination: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  examinationComment: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  examinationCommentEditable: {
    // /to do move it
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  otherRequirementsForFinalGrade: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  }
}

module.exports = courseSyllabus
