const {writeFileSync} = require('fs');
const {convertToPDF} = require('./libreoffice');
const {uploadPDF} = require('./s3');

//const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validate, save, convert and uploads file
 * @param base64File {String} File in base64 format
 * @param filename {String} Name of file to convert
 * @return {Promise.<String>} URL of uploaded file on S3
 */
module.exports.convertFileToPDF = function convertFileToPDF(file, filename, arrPath, fileextension, randomFilename) {
 // console.log(`[start][file:${filename}][buffer:${base64File.slice(0, 16)}...]`);
  const fileBuffer = new Buffer(file, 'binary');
 // console.log(`[size:${fileBuffer.length}]`);

  writeFileSync(`/tmp/${randomFilename}`, fileBuffer);
  console.log(`[written]`);
  const {pdfFilename, pdfFileBuffer, randomFilenameNewExtension} = convertToPDF(randomFilename, fileextension, filename);
  
  return uploadPDF(pdfFilename, pdfFileBuffer, arrPath, fileextension, randomFilenameNewExtension);
};
