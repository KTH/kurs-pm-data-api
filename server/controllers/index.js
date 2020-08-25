'use strict'

module.exports = {
  // Do not remove the System controller!
  System: require('./systemCtrl'),
  // Replace with actual API controller
  Sample: require('./sampleCtrl'),
  CourseMemo: require('./memoDataCtrl'),
  PDF: require('./pdfCtrl'),
  MigrateMemo: require('./migrateFromOldDB'),
  StoredMemoPdf: require('./storedMemoPdfsCtrl')
}
