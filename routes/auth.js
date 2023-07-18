const express = require("express");
const userModel = require("../models/users");
const { verify_login } = require("../controllers/login.controller");
const { reg_submit, form1_submit, form2_submit } = require("../controllers/registration.controller");
const { showallpost } = require("../controllers/allpost.controller");
const { post, post_detail } = require("../controllers/post.controller");
const { find_user } = require("../controllers/user_info");
const router = express.Router();

require("../db/conn");


router.get('/', (req, res) => {
    res.render("./home_page/landingpage.hbs");
})
router.get('/login', (req, res) => {
    if(req.session.user_id) 
    res.redirect("/newsfeed");
    else
    res.render("./login_reg/index.hbs");
})
router.get('/register', (req, res) => {
    res.render("./login_reg/register.hbs");
})
router.get('/newsfeed', showallpost)
router.get('/logout', (req, res) => {
    delete req.session.user_id
    res.redirect('/login')
})



router.post('/login', verify_login)
router.post('/register', reg_submit)
router.post('/register/form1', form1_submit)
router.post('/register/form2', form2_submit)
router.post('/post', post)
router.post('/post_detail', post_detail)
router.post('/user_info', find_user)

module.exports = router;