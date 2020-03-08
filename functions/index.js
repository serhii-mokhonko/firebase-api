const functions = require("firebase-functions");

const admin = require('firebase-admin');
admin.initializeApp();

var _ = require('lodash');

exports.helloWorld = functions.https.onRequest((request, response) => {
  //  response.send("Hello from Firebase!");
//   console.log("Hello World OK OK OK OK");
});