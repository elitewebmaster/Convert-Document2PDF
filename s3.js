const {execSync} = require('child_process');
const {S3} = require('aws-sdk');

const s3 = new S3({region: 'us-east-1'});

/**
 * Uploads converted PDF file to S3 bucket
 * and removes it from /tmp afterwards
 * @param filename {String} Name of pdf file
 * @param fileBuffer {Buffer} Converted PDF Buffer
 * @return {Promise.<String>} URL of uploaded pdf on S3
 */

function getFileType(fileExtension){
  switch(fileExtension){
    case "docx":
      type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      break;
    case "doc":
      type = "application/msword";
      break;
    case "ppt":
      type = 'application/vnd.ms-powerpoint';
      break;
    case "pptx":
      type = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      break;
    case "xls":
      type = "application/vnd.ms-excel";
      break;
    case "xlsx":
      type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    case "pdf":
      type = 'application/pdf';
      break;
    case "txt":
      type = 'text/plain';
      break;
    case "mp3":
      type = 'audio/mpeg';
      break;
    case "wav":
      type = 'audio/wav';
      break;
    case "flac":
      type = 'audio/flac';
      break;
    case "mkv":
      type = "video/x-matroska";
      break;
    case "mp4":
      type = "video/mp4";
      break;
    case "avi":
      type = "video/avi";
      break;
    case "mov":
      type = "video/quicktime";  
      break;
    case "3gp":
      type = "video/3gpp";  
      break;
    case "ts":
      type = "video/MP2T";  
      break;
    case "m3u8":
      type = "application/x-mpegURL";  
      break;
    case "jpeg":
    case "jpg":
      type = "image/jpeg";  
      break;
    case "tiff":
      type = "image/tiff";  
      break;
    case "bmp":
      type = "image/bmp";  
      break;
    case "svg":
      type = "image/svg+xml";  
      break;
    case "gif":
      type = "image/gif";  
      break;
    case "png":
      type = "image/png";  
      break;
    default:
      type = "";
  }
  return type;
}

function uploadPDF(filename, fileBuffer, arrPath, fileextension, randomFilenameNewExtension) {
  arrPath[0] = process.env.MAIN_FOLDER_NAME;
  arrPath[arrPath.length - 1] = filename;
  awsPath = arrPath.join("/");
  let filetype = getFileType(fileextension);

  const options = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: awsPath,   
    Body: fileBuffer,
    ACL: 'public-read',
    ContentType: filetype
  };

  return s3.upload(options)
    .promise()
    .then(({Location}) => Location)
    .then(Location => {
      execSync(`rm /tmp/${randomFilenameNewExtension}`);
      console.log(`[removed]`);
      return awsPath; 
    })
    .catch(error => {
      execSync(`rm /tmp/${randomFilenameNewExtension}`);
      console.log(`[removed]`);
      throw error;
    });
}

module.exports = {
  uploadPDF
};
