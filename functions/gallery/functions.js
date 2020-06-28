const admin = require('firebase-admin');
const _ = require('lodash');
const os = require('os');
const path = require('path');
const Busboy = require('busboy');
const fs = require('fs');
const { RESPONSE_MESSAGES } = require('../response-messages');
const { result } = require('lodash');

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

exports.getListsOfFiles = async (items, start) => {
    items = items || 25;
    start = start || 0;
    try{
        const dbRecords =  await admin.database().ref('/gallery').once('value');
        const keys = Object.keys(dbRecords.val()).reverse();
        const key = keys[start]
        const query = admin.database().ref('/gallery').orderByKey().limitToLast(items).endAt(key);
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

exports.searchInBucket = async (params) => {
    let { items = 25, start = 0 } = params;
    let data;

    const query = await admin.database().ref('/gallery').once('value');
    data = transformData(query.val());

    const filters = {
        q: el => el.hasOwnProperty("description") && _.toLower(el.description).includes(_.toLower(params.q)),
        c: el => el.hasOwnProperty("category") && el.category === params.c,
        timestart: el => el.hasOwnProperty("uploadedTime") && el.uploadedTime >= params.timestart,
        timeend: el => el.hasOwnProperty("uploadedTime") && el.uploadedTime <= params.timeend
    }

    data = data.reverse().filter(item => {
        const results = [];
        for (let key in filters) {
            if(!_.isEmpty(params[key])){
                const fun = filters[key];
                results.push(fun(item));
            }
        }
        return results.every(el => el === true);
    });

    if (data.length > 0) {
        if(!_.isEmpty(start) || !_.isEmpty(items)) {
            start = parseInt(start);
            end = start + parseInt(items);
           
            return {
                success: true,
                data:  data.slice(start, end),
                count: data.length
            };
        }

    }

    return {
        success: false,
        message: RESPONSE_MESSAGES.REJECT.SEARCH.NOT_FOUND
    };
};

const transformData = (obj) => {
    const arr = [];
    _.forIn(obj, (val, key) => {
        arr.push(_.assign(val, {'id': key}));
    })
    return arr;
};