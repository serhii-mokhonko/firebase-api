const admin = require('firebase-admin');
const _ = require('lodash');
const { RESPONSE_MESSAGES } = require('../response-messages.js');

const checkUser = async (email) => {
    try{
        const userRecord = await admin.auth().getUserByEmail(email);
        return userRecord.uid ? true : false;
    } catch(e){
        return false;
    }
}

exports.createUser = async (req) => {
    let {email, password, displayName, emailVerified, disabled} = req.body;

    displayName = _.isEmpty(displayName) && "John Dou";
    emailVerified = _.isEmpty(emailVerified) && false;
    disabled = _.isEmpty(disabled) && false;

    //Check email
    const isUser = await checkUser(email);
    if(isUser)
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.AUTH.USER_EXISTS
        };

    if(_.isEmpty(email) && _.isEmpty(password))
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.AUTH.ERROREMAILORPASS
        }

    //Create user
    try{
        admin.auth().createUser({email, password, displayName, emailVerified, disabled});
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.AUTH.CREATED
        }

    }catch(e){
        console.error("ERROR:", e);
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.AUTH.NOT_CREATED
        }

    }
};