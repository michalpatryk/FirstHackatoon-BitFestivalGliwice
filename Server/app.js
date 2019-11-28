const express = require('express');
const bodyparser = require('body-parser')


const app = express();

app.use(bodyparser.json());

app.get('/', (req, res) =>

    res.send("helloword00")
)


app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})


let port = process.env.PORT;
if (port == null || port == "") {
    port = 8080;
}

app.listen(port, () => console.log("Server started :3"))