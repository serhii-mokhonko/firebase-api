const admin = require('firebase-admin')
const functions = require('firebase-functions')
const os = require('os')
const path = require('path')
const cors = require('cors')({ origin: true })
const Busboy = require('busboy')
const fs = require('fs')

const gcconfig = {
    projectId: "nuft-kebop",
    credentials: require('./nuft-kebop-firebase-adminsdk-9mlqj-0f0b7f635f.json')
}
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage(gcconfig);

exports.gallery = (req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(500).json({
        message: 'Not allowed',
      })
    }
    const busboy = new Busboy({ headers: req.headers })
    let uploadData = null
    
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const time = Date.now();
        const filenameTime = `${time}_${filename}`;
      const filepath = path.join(os.tmpdir(), filenameTime);
      uploadData = { file: filepath, type: mimetype, fileUrl: `https://storage.googleapis.com/nuft-kebop.appspot.com/${filenameTime}` }
      file.pipe(fs.createWriteStream(filepath))
    })

    busboy.on('finish', () => {
      const bucket = gcs.bucket('nuft-kebop.appspot.com');
      bucket
        .upload(uploadData.file, {
          uploadType: 'media',
          public: true,
          metadata: {
            metadata: {
              contentType: uploadData.type,
            },
          },
        })
        .then(async (result) => {
            await admin.database().ref('/gallery').push({ url: uploadData.fileUrl, uploadedDaeTime: Date.now() });
            return res.status(200).json({ url: uploadData.fileUrl, uploadedDaeTime: Date.now() })})
        .catch(err => res.status(500).json({error: err}))
    })
    busboy.end(req.rawBody)
  })
};