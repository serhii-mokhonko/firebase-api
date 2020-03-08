const express = require('express');
// const cors = require('cors');

const app = express();
// app.use(cors({ origin: false }));

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

const addPage = async ({ title, body }) => {
    if(!title || !body) 
        return false

    await admin.database().ref('/pages').push({title, body})
    return true
}

// app.get('/:id', (req, res) => res.send('HELLO ' + req.params.id));

app.post(`/`, async (req, res) => {
    console.log(req.body)
    const {title, body} = req.body;
    const result = await addPage({title, body});

    if(!result) 
        res.status(400).send("not cool");

    res.status(201).send("cool");
})

exports.pages = functions.https.onRequest(app);
