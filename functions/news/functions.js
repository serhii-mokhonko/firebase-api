const admin = require('firebase-admin');
const _ = require('lodash');
const { RESPONSE_MESSAGES } = require('../response-messages');

const checkValue = async (key, ref) => {
    const snapshot = await admin.database().ref(`/${ref}/${key}`).once('value');
    return snapshot.val();
}

exports.getNews = async (startFrom, count) => {
    if(_.isEmpty(startFrom) || _.isEmpty(count))
        return{
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NEWS.PARAMS_NOT_SET
        };

    const snapshot = await admin.database().ref('/news').once('value');
    const data = snapshot.val();
    if(!data)
        return {
            success: false,
            massege: RESPONSE_MESSAGES.REJECT.NEWS.NOT_FOUND
        }

    const transformedData = transformData(data);
    const begin = parseInt(startFrom);
    const end = parseInt(startFrom) + parseInt(count)
    
    if(begin >= transformedData.length)
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NEWS.OUT_OF_RANGE
        }
    
    const result = transformedData.slice(begin, end);
    
    return {
        success: true,
        data: result,
        newsCount: transformedData.length
    }
};

exports.getSingleRecord = async (key) => {
    const record = await admin.database().ref('news').child(key).once('value');
    if(!record.val())
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NEWS.ITEM_NOT_FOUND
        };

    return {
        success: true,
        data: record.val()
    };
}

exports.addNews = async (data) => {
    data.created = Date.now();
    const snapshot = await admin.database().ref('/news').push(data);

    return {
        success: true,
        message: RESPONSE_MESSAGES.SUCCESS.NEWS.CREATED,
        key: snapshot.key
    }
};

exports.editNews = async (key, newData) => {
    const value = await checkValue(key, 'news');
    if(!value) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NEWS.ITEM_NOT_FOUND
        }

    await admin.database().ref(`/news/${key}`).update(newData);
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.NEWS.EDITED,
        }
};

exports.deleteNews = async (key) => {
    const value = await checkValue(key, 'news');
    if(!value) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NEWS.ITEM_NOT_FOUND
        };
    
    await admin.database().ref(`/news/${key}`).remove();
    return {
        success: true,
        message: RESPONSE_MESSAGES.SUCCESS.NEWS.DELETED,
    };
};

const transformData = (obj) => {
    const arr = [];
    _.forIn(obj, (val, key) => {
        arr.push(_.assign(val, {'id': key}));
    })
    return arr;
};