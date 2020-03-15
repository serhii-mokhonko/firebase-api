const admin = require('firebase-admin');
const express = require('express');
const auth = express();

const { RESPONSE_MESSAGES } = require('../response-messages.js');
const _ =  require('lodash');

auth.get('/', (req, res) => {
    res.json({
        response: "Hello"
    });
});

exports.auth = auth;