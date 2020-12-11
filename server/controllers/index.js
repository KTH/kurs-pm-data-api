'use strict'

module.exports = {
  // Do not remove the System controller!
  System: require('./systemCtrl'),
  // Replace with actual API controller
  Sample: require('./sampleCtrl'),
  CourseMemo: require('./memoDataCtrl'),
  StoredMemoPdf: require('./storedMemoPdfsCtrl'),
  MixedWebAndPdfMemosList: require('./mixedWebAndPdfMemosCtrl')
}
