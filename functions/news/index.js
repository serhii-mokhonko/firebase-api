const _ = require('lodash');
const express = require('express');
const news = express();
const { getNews, getSingleRecord, addNews, editNews, deleteNews, searchNews } = require('./functions');

const { authenticate } = require('../authenticate');

news.get('/', async (req, res) => {
  let { startAt, itemsOnPage, q } = req.query;
  let result;
  if(!_.isEmpty(q)){
    result = await searchNews(q, startAt, itemsOnPage);
  } else {
    result = await getNews(startAt, itemsOnPage);
  }

  const status = result.success ? 200 : 400;
  res.set('Access-Control-Allow-Origin', '*');
  res.status(status).json(result);
});

news.get("/:key", async (req, res) => {
  const key = req.params.key;
  const result = await getSingleRecord(key);
  const status = result.success ? 200 : 400;
  res.set('Access-Control-Allow-Origin', '*');
  res.status(status).json(result);
});

news.post('/', async (req, res) => {
  const isLoggedIn = await authenticate(req);
  const { title, description, content, photo, visible } = req.body;
  const result = isLoggedIn.authenticated 
    ? await addNews({ title, content, photo, authorId: isLoggedIn.userID, description, visible }) 
    : isLoggedIn;
  res.set('Access-Control-Allow-Origin', '*');
  res.json(result);
});

news.put('/:key', async (req, res) => {
  const key = req.params.key;
  const { title, description, photo, content, visible } = req.body;
  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated 
    ? await editNews(key, { title, description, content, photo, userIdUpdate: isLoggedIn.userID, visible }) 
    : isLoggedIn;
  res.set('Access-Control-Allow-Origin', '*');
  res.json(result);
});

news.delete('/:key', async (req, res) => {
  const key = req.params.key;

  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated ? await deleteNews(key) : isLoggedIn;
  res.set('Access-Control-Allow-Origin', '*');
  res.json(result);
});


exports.news = news;