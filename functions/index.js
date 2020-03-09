const { app, admin, functions } = require('./firebase-setup.js')
const { RESPONSE_MESSAGES } = require('./response-messages.js')
const _ =  require('lodash')

const getPage = async (key) => {
    const snapshot = await admin.database().ref(`/pages/${key}`).once('value')
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
    const { title, body } = newData;
    if(_.isEmpty(title) || _.isEmpty(body)) 
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.PAGES.FIELDS_EMPTY
        }

    await admin.database().ref(`/pages/${key}`).update({title, body});
    return {
        success: true,
        message: 'EDITED'
    }
}

const deletePage = async (key) => {
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

app.get('/:key', async (req, res) => {
    const pageKey = req.params.key;
    const result = await getPage(pageKey);
    
    const responseStatus = result.success ? 200 : 400;
    res.status(responseStatus).json(result);
})

app.post(`/`, async (req, res) => {
    const {title, body} = req.body;
    const result = await addPage({title, body});
    
    const responseStatus = result.success ? 201 : 400;
    res.status(responseStatus).json(result);
})

app.put(`/:key`, async (req, res) => {
    const pageKey = req.params.key;
    const {title, body} = req.body;

    const result = await editPage({
        key: pageKey,
        newData: {title, body}
    });
    
    const responseStatus = result.success ? 200 : 400;
    res.status(responseStatus).json(result);
})

app.delete('/:key', async (req, res) => {
    const pageKey = req.params.key;
    const result = await deletePage(pageKey);
    
    const responseStatus = result.success ? 200 : 400;
    res.status(responseStatus).json(result);
})

exports.pages = functions.https.onRequest(app);
