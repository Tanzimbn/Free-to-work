const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
const cors = require("cors");

const app = express();

app.use(session({
    secret: "cookie_secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(cors({
    origin: "http://localhost:5174",
    credentials: true
}));

dotenv.config({ path: './.env'});
require('./db/conn');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', require("./routes/auth"));

// app.use(express.static(path.join(__dirname, "client/dist")));
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/dist/index.html"));
// });

app.listen(3000, ()=> {
    console.log("server connected running on http://localhost:3000");
})
