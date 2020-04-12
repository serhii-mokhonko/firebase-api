const express = require('express');
const siteInfo = express();
const { authenticate } = require('../authenticate');
const { getSiteInfo, addSiteInfo, editSiteInfo, deleteSiteInfo } = require('./functions');

siteInfo.get('/', async (req, res) => {
  const result = await getSiteInfo();

  const status = result.success ? 200 : 400;
  res.status(status).json(result);
});

siteInfo.post('/', async (req, res) => {
  const { key, value } = req.body;

  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated ? addSiteInfo(key, value) : isLoggedIn;

  res.json(result);
});

siteInfo.put('/:key', async (req, res) => {
  const key = req.params.key;
  const newData = req.body;

  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated ? await editSiteInfo(key, newData) : isLoggedIn;

  res.json(result);
});

siteInfo.delete('/:key', async (req, res) => {
  const key = req.params.key;

  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated ? await deleteSiteInfo(key) : isLoggedIn;

  res.json(result);
});

exports.siteInfo = siteInfo;