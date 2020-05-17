const express = require('express');
const auth = express();
const _ = require('lodash');
const { updateToken } = require("./functions");

// refresh token
auth.post('/refresh-token', async (req, res) => {
    const { api } = req.query;
    const { refreshToken } = req.body;
    const result = await updateToken(api, refreshToken);
    res.status(200).json(result);
});

exports.auth = auth;