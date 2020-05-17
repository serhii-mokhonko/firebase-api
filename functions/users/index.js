const express = require('express');
const users = express();
const _ = require('lodash');
const { authenticate } = require('../authenticate');
const { createUser, getAllUsers, deleteUser, updateUser } = require('./functions');

//List of all users
users.get('/', async (req, res) => {
    let { limit, nextPageToken } = req.query;
    limit = _.isEmpty(limit) ? 1000 : limit;
    
    const isLogedIn = await authenticate(req);
    const result = isLogedIn.authenticated ? await getAllUsers(parseInt(limit), nextPageToken) : isLogedIn;
    
    const resStatus = result.success ? 200 : 400;
    res.status(resStatus).json(result);
});

//Create new user
users.post('/', async (req, res) => {
    const isLogedIn = await authenticate(req);
    const result =  isLogedIn.authenticated ? await createUser(req) : isLogedIn;

    const resStatus = result.success ? 200 : 400;
    res.status(resStatus).json(result);
});

//Update user
users.put('/:id', async (req, res) => {
    const isLogedIn = await authenticate(req);
    const result =  isLogedIn.authenticated ? await updateUser(req) : isLogedIn;

    const resStatus = result.success ? 200 : 400;
    res.status(resStatus).json(result);
});

//Delete user
users.delete('/:id', async (req, res) => {
    const isLogedIn = await usersenticate(req);
    const { id } = req.params;
    const result =  isLogedIn.authenticated ? await deleteUser(id) : isLogedIn;
    
    const resStatus = result.success ? 200 : 400;
    res.status(resStatus).json(result);
});


exports.users = users;