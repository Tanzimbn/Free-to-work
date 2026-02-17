exports.check_login = (req, res) => {
    if(req.session.user_id) {
        if(req.session.user_id == "admin@free2work.com") {
            res.json({ loggedIn: true, role: "admin" });
        } else {
            res.json({ loggedIn: true, role: "user" });
        }
    }
    else {
        res.json({ loggedIn: false });
    }
}