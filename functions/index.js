//Firebase
const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

//Other imports
const express = require('express');
const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });


//Pages
const { pages } = require('./pages');
pages.use(express.json());
pages.use(express.urlencoded({ extended: true }));
pages.use(cors);
pages.use(cookieParser);

//News
const { news } = require('./news');
news.use(express.json());
news.use(express.urlencoded({ extended: true }));
news.use(cors);
news.use(cookieParser);

//News
const { sideBlocks } = require('./side-blocks');
sideBlocks.use(express.json());
sideBlocks.use(express.urlencoded({ extended: true }));
sideBlocks.use(cors);
sideBlocks.use(cookieParser);

//Auth
const { auth } = require('./auth');
auth.use(express.json());
auth.use(express.urlencoded({ extended: true }));

//Gallery
const { gallery } = require('./gallery');
gallery.use(cors);
gallery.use(express.json());
gallery.use(express.urlencoded({ extended: true }));

//Gallery
const { siteInfo } = require('./site-info');
siteInfo.use(cors);
siteInfo.use(express.json());
siteInfo.use(express.urlencoded({ extended: true }));


//Main exports for Firebase
exports.pages = functions.https.onRequest(pages);
exports.auth = functions.https.onRequest(auth);
exports.gallery = functions.https.onRequest(gallery);
exports.news = functions.https.onRequest(news);
exports.sideBlocks = functions.https.onRequest(sideBlocks);
exports.siteInfo = functions.https.onRequest(siteInfo);

const { deleteFromBucket, uploadFile } = require('./gallery/trigers');

// trigers
exports.deleteFromBucket =  functions.storage.object().onDelete(deleteFromBucket);
