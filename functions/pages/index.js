const { pages, admin } = require('./setup.js')
const { RESPONSE_MESSAGES } = require('../response-messages.js')
const _ =  require('lodash')

const checkValue = async (key, ref) => {
    const snapshot = await admin.database().ref(`/${ref}/${key}`).once('value');
    return snapshot.val();
}

const getPages = async () => {
    const snapshot = await admin.database().ref('/pages').once('value');
    const data = snapshot.val();
    if(!data)
        return {
            success: false,
            massege: RESPONSE_MESSAGES.REJECT.PAGES.NOT_FOUND
        }

    //update of object structure for response
    let result = [];

    _.forIn(data, (val, key) => {
        result.push(_.assign(val, {'id': key}));
    })
    
    return {
        success: true,
        data: result
    }
}

const getPage = async (key) => {
    const value = await checkValue(key, 'pages');
    if(!value) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.PAGES.KEY_NOT_FOUND
        }

    return {
        success: true,
        data: value
    }

}

const addPage = async ({ title, body, userId, visible=false}) => {
    if(!userId)
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.PAGES.ERRORUSER
        }
    
    if(_.isEmpty(title) || _.isEmpty(body)) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.PAGES.FIELDS_EMPTY
        }

    const snapshot = await admin.database().ref('/pages').push({title, body, userId, visible})
    return {
        success: true,
        message: RESPONSE_MESSAGES.SUCCESS.PAGES.CREATED,
        key: snapshot.key
    }
}

const editPage = async ({key, newData}) => {
    const value = await checkValue(key, 'pages');
    if(!value) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.PAGES.KEY_NOT_FOUND
        }

    const { title, body, userId } = newData;
    if(!userId)
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.PAGES.ERRORUSER
        }
    
    if(_.isEmpty(title) || _.isEmpty(body)) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.PAGES.FIELDS_EMPTY
        }

    await admin.database().ref(`/pages/${key}`).update(newData);
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.PAGES.EDITED,
        }
}

const deletePage = async (key) => {
    const value = await checkValue(key, 'pages');
    if(!value) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.PAGES.KEY_NOT_FOUND
        }

    if(_.isEmpty(key)) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.PAGES.KEY_REQUIRED
        }
    
    await admin.database().ref(`/pages/${key}`).remove()
    return {
        success: true,
        message: RESPONSE_MESSAGES.SUCCESS.PAGES.DELETED,
    }
}

pages.get('/:key', async (req, res) => {
    const pageKey = req.params.key;
    let result = await getPage(pageKey);

    const responseStatus = result.success ? 200 : 400;
    res.status(responseStatus).json(result);
})

pages.get('/', async (req, res) => {
    const result = await getPages();
    
    const responseStatus = result.success ? 200 : 400;
    res.status(responseStatus).json(result);
})

pages.post(`/`, async (req, res) => {
    const {title, body, visible} = req.body;
    const userId = req.user.uid;
    const result = await addPage({title, body, userId, visible});
    
    const responseStatus = result.success ? 201 : 400;
    res.status(responseStatus).json(result);
})

pages.put(`/:key`, async (req, res) => {
    const pageKey = req.params.key;
    const {title, body, visible} = req.body;
    const userId = req.user.uid;

    const result = await editPage({
        key: pageKey,
        newData: {title, body, userId, visible}
    });
    
    const responseStatus = result.success ? 200 : 400;
    res.status(responseStatus).json(result);
})

pages.delete('/:key', async (req, res) => {
    const pageKey = req.params.key;
    const result = await deletePage(pageKey);
    
    const responseStatus = result.success ? 200 : 400;
    res.status(responseStatus).json(result);
})

exports.pages = pages;
