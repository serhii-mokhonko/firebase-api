const functions = require("firebase-functions");

const { pages } = require('./pages');

exports.pages = functions.https.onRequest(pages);
