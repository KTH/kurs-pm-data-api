'use strict'

module.exports = {
  // Do not remove the System controller!
  System: require('./systemCtrl'),
  CourseMemo: require('./memoDataCtrl'),
  StoredMemoPdf: require('./storedMemoPdfsCtrl'),
  MixedWebAndPdfMemosList: require('./mixedWebAndPdfMemosCtrl')
}
