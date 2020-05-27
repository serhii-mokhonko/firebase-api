const _ = require('lodash');
const express = require('express');
const categories = express();
const { addCategory, getCategories, delCategory, updateCategory } = require("./functions");
const { authenticate } = require('../authenticate');

categories.get("/", async (req, res) => {
    const result = await getCategories();
    const status = result.success ? 200 : 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status).json(result);
});

categories.post("/", async (req, res) => {
    const { title } = req.body;
    const isLoggedIn = await authenticate(req);
    const result = isLoggedIn.authenticated ? await addCategory(title) : isLoggedIn ;
    const status = result.success ? 200 : 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status).json(result);
});

categories.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const isLoggedIn = await authenticate(req);
    const result = isLoggedIn.authenticated ?  await delCategory(id) : isLoggedIn;
    const status = result.success ? 200 : 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status).json(result);
});

categories.put("/:id", async (req, res) => {
    const { id } = req.params;
    const isLoggedIn = await authenticate(req);
    const result = isLoggedIn.authenticated ? await updateCategory(id, req.body) : isLoggedIn;
    const status = result.success ? 200 : 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status).json(result);
});

exports.categories = categories;