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
    // const auth = authenticate(token);
    const result = await addCategory(title);
    const status = result.success ? 200 : 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status).json(result);
});

categories.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const result = await delCategory(id);
    const status = result.success ? 200 : 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status).json(result);
});

categories.put("/:id", async (req, res) => {
    const { id } = req.params;
    const result = await updateCategory(id, req.body);
    const status = result.success ? 200 : 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status).json(result);
});

exports.categories = categories;