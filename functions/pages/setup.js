const express = require('express')
const admin = require('firebase-admin')
const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });
const {validateFirebaseIdToken} = require('./validate');

admin.initializeApp();

const pages = express()
pages.use(express.json()) 
pages.use(express.urlencoded({ extended: true }))
pages.use(cors);
pages.use(cookieParser);
pages.use(validateFirebaseIdToken);

exports.admin = admin;
exports.pages = pages;