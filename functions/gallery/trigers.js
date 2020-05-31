const admin = require('firebase-admin');

exports.deleteFromBucket = async (object) => {
    const filenameArr = object.name.split('&');
    const id = filenameArr[0];
    const snapshot = await admin.database().ref(`/gallery/${id}`).once('value');
    if(snapshot.val()){
        admin.database().ref('/gallery').child(id).remove();
    } else {
        admin.database().ref('/news').child(id).update({ photo: null });
    }
    return;
};