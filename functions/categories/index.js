const _ = require('lodash');
const express = require('express');
const categories = express();
const { addCategory, getCategories, delCategory, updateCategory } = require("./functions");
const { authenticate } = require('../authenticate');

categories.get("/:table", async (req, res) => {
    const { table } = req.params;
    const result = await getCategories(table);
    const status = result.success ? 200 : 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status).json(result);
});

categories.post("/:table", async (req, res) => {
    const { title } = req.body;
    const { table } = req.params;
    const isLoggedIn = await authenticate(req);
    const result = isLoggedIn.authenticated ? await addCategory(table, title) : isLoggedIn ;
    const status = result.success ? 200 : 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status).json(result);
});

categories.delete("/:table/:id", async (req, res) => {
    const { table, id } = req.params;
    const isLoggedIn = await authenticate(req);
    const result = isLoggedIn.authenticated ?  await delCategory(table, id) : isLoggedIn;
    const status = result.success ? 200 : 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status).json(result);
});

categories.put("/:table/:id", async (req, res) => {
    const { table, id } = req.params;
    const isLoggedIn = await authenticate(req);
    const result = isLoggedIn.authenticated ? await updateCategory({ table, id }, req.body) : isLoggedIn;
    const status = result.success ? 200 : 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status).json(result);
});

exports.categories = categories;