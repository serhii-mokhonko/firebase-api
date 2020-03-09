const { pages, admin } = require('./setup.js')
const { RESPONSE_MESSAGES } = require('../response-messages.js')
const _ =  require('lodash')

const checkValue = async (key, ref) => {
    const snapshot = await admin.database().ref(`/${ref}/${key}`).once('value');
    return snapshot.val();
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
        data: snapshot.val()
    }

}

const addPage = async ({ title, body }) => {
    if(_.isEmpty(title) || _.isEmpty(body)) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.PAGES.FIELDS_EMPTY
        }

    const snapshot = await admin.database().ref('/pages').push({title, body})
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

    const { title, body } = newData;
    if(_.isEmpty(title) || _.isEmpty(body)) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.PAGES.FIELDS_EMPTY
        }

    await admin.database().ref(`/pages/${key}`).update({title, body});
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
    const result = await getPage(pageKey);
    
    const responseStatus = result.success ? 200 : 400;
    res.status(responseStatus).json(result);
})

pages.post(`/`, async (req, res) => {
    const {title, body} = req.body;
    const result = await addPage({title, body});
    
    const responseStatus = result.success ? 201 : 400;
    res.status(responseStatus).json(result);
})

pages.put(`/:key`, async (req, res) => {
    const pageKey = req.params.key;
    const {title, body} = req.body;

    const result = await editPage({
        key: pageKey,
        newData: {title, body}
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
