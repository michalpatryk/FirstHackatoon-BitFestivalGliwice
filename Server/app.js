const express = require('express');
const bodyparser = require('body-parser')

const mongoose = require("mongoose");

const app = express();

mongoose.connect('mongodb+srv://admin:admin@sekcja-spalonych-tostow-ppujf.mongodb.net/bitfestival?retryWrites=true&w=majority');

const bubbleScheme = {
    login: String
}

const Bubble = mongoose.model("Bubble", bubbleScheme);

app.use(bodyparser.json());

app.get('/', (req, res) =>

    res.send("helloword00")
)

app.get('/addBubble', (req, res) => {

    const bubble = new Bubble({
        login: req.body.login
    })
    bubble.save()
    res.json({ accepted: true })
})

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})


let port = process.env.PORT;
if (port == null || port == "") {
    port = 8080;
}

app.listen(port, () => console.log("Server started :3"))