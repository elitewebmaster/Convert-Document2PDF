const {execSync} = require('child_process');
const {readFileSync} = require('fs');
const path = require('path');

/**
 * Converts a document to PDF from url by spawning LibreOffice process
 * @param inputFilename {String} Name of incoming file to convert in /tmp folder
 * @return {Buffer} Converted PDF file buffer
 */
module.exports.convertToPDF = function convertToPDF(inputFilename, fileextension, filename) {
  const convertCommand = `./instdir/program/soffice --headless --invisible --nodefault --nofirststartwizard --nolockcheck --nologo --norestore --convert-to ${fileextension} --outdir /tmp`;

  console.log(`[convertToPDF][file:${inputFilename}]`);
  const pdfFilename = getPDFFilename(filename, fileextension);

  execSync(`cd /tmp && ${convertCommand} ${inputFilename}`);
  console.log(`[converted]`);

  let randomFilenameNewExtension = inputFilename.slice(0, inputFilename.lastIndexOf(".") + 1) + fileextension;
  const pdfFileBuffer = readFileSync(`/tmp/${randomFilenameNewExtension}`);
  return {
    pdfFileBuffer,
    pdfFilename,
    randomFilenameNewExtension
  };
};

function getPDFFilename(inputFilename, fileextension) {
  const {name} = path.parse(inputFilename);
  return `${name}.${fileextension}`;
}

module.exports.unpackArchive = function unpackArchive() {
  execSync(`cd /tmp && tar -xf /var/task/lo.tar.gz`);
};
