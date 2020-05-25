const admin = require('firebase-admin');
const _ = require('lodash');
const { RESPONSE_MESSAGES } = require("./response-messages");

const checkValue = async (key, ref) => {
    const snapshot = await admin.database().ref(`/${ref}/${key}`).once('value');
    return snapshot.val();
};

exports.getCategories =  async () => {
    try{
        const query = await admin.database().ref("/categories").once("value");
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

exports.addCategory = async (title) => {
    if (_.isEmpty(title))
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_TITLE
        }

    try {
        const query = await admin.database().ref("/categories").push({ title, count: 0 });
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

exports.delCategory = async (id) => {
    const value = await checkValue(id, 'categories');
    if(!value) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_FOUND
        };

    try {
        await admin.database().ref(`/categories/${id}`).remove();
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

exports.updateCategory = async (id, { title, count }) => {
    const value = await checkValue(id, 'categories');
    if(!value) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_FOUND
        };
        
    const data = {};
    if (!_.isEmpty(title) || !_.isEmpty(count)) {
        if (!_.isEmpty(title))
            data.title = title;

        if (!_.isEmpty(count))
            data.count = count;
    } else {
        return {
            success: false,
            title: RESPONSE_MESSAGES.REJECT.NOT_PROPERTY
        }
    }

    try {
        await admin.database().ref(`/categories/${id}`).update(data);
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