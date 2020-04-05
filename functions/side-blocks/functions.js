const admin = require('firebase-admin');
const _ = require('lodash');
const { RESPONSE_MESSAGES } = require('../response-messages');

const checkValue = async (key, ref) => {
    const snapshot = await admin.database().ref(`/${ref}/${key}`).once('value');
    return snapshot.val();
}

exports.getBlocks = async () => {
    const snapshot = await admin.database().ref('/blocks').once('value');
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

exports.addBlock = async (side, order, title, html, javascript) => {
    const snapshot = await admin.database().ref('/blocks').push({title, html, javascript, side, order});

    return {
        success: true,
        message: RESPONSE_MESSAGES.SUCCESS.PAGES.CREATED,
        key: snapshot.key
    }
};

exports.editBlock = async (key, newData) => {
    const value = await checkValue(key, 'blocks');
    if(!value) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.PAGES.KEY_NOT_FOUND
        }

    await admin.database().ref(`/blocks/${key}`).update(newData);
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.PAGES.EDITED,
        }
};

exports.deleteBlock = async (key) => {
    await admin.database().ref(`/blocks/${key}`).remove()
    return {
        success: true,
        message: RESPONSE_MESSAGES.SUCCESS.PAGES.DELETED,
    }
};

const transformData = (obj) => {
    const leftArr = [];
    const rightArr = [];

    _.forEach(Object.keys(obj), key => {
        const value = obj[key];
        value.key = key;
        if(value.side === "left")
            leftArr.push(value);
        else
            rightArr.push(value)
    })
    return {
        left: leftArr.sort((a, b) => a.order - b.order),
        right: rightArr.sort((a, b) => a.order - b.order)
    }
};