const express = require('express')
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const app = express()


app.use(bodyParser.json())
//app.use(bodyParser.urlencoded())



mongoose.connect('mongodb+srv://admin:admin@sekcja-spalonych-tostow-ppujf.mongodb.net/bitfestival?retryWrites=true&w=majority',{ useUnifiedTopology: true, useNewUrlParser: true });

const bubbleScheme = {
    type: String,
    cordX: Number,
    cordY: Number,
    userId: mongoose.Schema.Types.ObjectId,
    description: String,
    like: [mongoose.Schema.Types.ObjectId],
    dislike: [mongoose.Schema.Types.ObjectId]
}

const userScheme = {
    login: String,
    password: String,
    imie: String,
    nazwisko: String
}

const Bubble = mongoose.model("Bubble", bubbleScheme);
const User = mongoose.model("User", userScheme);



app.get('/', (req, res) => {
    var http = require('http'),
    fs = require('fs');


    fs.readFile('../Client Web/index.html', function (err, html) {
        res.write(html);  
        res.end();
    })
})

app.get('/login.html', (req, res) => {
    var http = require('http'),
    fs = require('fs');


    fs.readFile('../Client Web/login.html', function (err, html) {
        res.write(html);  
        res.end();
    })
})

app.get('/addBubble', (req, res) => {

    const bubble = new Bubble({
        type: req.body.type,
        cordX: req.body.cordX,
        cordY: req.body.cordY,
        userId: req.body.userId.ObjectId,
        description: req.body.description
    })
    bubble.save()
    res.json({ accepted: true })
})

app.get('/signIn', (req, res) => {
    User.findOne({ login: req.body.login }, (err, user) => {
        if (user == null) {
            const newUser = new User ({
                login: req.body.login,
                password: req.body.password,
                imie: req.body.imie,
                nazwisko: req.body.nazwisko
            })
            newUser.save()
            res.json({ accepted: true })
        } else {
            res.json({ accepted: false })
        }
    })
})


app.get('/login', async (req, res) => {
    await User.findOne({ login: req.query.login }, (err, user) => {
                    if ((user == null)) res.json({ accepted: false })
        else {
            if (user.password == req.query.password) {
                res.json({ accepted: true })
            }
            else
                res.json({ accepted: false })
        }
        // res.json({ accepted: true })
    })
})

app.get('/vote', async (req, res) => {
    // Bubble.findById(req.body.bubbleId.ObjectId, async (errb, bub) => {
    //     if (bub != null) {
    //         Bubble.find({ _id: req.body.bubbleId.ObjectId, like: { $all: [req.body.userId.ObjectId] } }, async (errt, tab) => {
    //             if (tab == null) {
    //                 await Bubble.updateOne({ _id: req.body.bubbleId.ObjectId }, {  $push: { like: req.body.userId.ObjectId } });
    //                 res.json({ accepted: true })
    //             } else {
    //                 res.json({ tab: tab })
    //             }
    //         })
    //     }
    // })
    if (req.body.vote == "like") {
        await Bubble.updateOne({ _id: req.body.bubbleId.ObjectId }, {  $push: { like: req.body.userId.ObjectId } });
        res.json({ accepted: true })
    } else {
        await Bubble.updateOne({ _id: req.body.bubbleId.ObjectId }, {  $push: { dislike: req.body.userId.ObjectId } });
        res.json({ accepted: true })
    }
})

app.get('/getBubbles', (req, res) => {
    Bubble.find({ cordX: { $gt: req.body.cordXmin }, cordX: { $lt: req.body.cordXmax }, cordY: { $gt: req.body.cordYmin }, cordY: { $lt: req.body.cordYmax } }, (err, bubbles) => {
        if ((err) || (bubbles == null)) res.json({ bubbles: [] })
        else res.json({ bubbles: bubbles })
    })
})

app.use(function (req, res, next) {
    res.status(404).send("This is not the addres you are looking for.")
})


let port = process.env.PORT;
if (port == null || port == "") {
    port = 8080;
}

app.listen(port, () => console.log("Server started :3"))