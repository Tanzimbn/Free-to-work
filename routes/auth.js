const express = require("express");
const userModel = require("../models/users");
const { verify_login } = require("../controllers/login.controller");
const { reg_submit, form1_submit, form2_submit } = require("../controllers/registration.controller");
const { showallpost } = require("../controllers/allpost.controller");
const router = express.Router();

require("../db/conn");


router.get('/', (req, res) => {
    res.render("./home_page/landingpage.hbs");
})
router.get('/login', (req, res) => {
    res.render("./login_reg/index.hbs");
})
router.get('/register', (req, res) => {
    res.render("./login_reg/register.hbs");
})
router.get('/newsfeed', showallpost)



router.post('/login', verify_login)
router.post('/register', reg_submit)
router.post('/register/form1', form1_submit)
router.post('/register/form2', form2_submit)
module.exports = router;