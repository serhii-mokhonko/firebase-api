const express = require('express')
const admin = require('firebase-admin')

admin.initializeApp();

const pages = express()
pages.use(express.json()) 
pages.use(express.urlencoded({ extended: true })) 

exports.admin = admin;
exports.pages = pages;