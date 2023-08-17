const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session")

const app = express();

// session 
app.use(session({
    secret: "cookie_secret",
    resave: true,
    saveUninitialized: true
}));
// db add
dotenv.config({ path: './others/.env'});
require('./db/conn');
// json
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// to set view engine
app.set("view engine", "hbs");
// static file add
const filepath = path.join(__dirname, "./public");
app.use(express.static(filepath));
// route add
app.use(require("./routes/auth"));



app.listen(3000, ()=> {
    console.log("server connected");
})

