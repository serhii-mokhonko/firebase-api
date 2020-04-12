const express = require('express');
const sideBlocks = express();
const { authenticate } = require('../authenticate');
const { getBlocks, addBlock, editBlock, deleteBlock } = require('./functions');

sideBlocks.get('/', async (req, res) => {
  const result = await getBlocks();

  const status = result.success ? 200 : 400;
  res.status(status).json(result);
});

sideBlocks.post('/', async (req, res) => {
  const { side, order, title, html, javascript } = req.body;

  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated ? await addBlock(side, order, title, html, javascript) : isLoggedIn;

  res.json(result);
});

sideBlocks.put('/:key', async (req, res) => {
  const key = req.params.key;
  const newData = req.body;

  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated ? await editBlock(key, newData) : isLoggedIn;

  res.json(result);
});

sideBlocks.delete('/:key', async (req, res) => {
  const key = req.params.key;

  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated ? await deleteBlock(key) : isLoggedIn;

  res.json(result);
});


exports.sideBlocks = sideBlocks;