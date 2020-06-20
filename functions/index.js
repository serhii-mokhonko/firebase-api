const functions = require("firebase-functions");

const admin = require('firebase-admin');
admin.initializeApp();

const express = require('express');
const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: '*' });

const { pages } = require('./pages');

pages.use(express.json());
pages.use(express.urlencoded({ extended: true }));
pages.use(cors);
pages.use(cookieParser);

exports.pages = functions.https.onRequest(pages);
