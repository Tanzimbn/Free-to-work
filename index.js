'use strict';

// config must be the first import — it loads dotenv and validates env vars
const config = require('./config');

const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
    origin: config.cors.origins,
    credentials: true,
}));

app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, sameSite: 'strict' },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

require('./db/conn');

app.use('/api', require('./routes/auth'));

// Global error handler — must be last
app.use(errorHandler);

// app.use(express.static(path.join(__dirname, 'client/dist')));
// app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/dist/index.html')));

app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
});