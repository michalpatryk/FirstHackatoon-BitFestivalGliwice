const express = require('express')
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const http = require('http')
const app = express()

app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

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


    fs.readFile('html/index.html', function (err, html) {
        res.write(html);  
        res.end();
    })
})

app.get('/index.html', (req, res) => {
    var http = require('http'),
    fs = require('fs');


    fs.readFile('html/index.html', function (err, html) {
        res.write(html);  
        res.end();
    })
})

app.get('/login.html', (req, res) => {
    var http = require('http'),
    fs = require('fs');


    fs.readFile('html/login.html', function (err, html) {
        res.write(html);  
        res.end();
    })
})

app.get('/popular.html', (req, res) => {
    var http = require('http'),
    fs = require('fs');


    fs.readFile('html/popular.html', function (err, html) {
        res.write(html);  
        res.end();
    })
})

app.get('/rejestracja.html', (req, res) => {
    var http = require('http'),
    fs = require('fs');


    fs.readFile('html/rejestracja.html', function (err, html) {
        res.write(html);  
        res.end();
    })
})

app.get('/requests.html', (req, res) => {
    var http = require('http'),
    fs = require('fs');


    fs.readFile('html/requests.html', function (err, html) {
        res.write(html);  
        res.end();
    })
})

app.get('/addBubble', (req, res) => {

    const bubble = new Bubble({
        type: req.query.type,
        cordX: req.query.cordX,
        cordY: req.query.cordY,
        userId: req.query.userId.ObjectId,
        description: req.query.description
    })
    bubble.save()
    res.json({ accepted: true })
})

app.get('/signin', (req, res) => {
    User.findOne({ login: req.query.login }, (err, user) => {
        if (user == null) {
            const newUser = new User ({
                login: req.query.login,
                password: req.query.password,
                imie: req.query.imie,
                nazwisko: req.query.nazwisko
            })
            newUser.save()
            res.json({ accepted: req.query })
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
    Bubble.find({ cordX: { $gt: req.query.cordXmin }, cordX: { $lt: req.query.cordXmax }, cordY: { $gt: req.query.cordYmin }, cordY: { $lt: req.query.cordYmax } }, (err, bubbles) => {
        if ((err) || (bubbles == null)) res.json({ bubbles: [] })
        else res.json({ bubbles: bubbles })
    })
})

app.get('/getBubblesForUser', (req, res) => {
    Bubble.find({userId: req.query.userId  }, (err, bubbles) => {
        if ((err) || (bubbles == null)) res.json({ bubbles: [] })
        else res.json({ bubbles: bubbles })
    })
})

app.get('/getBubblesAllBest', (req, res) => {
    Bubble.find({}, (err, bubbles) => {
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