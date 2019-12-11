// ****** Here goes fields fetched from kopps but not included in course syllabus ******//

const generalCourseInfo = {
  equipment: {
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
  supplementaryExam: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  },
  raiseApprovedGrade: {
    type: String,
    trim: true,
    minlength: 0,
    default: ''
  }
}

module.exports = generalCourseInfo
