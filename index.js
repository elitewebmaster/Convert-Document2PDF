const AWS = require('aws-sdk');
const {unpackArchive} = require('./libreoffice');
const {convertFileToPDF} = require('./logic');

unpackArchive();

module.exports.handler = (event, context, cb) => {
  const filepath = event.filepath,
   s3 = new AWS.S3(),
   options = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filepath,
  };

  s3.getObject(options, function(error, data) {
    if(error){
      console.log(error); 
      cb(error);
    } else {
      attachment = data.Body;
      let arrPath = filepath.split("/");
      let filename = arrPath[arrPath.length - 1];
      let randomFilename = (Math.random().toString(32).slice(2)) + (filename.slice(filename.lastIndexOf("."), filename.length));
      const fileextension = (event.fileextension) ? event.fileextension.toLowerCase() : "pdf";
      
      return convertFileToPDF(attachment, filename, arrPath, fileextension, randomFilename)
      .then(fileURL => {
        return cb(null, {
          body: JSON.stringify({fileURL})
        });
      })
      .catch(cb);
    }
  });
};
