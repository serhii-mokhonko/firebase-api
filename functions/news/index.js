const express = require('express');
const news = express();
const { getNews, addNews, editNews, deleteNews } = require('./functions');

const { authenticate } = require('../authenticate');

news.get('/', async (req, res) => {
  const { startFrom, count } = req.query;  
  const result = await getNews(parseInt(startFrom), parseInt(count));

  const status = result.success ? 200 : 400;
  res.status(status).json(result);
});

news.post('/', async (req, res) => {
  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated ? await addNews(req.body) : isLoggedIn;
  res.json(result);
});

news.put('/:key', async (req, res) => {
  const key = req.params.key;
  const newData = req.body;
  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated ? await editNews(key, newData) : isLoggedIn;

  res.json(result);
});

news.delete('/:key', async (req, res) => {
  const key = req.params.key;

  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated ? await deleteNews(key) : isLoggedIn;
  res.json(result);
});


exports.news = news;