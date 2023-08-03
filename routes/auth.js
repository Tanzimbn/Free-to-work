const express = require("express");
const userModel = require("../models/users");
const { verify_login } = require("../controllers/login.controller");
const { reg_submit, form1_submit, form2_submit, email_confirmed } = require("../controllers/registration.controller");
const { showallpost } = require("../controllers/allpost.controller");
const { post, post_detail } = require("../controllers/post.controller");
const { find_user } = require("../controllers/user_info");
const { own_profile, show_profile, load_image, review, load_coverimage, edit_user_info, delete_post } = require("../controllers/profile");
const { update_bid } = require("../controllers/bid.controller");
const { post_filter } = require("../controllers/filter");
const { show_list, list_filter } = require("../controllers/list.controller");
const router = express.Router();

require("../db/conn");
const multer = require("multer");
const imageModel = require("../models/image");
const coverModel = require("../models/cover");
const reportModel = require("../models/reports");
const { feedback } = require("../controllers/feedback.controller");
const { admin_data, block_user, report_process, category, allcategory } = require("../controllers/admin.controller");


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
router.get('/admin', admin_data)
router.get('/newsfeed', showallpost)
router.get('/logout', (req, res) => {
    delete req.session.user_id
    res.redirect('/login')
})
router.get('/profile/:id', show_profile)
router.get('/profile', own_profile)
router.get('/list', show_list)
router.get('/verify/:id', email_confirmed)


// router.post('/admin_data', admin_data)
router.post('/feedback', feedback)
router.post('/login', verify_login)
router.post('/register', reg_submit)
router.post('/register/form1', form1_submit)
router.post('/register/form2', form2_submit)
router.post('/post', post)
router.post('/post_detail', post_detail)
router.post('/user_info', find_user)
router.post('/update_bid', update_bid)
router.post('/post_filter', post_filter)
router.post('/list_filter', list_filter)
router.post('/review', review)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage:storage})
router.post('/edit_user',upload.single('testImage'), load_image)
router.post('/edit_user_info',upload.single('testImage'), edit_user_info)
router.post('/edit_cover',upload.single('testImage'), load_coverimage)
router.post('/user_data', async (req, res) => {
    const allpost = await userModel.find({_id : req.body.id});
    res.json(allpost)
})
router.post('/cover_data', async (req, res) => {
    const allpost = await coverModel.find({id : req.body.id});
    res.json(allpost)
})
router.post('/report', async (req, res) => {
    try {
        const new_report = new reportModel({
            reporter_id: req.session.user_id,
            to: req.body.to,
            reason: req.body.reportReason,
            comments: req.body.additionalComments
        })
        const resp = await new_report.save();
        res.redirect(`/profile/${req.body.to}`);

    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
})
router.post('/report_process', report_process)
router.post('/delete_post', delete_post)
router.post('/update_mood', async (req, res) => {
    const allpost = await userModel.updateOne({_id : req.session.user_id}, { $set: {mood : req.body.check}});
    res.json(allpost)
})
router.post('/block_user', block_user)
router.post('/category', category)
router.post('/allcategory', allcategory)

module.exports = router;