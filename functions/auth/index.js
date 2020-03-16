const express = require('express');
const auth = express();

const { authenticate } = require('../authenticate');
const { createUser } = require('./functions');

//List all users

//Create new user
auth.post('/register', async (req, res) => {
    const isLogedIn = await authenticate(req);
    const result =  isLogedIn.authenticated ? await createUser(req) : isLogedIn;

    const resStatus = result.success ? 200 : 400;
    res.status(resStatus).json(result);
});

//Update user

//Delete user


exports.auth = auth;