const userModel = require("../models/users")


exports.verify_login = async (req, res) => {
    try {
        const {email, password } = req.body;

        if(email == "admin@free2work.com" && password == "12") {
            res.json({message:"admin"});
        }
        else {
            const ans = await userModel.find({email : email, password: password});
            if(ans == "") res.json({message:"Email or Password is incorrect"});
            else {
                req.session.user_id = ans[0]._id
                res.json({message:"correct", id : ans[0]._id});
            }
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}