const express = require('express');
const auth = express();
const _ = require('lodash');
const { authenticate } = require('../authenticate');
const { createUser, getAllUsers } = require('./functions');

//List of all users
auth.get('/', async (req, res) => {
    let { limit, nextPageToken } = req.query;
    limit = _.isEmpty(limit) ? 1000 : limit;
    
    const isLogedIn = await authenticate(req);
    const result = isLogedIn.authenticated ? await getAllUsers(parseInt(limit), nextPageToken) : isLogedIn;
    const resStatus = result.success ? 200 : 400;
    res.status(resStatus).json(result);
});

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