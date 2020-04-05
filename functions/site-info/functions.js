const admin = require('firebase-admin');
const _ = require('lodash');
const { RESPONSE_MESSAGES } = require('../response-messages');

const checkValue = async (key, ref) => {
    const snapshot = await admin.database().ref(`/${ref}/${key}`).once('value');
    return snapshot.val();
}

exports.getSiteInfo = async () => {
    const snapshot = await admin.database().ref('/siteInfo').once('value');
    const data = snapshot.val();
    if(!data)
        return {
            success: false,
            massege: RESPONSE_MESSAGES.REJECT.PAGES.NOT_FOUND
        }

    const result = transformData(data);
    
    return {
        success: true,
        data: result
    }
};

exports.addSiteInfo = async (key, value) => {
    const snapshot = await admin.database().ref('/siteInfo').push({infoKey: key, value});

    return {
        success: true,
        message: RESPONSE_MESSAGES.SUCCESS.PAGES.CREATED,
        key: snapshot.key
    }
};

exports.editSiteInfo = async (key, newData) => {
    const value = await checkValue(key, 'siteInfo');
    if(!value) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.PAGES.KEY_NOT_FOUND
        }

    await admin.database().ref(`/siteInfo/${key}`).update(newData);
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.PAGES.EDITED,
        }
};

exports.deleteSiteInfo = async (key) => {
    await admin.database().ref(`/siteInfo/${key}`).remove()
    return {
        success: true,
        message: RESPONSE_MESSAGES.SUCCESS.PAGES.DELETED,
    }
};

const transformData = (obj) => {
    const result = [];

    _.forEach(Object.keys(obj), key => {
        const value = obj[key];
        value.key = key;
        result.push(value);
    })

    return result;
};