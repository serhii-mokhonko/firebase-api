const express = require('express');
const auth = express();
const _ = require('lodash');
const { authenticate } = require('../authenticate');
const { createUser, getAllUsers, deleteUser, updateUser } = require('./functions');

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
auth.post('/', async (req, res) => {
    const isLogedIn = await authenticate(req);
    const result =  isLogedIn.authenticated ? await createUser(req) : isLogedIn;

    const resStatus = result.success ? 200 : 400;
    res.status(resStatus).json(result);
});

auth.post('/checkUserToken', async (req, res) => {
    const isLogedIn = await authenticate(req);

    const resStatus = isLogedIn.authenticated ? 200 : 401;
    res.status(resStatus).json(isLogedIn);
})

//Update user
auth.put('/:id', async (req, res) => {
    const isLogedIn = await authenticate(req);
    const result =  isLogedIn.authenticated ? await updateUser(req) : isLogedIn;

    const resStatus = result.success ? 200 : 400;
    res.status(resStatus).json(result);
});

//Delete user
auth.delete('/:id', async (req, res) => {
    const isLogedIn = await authenticate(req);
    const { id } = req.params;
    const result =  isLogedIn.authenticated ? await deleteUser(id) : isLogedIn;
    
    const resStatus = result.success ? 200 : 400;
    res.status(resStatus).json(result);
});


exports.auth = auth;