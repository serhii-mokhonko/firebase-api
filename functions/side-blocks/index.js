const express = require('express');
const sideBlocks = express();
const { getBlocks, addBlock, editBlock, deleteBlock } = require('./functions');

sideBlocks.get('/', async (req, res) => {
  const result = await getBlocks();

  const status = result.success ? 200 : 400;
  res.status(status).json(result);
});

sideBlocks.post('/', async (req, res) => {
  const { side, order, title, html, javascript } = req.body;
  const result = await addBlock(side, order, title, html, javascript);

  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

sideBlocks.put('/:key', async (req, res) => {
  const key = req.params.key;
  const newData = req.body;
  const result = await editBlock(key, newData);

  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

sideBlocks.delete('/:key', async (req, res) => {
  const key = req.params.key;

  const result = await deleteBlock(key);

  const status = result.success ? 200 : 400;
  res.status(status).json(result);
});


exports.sideBlocks = sideBlocks;