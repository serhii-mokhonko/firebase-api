const admin = require('firebase-admin');
const _ = require('lodash');
const { RESPONSE_MESSAGES } = require('../response-messages');

const checkValue = async (key, ref) => {
    const snapshot = await admin.database().ref(`/${ref}/${key}`).once('value');
    return snapshot.val();
}

exports.getNews = async (startAt, count) => {
    if(_.isEmpty(startAt) || _.isEmpty(count))
        return{
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NEWS.PARAMS_NOT_SET
        };

    try {
        const dbRecords =  await admin.database().ref('/news').once('value');
        const keys = Object.keys(dbRecords.val()).reverse();
        const key = keys[parseInt(startAt)]

        if(parseInt(startAt) >= keys.length)
            return {
                success: false,
                message: RESPONSE_MESSAGES.REJECT.NEWS.OUT_OF_RANGE
            };
    
        const query = admin.database().ref('/news').orderByKey().limitToLast(parseInt(count)).endAt(key);
        const snapshot = await query.once('value');
        const data = snapshot.val();
        if(!data)
            return {
                success: false,
                massege: RESPONSE_MESSAGES.REJECT.NEWS.NOT_FOUND
            };

        const transformedData = transformData(data);

        return {
            success: true,
            data: transformedData.reverse(),
            newsCount: keys.length
        };

    } catch (err) {
        return {
            success: false,
            error: err.message,
            message: RESPONSE_MESSAGES.REJECT.NEWS.GET_DATA
        }
    }
};

exports.searchNews = async (str, startAt, itemsOnPage) => {
    const searchStr =  _.toLower(str);
    let result;
    try{
        const query = await admin.database().ref('news').once('value');
        const data = query.val();
        const transformedData = transformData(data);

        result = transformedData.reverse().filter(el => {
            const title =  _.toLower(el.title);
            const content = _.toLower(el.content);

            return ( title.includes(searchStr) || content.includes(searchStr) );
        });

    }catch(err) {
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.SEARCH.ERROR,
            error: err.message
        };
    }

    if(result.length > 0) {
        if(!_.isEmpty(startAt) || !_.isEmpty(itemsOnPage)) {
            const start = parseInt(startAt);
            const end = start + parseInt(itemsOnPage);
            const cuttedOutResult = result.slice(start, end);
            return {
                success: true,
                data: cuttedOutResult,
                newsCount: result.length
            };
        }

        return {
            success: true,
            data: result,
            count: result.length
        };
    }

    return {
        success: false,
        message: RESPONSE_MESSAGES.REJECT.SEARCH.NOT_FOUND
    };
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
    if(!data.title || !data.content)
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NEWS.FIELDS_EMPTY
        };
    
    data.description = data.description || "";
    data.visible = !_.isBoolean(data.visible) ? true : data.visible;
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
        };

    if(!newData.title || !newData.content)
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NEWS.FIELDS_EMPTY
        };

    newData.description = newData.description || "";
    newData.visible = !_.isBoolean(newData.visible) ? true : newData.visible;
    newData.updated = Date.now();

    await admin.database().ref(`/news/${key}`).update(newData);
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.NEWS.EDITED,
        };
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