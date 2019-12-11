// ****** Here goes fields about teachers types which administrates via kopps ******//
// ****** but FETCHED from Ug-REDIS ******//
// *** labSupervisors added by teacher *** ///

const teachersTypesUg = {
  examiner: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  courseCoordinator: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  labSupervisors: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  teacherAssistants: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  teacher: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  }
}

module.exports = teachersTypesUg
