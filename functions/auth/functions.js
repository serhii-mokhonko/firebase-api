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

    if(_.isEmpty(email) || _.isEmpty(password))
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

exports.getAllUsers = async (limit, pageToken) => {
    const users = [];
    try{
        const listUsers = await admin.auth().listUsers(limit, pageToken);
        console.log("TOKEN:", listUsers.pageToken);
        listUsers.users.forEach(el => {
            users.push(el);
        });
            if(listUsers.pageToken)
                return {
                    success: true,
                    result: users,
                    nextPage: listUsers.pageToken
                }

            return {
                success: true,
                result: users
            }
    }catch(e){
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.AUTH.USERS_LIST
        }
    }
};

exports.deleteUser = async (id) => {
    try{
        await admin.auth().deleteUser(id);
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.AUTH.DELETED
        }
    }catch(e){
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.AUTH.NOT_DELETE
        }
    }
};

exports.updateUser = async (req) => {
    const { id } = req.params;
    let { email, password } = req.body;

    if(_.isEmpty(email) || _.isEmpty(password))
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.AUTH.ERROREMAILORPASS
        };
    
    if(password.length < 6)
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.AUTH.LENGTH_OF_PASS
        }

    // Need fixed problem with email to the same user
    // if(await checkUser(email))
    //     return {
    //         success: false,
    //         message: RESPONSE_MESSAGES.REJECT.AUTH.USER_EXISTS
    //     }

    try{
        await admin.auth().updateUser(id, { email, password });
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.AUTH.UPDATED
        }
    }catch(e){
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.AUTH.NOT_UPDATE
        }
    }
};