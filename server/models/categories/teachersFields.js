// ****** Here goes fields about teachers types which administrates via kopps ******//
// ****** but FETCHED from Ug-REDIS ******//
// *** otherContacts added by teacher *** ///

const teachersTypesUg = {
  examiner: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  infoContactName: {
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
  otherContacts: {
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
