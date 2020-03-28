const express = require('express');
const gallery = express();
const { createRecord, writeToDb, uploadFile } = require('./functions');


//Bucket config
const gcconfig = {
    projectId: "nuft-kebop",
    credentials: require('./nuft-kebop-firebase-adminsdk-9mlqj-0f0b7f635f.json')
};
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage(gcconfig);
const bucket = gcs.bucket("nuft-kebop.appspot.com");


//Upload
gallery.post('/', async (req, res) => {
  let dbWriteDataResult;
  let result;

  const { id } = await createRecord();

  const fileUploadResult = await uploadFile(req, bucket, id);
  
  if(fileUploadResult.success) {
    dbWriteDataResult = await writeToDb(id, fileUploadResult.result);
  }
  
  if(fileUploadResult.success && dbWriteDataResult.success){
    result = {
      success: true,
      messages: [
        fileUploadResult.message,
        dbWriteDataResult.message
      ],
      dbKey: id,
      info: fileUploadResult.result
    };
  }else {
    result = {
      success: false,
      messages: [
        fileUploadResult.message,
        dbWriteDataResult.message
      ]
    };
  }

  const status = result.success ? 200 : 500;
  res.status(status).json(result);
}); 

exports.gallery = gallery;