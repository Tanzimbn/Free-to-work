const mongoose = require("mongoose");
const { baseUserFields } = require("./users");

const verifySchema = new mongoose.Schema({ ...baseUserFields }, { timestamps: true });

const verifyModel = mongoose.model("verify", verifySchema);

module.exports = verifyModel;
