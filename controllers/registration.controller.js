const userModel = require("../models/users");
const emailValidator = require("email-validator");

exports.reg_submit = async (req, res) => {
    try {
        const new_user = new userModel({
            fname: req.body.fname,
            lname: req.body.lname,
            nid: req.body.nid,
            gender: req.body.gender,
            email : req.body.email,
            password : req.body.password,
            phone: req.body.phone,
            division: req.body.division,
            district: req.body.district,
            station: req.body.station
        })
        const register = await new_user.save();
        console.log("Done");
        res.send({"message" : "Successfull"});

    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

exports.form1_submit = async (req, res) => {
    try {
        const {fname, nid} = req.body;
        const ans = await userModel.find({nid : nid});
        if(fname.length == 0) res.json({"message" : "Enter first name"})
        else if(ans == "" && nid.length == 10) res.json({"message" : "Valid"});
        else res.json({"message" : "Invalid nid"});

    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

exports.form2_submit = async (req, res) => {
    try {
        const {email, Station, phone} = req.body;
        if(phone.length != 11) {
            res.json({"message" : "Invalid phone number"});
        }
        else if(emailValidator.validate(email)) {
            if(Station == "") {
                res.json({"message" : "Select police station"});
            }
            else {
                const ans = await userModel.find({email : email});
                if(ans == "") res.json({"message" : "Valid"});
                else res.json({"message" : "Invalid email"});
            }
        }
        else {
            res.json({"message" : "Invalid email"});
        }

    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}