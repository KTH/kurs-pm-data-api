// ****** Here goes fields fetched from kopps but not included in course syllabus ******//

const generalCourseInfo = {
  equipment: {
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
  literature: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  possibilityToCompletion: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  possibilityToAddition: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  prerequisites: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  }
}

module.exports = generalCourseInfo
