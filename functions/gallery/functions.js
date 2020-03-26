const admin = require('firebase-admin');
const os = require('os');
const path = require('path');
const Busboy = require('busboy');
const fs = require('fs');
const { RESPONSE_MESSAGES } = require('../response-messages');

exports.writeToDb = async ({ url, uploadedTime }) => {
    try{
        const snapshot = await admin.database().ref('/gallery').push({ url, uploadedTime });
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.GALLERY.WRITETODB,
            dbKey: snapshot.key
        }
    }
    catch(e){
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.GALLERY.WRITETODB,
        
        }
    }
};

exports.uploadFile = (req, bucket) => {
    return new Promise((resolve, reject) => {
        const busboy = new Busboy({ headers: req.headers });
        let uploadData = null;
        const time = Date.now();
    
        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            if(!filename){
                resolve({
                    success: false,
                    message: RESPONSE_MESSAGES.REJECT.GALLERY.NOT_FILE,
                });
                return;
            }
            const newFilename = `${time}_${filename}`;
            const filepath = path.join(os.tmpdir(), newFilename);
            const fileUrl = `https://storage.googleapis.com/nuft-kebop.appspot.com/${newFilename}`;
            uploadData = { file: filepath, type: mimetype, fileUrl };
            file.pipe(fs.createWriteStream(filepath));
        });

        busboy.on("finish", () => {
            bucket
                .upload(uploadData.file, {
                    uploadType: "media",
                    public: true,
                    metadata: {
                        metadata: {
                        contentType: uploadData.type
                        }
                    }
                });
            const infoUploaded = {
                url: uploadData.fileUrl,
                uploadedTime: time
            };
            resolve({
                success: true,
                message: RESPONSE_MESSAGES.SUCCESS.GALLERY.UPLOADED,
                result: infoUploaded
            });
        });
        busboy.end(req.rawBody);
    });
};