const express = require('express');
const siteInfo = express();
const { getSiteInfo, addSiteInfo, editSiteInfo, deleteSiteInfo } = require('./functions');

siteInfo.get('/', async (req, res) => {
  const result = await getSiteInfo();

  const status = result.success ? 200 : 400;
  res.status(status).json(result);
});

siteInfo.post('/', async (req, res) => {
  const { key, value } = req.body;
  const result = await addSiteInfo(key, value);

  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

siteInfo.put('/:key', async (req, res) => {
  const key = req.params.key;
  const newData = req.body;
  const result = await editSiteInfo(key, newData);

  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

siteInfo.delete('/:key', async (req, res) => {
  const key = req.params.key;

  const result = await deleteSiteInfo(key);

  const status = result.success ? 200 : 400;
  res.status(status).json(result);
});

exports.siteInfo = siteInfo;