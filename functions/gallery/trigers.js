const admin = require('firebase-admin');

exports.deleteFromBucket = async (object) => {
    const filenameArr = object.name.split('&');
    const id = filenameArr[0];
    await admin.database().ref('/gallery').child(id).remove();
    return;
};

exports.deleteTitleImage = async (object) => {
    const filenameArr = object.name.split('&');
    const id = filenameArr[0];
    await admin.database().ref('/news').child(id).update({ photo: null });
    return;
};