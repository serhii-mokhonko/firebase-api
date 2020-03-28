const admin = require('firebase-admin');

exports.deleteFromBucket = async (object) => {
    const filenameArr = object.name.split('_');
    const id = filenameArr[0];
    await admin.database().ref('/gallery').child(id).remove();
    return;
};