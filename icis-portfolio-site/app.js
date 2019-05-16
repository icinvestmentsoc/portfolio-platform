const express = require('express');
const handlebars = require('express-handlebars');
const moreHandlebars = require('./helpers/handlebars.js')(handlebars); // should we wish to use more handlebar operators, we ccan find them in the helpers/handlebars.js
const http = require('http');
const path = require('path');
const mongoose = require('mongoose'); // client for mongoDB
const session = require('express-session'); // middleware that allows us to store user session data for if they wish to be logged in when they come back later
const bodyParser = require('body-parser'); // will be used for POST handling
const schedule = require("node-schedule-tz");

const transHandler = require("./helpers/transactionHandler");
const instrumHandler = require("./helpers/instrumentHandler");

var app = express();
var server = http.Server(app);
var hbs = handlebars.create();

app.engine('hbs', moreHandlebars.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'max', saveUninitialized: false, resave: false}));

/* Establish connection with mongoDB server for our mongoose client */
mongoose.connect("mongodb://admin:pass@cluster0-shard-00-00-jai9z.mongodb.net:27017,cluster0-shard-00-01-jai9z.mongodb.net:27017,cluster0-shard-00-02-jai9z.mongodb.net:27017/icisportfolio?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true", {useNewUrlParser: true});
/**
 *  mongodb.com Credentials for db testing (will migrate later):
 *  Email: h.illiamtung@gmail.com
 *  Pass: icisplatformtest2019!
 *  db_user: admin
 *  db_pass: pass
 */

app.get("/", (req, res) => {
    res.render("index.hbs");
});

app.get("/admin", (req, res) => {
    res.render("admin.hbs");
})

app.post("/excelInput", (req, res) => {
    var transactions = JSON.parse(req.body.data);
    console.log(transactions);
    transHandler.handleIncomingTransactions(transactions);
    res.end("Working");
});

app.get("/transactions", (req, res) => {
    transHandler.getTransactions((err, data) => {
        res.json(data);
    });
});

app.get("/portfolio", (req, res) => {
    transHandler.getActiveTransactions((err, data) => {
        res.json(data);
    });
});

app.post("/newWatchlist", (req, res) => {
    // POST w:
    // userid
    // instruments[]
    res.end();
});

app.get("/latestPrices", (req, res) => {
    if (req.query.symbol) {
        instrumHandler.getLatestInstrument(req.query.symbol, (err, data) => {
            res.json(data);
        });
    } else {
        instrumHandler.getLatestInstruments((err, data) => {
            res.json(data);
        });
    }
});

schedule.scheduleJob("Price Tracking", "0 0 * * *", "Europe/London", () => {
    instrumHandler.ping();
});

server.listen(3000, function() {
    console.log('listening on localhost:' + 3000);
});



