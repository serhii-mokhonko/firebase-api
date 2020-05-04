const express = require('express');
const gallery = express();
const { createRecord, writeToDb, uploadFile, deleteFile, getListsOfFiles, updatePhotoUrl } = require('./functions');


//Bucket config
const gcconfig = {
    projectId: "nuft-kebop",
    credentials: require('./nuft-kebop-firebase-adminsdk-9mlqj-0f0b7f635f.json')
};
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage(gcconfig);
const bucket = gcs.bucket("nuft-kebop.appspot.com");

gallery.post('/', async (req, res) => {
  const { description } = req.query;
  let dbWriteDataResult;
  let result;

  const { id } = await createRecord();

  const fileUploadResult = await uploadFile(req, bucket, id);
  
  if(fileUploadResult.success) {
    dbWriteDataResult = await writeToDb(id, fileUploadResult.result, description);
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
  } else {
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

gallery.post("/news/:id", async (req, res) => {
  const { id } = req.params;

  let result,  dbWriteDataResult;
  const fileUploadResult = await uploadFile(req, bucket, id);

  console.log(fileUploadResult.result.url);
  
  if(fileUploadResult.success) {
    dbWriteDataResult = await updatePhotoUrl(id, fileUploadResult.result.url);
  }

  if(fileUploadResult.success && dbWriteDataResult.success) {
    result = {
      success: true,
      messages: [
        fileUploadResult.message,
        dbWriteDataResult.message
      ],
    }
  } else {
    result = {
      success: false,
      messages: [
        fileUploadResult.message,
        dbWriteDataResult.message
      ]
    }
  }

  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

gallery.delete('/:fileName', async (req, res) => {
  const { fileName } = req.params;

  const result = await deleteFile(fileName, bucket);

  const status = result.success ? 200 : 400;
  res.status(status).json(result);
});

gallery.get('/', async (req, res) => {
  const { start, itemOnPage } = req.query;  
  const result = await getListsOfFiles(parseInt(itemOnPage), parseInt(start));

  const status = result.success ? 200 : 400;
  res.status(status).json(result);
});

exports.gallery = gallery;