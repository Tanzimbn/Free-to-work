const mongoose = require("mongoose");
var SchemaTypes = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    nid : {
        type : String,
        required: true
    },
    gender: {
        type: String
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    phone: {
        type: String
    },
    division: {
        type: String
    },
    district: {
        type: String
    },
    Station: {
        type: String
    }
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;