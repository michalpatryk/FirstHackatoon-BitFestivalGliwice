const express = require('express');
const bodyparser = require('body-parser')

const mongoose = require("mongoose");

const app = express();

mongoose.connect('mongodb+srv://admin:admin@sekcja-spalonych-tostow-ppujf.mongodb.net/bitfestival?retryWrites=true&w=majority');

const bubbleScheme = {
    type: String,
    cordX: Number,
    cordY: Number,
    userID: mongoose.Schema.Types.ObjectId,
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

app.use(bodyparser.json());

app.get('/', (req, res) =>

    res.send("helloword00")
)

app.get('/addBubble', (req, res) => {

    const bubble = new Bubble({
        type: req.body.type,
        cordX: req.body.cordX,
        cordY: req.body.cordY,
        userID: req.body.userID.ObjectId,
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


app.get('/login', (req, res) => {
    User.findOne({ login: req.body.login }, (err, user) => {
        if ((err) || (user == null)) res.json({ accepted: false })
        else {
            if (user.password == req.body.password) {
                res.json({ accepted: true })
            }
            else
                res.json({ accepted: false })
        }
    res.json({ accepted: true })
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