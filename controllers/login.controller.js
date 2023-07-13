const userModel = require("../models/users");

exports.verify_login = async (req, res) => {
    try {
        const {email, password } = req.body;
        const ans = await userModel.find({email : email, password: password});
        if(ans == "") res.json({message:"Email or Password is incorrect"});
        else res.json({message:"correct"});;
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}