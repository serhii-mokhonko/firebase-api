const express = require('express')
const functions = require("firebase-functions")
const admin = require('firebase-admin')

admin.initializeApp();

const app = express()
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 


exports.functions = functions;
exports.admin = admin;
exports.app = app;