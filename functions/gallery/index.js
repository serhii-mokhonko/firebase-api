const express = require('express');
const gallery = express();
const _ = require('lodash');
// const { authenticate } = require('../authenticate');



//Get all pics
gallery.get('/', (req, res) => {
    res.json({test: true});
});

//Upload pics
gallery.post('/', (req, res) => {
    res.status(200).json({status: "Ok"});
});

exports.gallery = gallery;