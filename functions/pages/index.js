const _ = require('lodash');
const express = require('express');
const pages = express();
const { getPages, getSingleRecord, addPage, editPage, deletePage, searchPages } = require('./functions');

const { authenticate } = require('./authenticate');

pages.get('/', async (req, res) => {
  let { startAt, itemsOnPage, q } = req.query;
  let result;
  if(!_.isEmpty(q)){
    result = await searchPages(q, startAt, itemsOnPage);
  } else {
    result = await getPages(startAt, itemsOnPage);
  }

  const status = result.success ? 200 : 400;
  res.set('Access-Control-Allow-Origin', '*');
  res.status(status).json(result);
});

pages.get("/:key", async (req, res) => {
  const key = req.params.key;
  const result = await getSingleRecord(key);
  const status = result.success ? 200 : 400;
  res.set('Access-Control-Allow-Origin', '*');
  res.status(status).json(result);
});

pages.post('/', async (req, res) => {
  const isLoggedIn = await authenticate(req);
  const { title, description, content, visible, category } = req.body;
  const result = isLoggedIn.authenticated 
    ? await addPage({ title, content, authorId: isLoggedIn.userID, category, visible }) 
    : isLoggedIn;
  res.set('Access-Control-Allow-Origin', '*');
  res.json(result);
});

pages.put('/:key', async (req, res) => {
  const key = req.params.key;
  const { title, category, content, visible } = req.body;
  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated 
    ? await editPage(key, { title, category, content, userIdUpdate: isLoggedIn.userID, visible }) 
    : isLoggedIn;
  res.set('Access-Control-Allow-Origin', '*');
  res.json(result);
});

pages.delete('/:key', async (req, res) => {
  const key = req.params.key;

  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated ? await deletePage(key) : isLoggedIn;
  res.set('Access-Control-Allow-Origin', '*');
  res.json(result);
});


exports.pages = pages;