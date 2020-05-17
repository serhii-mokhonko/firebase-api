const admin = require('firebase-admin');
const _ = require('lodash');
const fetch = require("node-fetch");
const { RESPONSE_MESSAGES } = require("./response-messages");

const query = async (url, options) => {
    try {
        const query = await fetch(url, options);
        const res = await query.json();
        return {
            success: true,
            data: res
        }
    } catch (err) {
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.ERROR,
            error: err.message
        }
    }
};

exports.signIn = async (api, email, password) => {
    if (_.isEmpty(api))
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_EMAIL_OR_PASS
        }

    if (_.isEmpty(email) || _.isEmpty(password))
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_REFRESH_TOKEN
        }

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api}`;
    const data = {
        email,
        password,
        returnSecureToken: true
    };

    const options = {
        method: "POST",
        body: JSON.stringify(data)
    };

    return await query(url, options);
};

exports.updateToken = async (api, refreshToken) => {
    if (_.isEmpty(api))
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_API
        }

    if (_.isEmpty(refreshToken))
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_REFRESH_TOKEN
        }

    const url = `https://securetoken.googleapis.com/v1/token?key=${api}`;
    const data = {
        grant_type: "refresh_token",
        refresh_token: refreshToken
    };

    const options = {
        method: "POST",
        body: JSON.stringify(data)
    };

    return await query(url, options);
};