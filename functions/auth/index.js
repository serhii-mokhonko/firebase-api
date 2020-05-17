const express = require('express');
const auth = express();
const _ = require('lodash');
const { signIn, updateToken } = require("./functions");

// sign in
auth.post('/sign-in', async (req, res) => {
    const { api } = req.query;
    const { email, password } = req.body;
    const result = await signIn(api, email, password);
    const status = result.success ? 200 : 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status).json(result);
});

// refresh token
auth.post('/refresh-token', async (req, res) => {
    const { api } = req.query;
    const { refreshToken } = req.body;
    const result = await updateToken(api, refreshToken);
    const status = result.success ? 200 : 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status).json(result);
});

exports.auth = auth;