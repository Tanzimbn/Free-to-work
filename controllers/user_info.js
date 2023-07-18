const userModel = require("../models/users");

exports.find_user = async (req, res) => {
    try {
        const {id} = req.body;
        const ans = await userModel.find({_id : id});
        res.json(ans[0])

    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}