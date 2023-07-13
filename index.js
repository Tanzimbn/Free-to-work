const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
// db add
dotenv.config({ path: './.env'});
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

