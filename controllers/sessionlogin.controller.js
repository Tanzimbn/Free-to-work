exports.check_login = (req, res) => {
    if(req.session.user_id) {
        if(req.session.user_id == "admin@free2work.com") res.redirect("/admin")
        else res.redirect("/newsfeed");
    }
    else
    res.render("./login_reg/index.hbs");
}