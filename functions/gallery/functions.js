const admin = require('firebase-admin');
const _ = require('lodash');
const os = require('os');
const path = require('path');
const Busboy = require('busboy');
const fs = require('fs');
const { RESPONSE_MESSAGES } = require('../response-messages');

const checkValue = async (key, ref) => {
    const snapshot = await admin.database().ref(`/${ref}/${key}`).once('value');
    return snapshot.val();
}

exports.createRecord = async () => {
    const snapshot = await admin.database().ref('/gallery').push();
    return {
        id: snapshot.key
    };
}

exports.writeToDb = async ({ id, data, category = "", description='' }) => {
    const dbRecord = _.assign(data, { description, category });
    try{
        await admin.database().ref(`/gallery/${id}`).set(dbRecord);
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

exports.updatePhotoUrl = async (id, url) => {
    if(_.isEmpty(id) || _.isEmpty(url))
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.GALLERY.WRITETODB
        };

    try {
        await admin.database().ref(`/news/${id}`).update({ photo: url });
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.GALLERY.WRITETODB
        }
    } catch (err) {
        console.log(err);

        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.GALLERY.WRITETODB
        }
    }
};

exports.getImage = async (key) => {
    let value = await checkValue(key, 'gallery');
    if(!value) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.GALLERY.GET_DATA
        }

    const data = _.assign(value, {'id': key});

    return {
        success: true,
        data
    }
}

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

            const regexp = /(?:\.([^.]+))?$/;
            const extention = regexp.exec(filename)[1];
            newFileName = `${id}&${time}.${extention}`;
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

exports.getListsOfFiles = async (itemOnPage, start) => {
    itemOnPage = itemOnPage || 25;
    start = start || 0;
    try{
        const dbRecords =  await admin.database().ref('/gallery').once('value');
        const keys = Object.keys(dbRecords.val()).reverse();
        const key = keys[start]
        const query = admin.database().ref('/gallery').orderByKey().limitToLast(itemOnPage).endAt(key);
        const result = await query.once('value');
        const data = transformData(result.val()).reverse();
        return{
            success: true,
            сountOfItems: keys.length,
            data
        }
    }catch(err){
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.GALLERY.GET_DATA
        }
    }
    
}

const transformData = (obj) => {
    const arr = [];
    _.forIn(obj, (val, key) => {
        arr.push(_.assign(val, {'id': key}));
    })
    return arr;
};