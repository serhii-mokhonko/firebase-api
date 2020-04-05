const express = require('express');
const news = express();
const { getNews, addNews, editNews, deleteNews } = require('./functions');

news.get('/', async (req, res) => {
  const { startFrom, count } = req.query;  
  const result = await getNews(parseInt(startFrom), parseInt(count));

  const status = result.success ? 200 : 400;
  res.status(status).json(result);
});

news.post('/', async (req, res) => {
  const result = await addNews(req.body);

  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

news.put('/:key', async (req, res) => {
  const key = req.params.key;
  const newData = req.body;
  const result = await editNews(key, newData);

  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

news.delete('/:key', async (req, res) => {
  const key = req.params.key;

  const result = await deleteNews(key);

  const status = result.success ? 200 : 400;
  res.status(status).json(result);
});


exports.news = news;