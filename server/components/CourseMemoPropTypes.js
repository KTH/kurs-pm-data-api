import PropTypes from 'prop-types'

export const data = PropTypes.shape({
  semester: PropTypes.string,
  ladokRoundIds: PropTypes.array,
  memoCommonLangAbbr: PropTypes.string,
  courseCode: PropTypes.string,
  title: PropTypes.string,
  credits: PropTypes.string,
  creditUnitAbbr: PropTypes.string
})

export const section = PropTypes.shape({
  id: PropTypes.string,
  extraHeaderTitle: PropTypes.string
})

export const subSection = PropTypes.shape({
  visibleInMemo: PropTypes.bool,
  title: PropTypes.string,
  htmlContent: PropTypes.string
})

export const propTypeString = PropTypes.string
