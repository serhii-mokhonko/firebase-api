const admin = require('firebase-admin');
const _ = require('lodash');
const cyrillicToTranslit = require("cyrillic-to-translit-js");
const { RESPONSE_MESSAGES } = require("./response-messages");

const checkValue = async (key, ref) => {
    const snapshot = await admin.database().ref(ref).child(key).once('value');
    return snapshot.val();
};

const setUrl = title => {
    const url = cyrillicToTranslit().transform(title, "_").toLowerCase();
    return url.replace(/[\s.,!"'`#$&^@;:?*)(|/+><`=%]/g, "");
};

exports.getCategories =  async table => {
    try{
        const query = await admin.database().ref("/categories").child(table).once("value");
        const data = query.val();      
        const arr = [];
        _.forIn(data, (val, key) => {
            arr.push(_.assign(val, {'id': key}));
        });
        return {
            success: true,
            data: arr
        };
    } catch (err) {
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.ERROR
        }
    }
};

exports.addCategory = async (table, title) => {
    if (_.isEmpty(table))
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_TABLE
        }

    if (_.isEmpty(title))
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_TITLE
        }

    const url = setUrl(title);

    try {
        const query = await admin.database().ref("categories").child(table).push({ title, url, count: 0 });
        if(query.key)
            return {
                success: true,
                message: RESPONSE_MESSAGES.SUCCESS.ADD
            }
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_ADD
        }
    } catch (err) {
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.ERROR
        }
    }
};

exports.delCategory = async (table, id) => {
    const value = await checkValue(id, `categories/${table}`);
    if(!value) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_FOUND
        };

    try {
        await admin.database().ref(`categories/${table}`).child(id).remove();
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.DELETE
        }
    } catch (err) {
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_DELETE
        }
    }
};

exports.updateCategory = async ({ table, id }, { title, count }) => {
    const value = await checkValue(id, `categories/${table}`);
    if(!value) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_FOUND
        };
        
    const data = {};
    if (!_.isEmpty(title) || !_.isEmpty(count)) {
        if (!_.isEmpty(title)) {
            data.title = title;
            data.url = setUrl(title);
        }

        if (!_.isEmpty(count))
            data.count = count;
    } else {
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_PROPERTY
        }
    }

    try {
        await admin.database().ref(`/categories/${table}`).child(id).update(data);
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.UPDATE
        }
    } catch (err) {
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_UPDATE
        }
    }

};