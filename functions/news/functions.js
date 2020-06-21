const admin = require('firebase-admin');
const _ = require('lodash');
const { RESPONSE_MESSAGES } = require('../response-messages');
const { response } = require('express');

const checkValue = async (key, ref) => {
    const snapshot = await admin.database().ref(`/${ref}/${key}`).once('value');
    return snapshot.val();
}

// !!! get categories from news only !!! 
const getCategories = async () => {
    try{
        const query = await admin.database().ref(`/categories/news`).once("value");
        return query.val();
    } catch (err) {
        return false;
    }
};

const filterNewsBySearchQuery = (news, q) => {
    return news.filter(el => {
        const title =  _.toLower(el.title || "");
        const content = _.toLower(el.content || "");
        const description = _.toLower(el.description || "");

        return ( title.includes(q) || content.includes(q) || description.includes(q) );
    });
}

const filterNewsByCategory = (news, category) => {
    const filters = {
        c: el => el.hasOwnProperty("category") && el.category.url === category,
    }

    return news.filter(item => {
        const results = [];
        for (let key in filters) {
            const fun = filters[key];
            results.push(fun(item));
        }
        return results.every(el => el === true);
    });
}

exports.getNews = async ({startAt, count, category, q}) => {
    startAt = startAt || 0;
    count = count || 1;
    category = category || "";
    q = q || "";

    try {
        const dbRecords =  await admin.database().ref('/news').once('value');
        const keys = Object.keys(dbRecords.val()).reverse();
        const key = keys[parseInt(startAt)]

        const query = admin.database().ref('/news');
        const snapshot = await query.once('value');
        const data = snapshot.val();
        
        if(!data)
            return {
                success: false,
                massege: RESPONSE_MESSAGES.REJECT.NEWS.NOT_FOUND
            };

        const categories  = await getCategories();
        const transformedData = transformData(data);
        let newsData = transformCategories(transformedData, categories);

        if(!_.isEmpty(category)) {
            newsData = filterNewsByCategory(newsData, category)
        }

        if(!_.isEmpty(q)) {
            newsData = filterNewsBySearchQuery(newsData, q);
        }

        const news = newsData.reverse().splice(startAt, count)

        let response = {
            success: true,
            newsCount: news.length,
            data: news
        };

        if(!_.isEmpty(category)) {
            const categoryObject = _.find(categories, cat => cat.hasOwnProperty("url") && cat.url === category);
            const categoryName = !_.isNil(categoryObject) ? categoryObject.title : `Такої категорії не існує`;
            response = _.merge(response, { categoryName })
        }

        return response;

    } catch (err) {
        return {
            success: false,
            error: err.message,
            message: RESPONSE_MESSAGES.REJECT.NEWS.GET_DATA
        }
    }
};

exports.getSingleRecord = async (key) => {
    const record = await admin.database().ref('news').child(key).once('value');
    if(!record.val())
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NEWS.ITEM_NOT_FOUND
        };

    const categories  = await getCategories();
    const newsData = transformCategories([record.val()], categories);

    return {
        success: true,
        data: newsData[0]
    };
}

exports.addNews = async (data) => {
    if(!data.title || !data.content)
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NEWS.FIELDS_EMPTY
        };
    
    data.description = data.description || "";
    data.category = data.category || {};
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
    newData.category = newData.category || {};
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


const transformCategories = (data, categories) => {
    return data.map(el => {
        if (!el.hasOwnProperty("category")) return el;
        const sourceCat = categories.hasOwnProperty(el.category) ? categories[el.category] : {};
        const mergedObj = Object.assign(sourceCat, { id: el.category } );
        return Object.assign(el, { category: mergedObj });  
    });
}