const admin = require('firebase-admin');
const os = require('os');
const path = require('path');
const Busboy = require('busboy');
const fs = require('fs');
const { RESPONSE_MESSAGES } = require('../response-messages');


//database
exports.createRecord = async () => {
    const snapshot = await admin.database().ref('/gallery').push();
    return {
        id: snapshot.key
    };
}

exports.writeToDb = async (id, data) => {
    try{
        await admin.database().ref(`/gallery/${id}`).update(data);
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.GALLERY.WRITETODB
        }
    }
    catch(e){
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.GALLERY.WRITETODB
        }
    }
};


//storge
exports.uploadFile = (req, bucket, id) => {
    return new Promise((resolve) => {
        const busboy = new Busboy({ headers: req.headers });
        let uploadData,
            newFileName;
        const time = Date.now();
    
        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            if(!filename){
                resolve({
                    success: false,
                    message: RESPONSE_MESSAGES.REJECT.GALLERY.NOT_FILE,
                });
                return;
            }

            const extention = filename.substr(-3);
            newFileName = `${id}_${time}.${extention}`;
            const filepath = path.join(os.tmpdir(), newFileName);
            const fileUrl = `https://storage.googleapis.com/nuft-kebop.appspot.com/${newFileName}`;
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
                filename: newFileName,
                type: uploadData.type,
                uploadedTime: time,
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

exports.deleteFile = async (fileName, bucket) => {
    const file = bucket.file(fileName);
    try {
        await file.delete();
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.GALLERY.DELETED
        }
    }catch(err){
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.GALLERY.NOT_DELETE
        }
    }
};
