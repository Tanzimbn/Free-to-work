const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const cors = require("cors");

const app = express();

// session 
app.use(session({
    secret: "cookie_secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(cors({
    origin: "http://localhost:5173", // Allow Vite frontend
    credentials: true
}));

// db add
dotenv.config({ path: './.env'});
require('./db/conn');
// json
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// static file add (for uploaded images)
const filepath = path.join(__dirname, "./public"); // Keep this for existing assets if needed, or point to uploads
app.use(express.static(filepath));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// route add
app.use('/api', require("./routes/auth"));

// Serve React frontend in production
// app.use(express.static(path.join(__dirname, "client/dist")));
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/dist/index.html"));
// });

app.listen(3000, ()=> {
    console.log("server connected");
})

